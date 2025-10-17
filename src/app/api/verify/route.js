import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

/**
 * Script Verification API Route
 * 
 * This API endpoint verifies if the Trustwards script is installed on a website.
 * It uses a hybrid approach for efficiency:
 * 1. First attempts a fast HTML fetch + parsing (< 3 seconds)
 * 2. Falls back to Playwright for dynamic scripts if needed
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FAST_FETCH_TIMEOUT_MS = 5000; // 5 seconds for fast fetch attempt
const MAX_VERIFICATION_TIME_MS = 30000; // Maximum 30 seconds for Playwright verification

/**
 * Fast HTML Fetch Verification
 * Attempts to find the script by fetching and parsing HTML directly
 * This is 10-100x faster than launching a browser
 * 
 * @param {string} url - URL to check
 * @param {string} scriptUrl - Script URL to search for
 * @returns {Promise<{found: boolean, method: string}>}
 */
async function fastHTMLVerification(url, scriptUrl) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FAST_FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { found: false, method: 'fast-fetch-error' };
    }

    const html = await response.text();
    
    // Extract the unique part of the script URL (the siteId.js part)
    const scriptIdentifier = scriptUrl.split('/').pop(); // e.g., "abc123.js"
    
    // Multiple strategies to find the script:
    // 1. Direct src match
    if (html.includes(scriptUrl)) {
      return { found: true, method: 'fast-fetch-direct' };
    }
    
    // 2. Partial match (in case of CDN variations or relative paths)
    if (html.includes(scriptIdentifier)) {
      return { found: true, method: 'fast-fetch-partial' };
    }
    
    // 3. Regex pattern for script tags
    const scriptTagPattern = new RegExp(`<script[^>]*src=["'][^"']*${scriptIdentifier}[^"']*["'][^>]*>`, 'i');
    if (scriptTagPattern.test(html)) {
      return { found: true, method: 'fast-fetch-regex' };
    }

    return { found: false, method: 'fast-fetch-not-found' };

  } catch (error) {
    console.log('Fast fetch error:', error.message);
    return { found: false, method: 'fast-fetch-exception' };
  }
}

/**
 * Playwright Verification (Fallback)
 * Used when fast fetch doesn't find the script
 * Handles dynamically loaded scripts
 * 
 * @param {string} url - URL to check
 * @param {string} scriptUrl - Script URL to search for
 * @returns {Promise<{found: boolean, method: string}>}
 */
async function playwrightVerification(url, scriptUrl) {
  let browser;
  
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
    });

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      ignoreHTTPSErrors: true,
      viewport: { width: 1366, height: 768 },
    });

    const page = await context.newPage();
    page.setDefaultTimeout(MAX_VERIFICATION_TIME_MS);

    // Navigate to the page
    await page.goto(url, { 
      waitUntil: 'load',
      timeout: MAX_VERIFICATION_TIME_MS 
    });

    // Try to detect the script with retries for dynamic loading
    let scriptExists = false;
    const maxRetries = 10; // Reduced from 15 since we already tried fast fetch
    const retryDelay = 1500; // 1.5 seconds between retries
    
    for (let i = 0; i < maxRetries; i++) {
      scriptExists = await page.evaluate((scriptUrl) => {
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
          if (script.src && script.src.includes(scriptUrl)) {
            return true;
          }
        }
        return false;
      }, scriptUrl);

      if (scriptExists) {
        console.log(`Script found with Playwright on attempt ${i + 1}`);
        break;
      }
      
      if (i < maxRetries - 1) {
        await page.waitForTimeout(retryDelay);
      }
    }

    await browser.close();

    return { 
      found: scriptExists, 
      method: scriptExists ? 'playwright-dynamic' : 'playwright-not-found' 
    };

  } catch (error) {
    console.error('Playwright verification error:', error);
    if (browser) {
      await browser.close();
    }
    return { found: false, method: 'playwright-error' };
  }
}

/**
 * POST /api/verify
 * 
 * @param {Request} req - Request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.domain - Domain to verify (required)
 * @param {string} req.body.siteId - Site identifier (required)
 * 
 * @returns {Object} Response containing:
 *   - success: boolean indicating if script was found
 *   - message: descriptive message
 *   - scriptUrl: the script URL that was searched for
 *   - verificationMethod: method used to verify (fast-fetch or playwright)
 */

export async function POST(req) {
  const startTime = Date.now();
  
  try {
    // ========== 1. REQUEST VALIDATION ==========
    const { domain, siteId } = await req.json();
    
    if (!domain) {
      return NextResponse.json({ 
        success: false,
        error: 'Domain is required' 
      }, { status: 400 });
    }

    if (!siteId) {
      return NextResponse.json({ 
        success: false,
        error: 'Site ID is required' 
      }, { status: 400 });
    }

    // Security validation: prevent malicious URLs
    if (/^(javascript:|data:|file:)/i.test(domain)) {
      return NextResponse.json({ 
        success: false,
        error: 'URL not allowed' 
      }, { status: 400 });
    }
    
    // Build complete URL
    const url = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
    const scriptUrl = `https://cdn.trustwards.io/storage/v1/object/public/cdn-script/${siteId}.js`;

    console.log(`🔍 Starting verification for ${url}`);

    // ========== 2. FAST VERIFICATION ATTEMPT ==========
    console.log('⚡ Attempting fast HTML fetch...');
    const fastResult = await fastHTMLVerification(url, scriptUrl);
    
    if (fastResult.found) {
      const duration = Date.now() - startTime;
      console.log(`✅ Script found via fast fetch (${fastResult.method}) in ${duration}ms`);
      
      return NextResponse.json({
        success: true,
        message: 'Site verified successfully!',
        scriptUrl: scriptUrl,
        verificationMethod: fastResult.method,
        duration: duration
      });
    }

    console.log(`⏭️ Fast fetch didn't find script (${fastResult.method}), falling back to Playwright...`);

    // ========== 3. PLAYWRIGHT VERIFICATION (FALLBACK) ==========
    const playwrightResult = await playwrightVerification(url, scriptUrl);
    const duration = Date.now() - startTime;

    if (playwrightResult.found) {
      console.log(`✅ Script found via Playwright (${playwrightResult.method}) in ${duration}ms`);
      
      return NextResponse.json({
        success: true,
        message: 'Site verified successfully!',
        scriptUrl: scriptUrl,
        verificationMethod: playwrightResult.method,
        duration: duration
      });
    }

    console.log(`❌ Script not found after both attempts (${duration}ms)`);

    return NextResponse.json({
      success: false,
      message: "The script couldn't be found on your website",
      scriptUrl: scriptUrl,
      verificationMethod: playwrightResult.method,
      duration: duration
    });

  } catch (error) {
    console.error('Verification error:', error);
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: false,
      message: 'An error occurred during verification. Please try again.',
      error: error.message,
      duration: duration
    }, { status: 500 });
  }
}

