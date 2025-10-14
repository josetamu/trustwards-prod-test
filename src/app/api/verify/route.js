import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

/**
 * Script Verification API Route
 * 
 * This API endpoint verifies if the Trustwards script is installed on a website.
 * It uses Playwright with Chromium to visit the site and check if the script tag exists.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_VERIFICATION_TIME_MS = 30000; // Maximum 60 seconds for verification

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
 */

export async function POST(req) {
  let browser;
  
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

    // ========== 2. BROWSER SETUP ==========
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

    // Set timeout for the verification
    page.setDefaultTimeout(MAX_VERIFICATION_TIME_MS);

    // ========== 3. VISIT WEBSITE AND CHECK FOR SCRIPT ==========
    try {
      // Navigate to the page - use 'load' which is more permissive than 'networkidle'
      // 'load' waits for the load event (window.onload) which fires when all resources are loaded
      await page.goto(url, { 
        waitUntil: 'load',
        timeout: MAX_VERIFICATION_TIME_MS 
      });

      // Try to detect the script with retries in case it's added dynamically
      let scriptExists = false;
      const maxRetries = 15; // Increased retries for dynamic scripts
      const retryDelay = 1500; // 1.5 seconds between retries
      
      for (let i = 0; i < maxRetries; i++) {
        scriptExists = await page.evaluate((scriptUrl) => {
          const scripts = document.querySelectorAll('script');
          for (const script of scripts) {
            // Check if script has src attribute that matches our script URL
            if (script.src && script.src.includes(scriptUrl)) {
              return true;
            }
          }
          return false;
        }, scriptUrl);

        // If found, break early
        if (scriptExists) {
          console.log(`Script found on attempt ${i + 1}`);
          break;
        }
        
        // If not found and not last retry, wait before trying again
        if (i < maxRetries - 1) {
          console.log(`Script not found on attempt ${i + 1}, waiting ${retryDelay}ms before retry...`);
          await page.waitForTimeout(retryDelay);
        }
      }

      await browser.close();

      if (scriptExists) {
        return NextResponse.json({
          success: true,
          message: 'Site verified successfully!',
          scriptUrl: scriptUrl
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "The script couldn't be found on your website",
          scriptUrl: scriptUrl
        });
      }

    } catch (navigationError) {
      console.error('Navigation error:', navigationError);
      await browser.close();
      
      return NextResponse.json({
        success: false,
        message: 'Failed to access the website. Please check if the domain is correct and accessible.',
        error: navigationError.message
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Verification error:', error);
    
    if (browser) {
      await browser.close();
    }

    return NextResponse.json({
      success: false,
      message: 'An error occurred during verification. Please try again.',
      error: error.message
    }, { status: 500 });
  }
}

