import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

/**
 * Cookie Scanner API Route
 * 
 * This API endpoint scans websites to detect and analyze cookies being set through various methods:
 * - HTTP Set-Cookie headers
 * - JavaScript document.cookie
 * - CookieStore API
 * - Pre-existing cookies
 * - Custom scripts and iframes with data-tw-category attributes
 * 
 * It uses Playwright with Chromium to simulate a real browser environment and
 * employs multiple detection strategies including CDP (Chrome DevTools Protocol)
 * event monitoring and JavaScript hooks.
 * 
 * Additionally, it discovers all pages on the site using a 3-tier strategy:
 * 1. Sitemap.xml (WordPress, Webflow, etc.) - Most complete and efficient
 * 2. Link crawling from homepage - Fallback for sites without sitemap
 * 3. Homepage only - Last resort if no links found
 * 
 * Then verifies how many pages have the Trustwards script installed.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Maximum execution time in seconds (Vercel Pro plan required for >10s)

// Configuration constants
const QUIET_PERIOD_MS = 7000;    // 7 seconds of no activity before considering scan complete
const MIN_WAIT_TIME_MS = 15000;  // Minimum 15 seconds wait time
const MAX_SCAN_TIME_MS = 60000;  // Maximum 60 seconds total scan time
const MAX_PAGES_TO_CRAWL = 50;   // Maximum number of pages to crawl for script verification
const PAGE_FETCH_TIMEOUT_MS = 5000; // 5 seconds timeout for each page fetch

/**
 * Fast check if a page has the Trustwards script
 * @param {string} url - URL to check
 * @param {string} scriptIdentifier - Script filename to search for (e.g., "siteId.js")
 * @returns {Promise<boolean>} True if script found
 */
async function quickScriptCheck(url, scriptIdentifier) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PAGE_FETCH_TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (!response.ok) return false;

    const html = await response.text();
    
    // Check if the script identifier exists in the HTML
    return html.includes(scriptIdentifier);

  } catch (error) {
    console.log(`Error checking ${url}:`, error.message);
    return false;
  }
}

/**
 * Check if content is a sitemap index (contains references to other sitemaps)
 * @param {string} content - XML content
 * @returns {boolean} True if sitemap index
 */
function isSitemapIndex(content) {
  return content.includes('<sitemapindex') || content.includes('</sitemap>');
}

/**
 * Parse sitemap XML and extract URLs (handles both regular sitemaps and sitemap indices)
 * @param {string} sitemapContent - Sitemap XML content
 * @param {string} baseDomain - Base domain to filter URLs
 * @returns {string[]} Array of URLs (non-XML pages only)
 */
function parseSitemapXML(sitemapContent, baseDomain) {
  const urls = new Set();
  
  try {
    // Match <loc> tags in sitemap
    const locRegex = /<loc>\s*([^<]+)\s*<\/loc>/gi;
    let match;
    
    while ((match = locRegex.exec(sitemapContent)) !== null) {
      const url = match[1].trim();
      
      try {
        const urlObj = new URL(url);
        const urlDomain = urlObj.hostname.replace(/^www\./, '');
        
        // Only include URLs from the same domain
        if (urlDomain === baseDomain) {
          // Skip XML files (sub-sitemaps) - we'll handle them separately
          if (!url.endsWith('.xml')) {
            // Normalize URL (remove hash and trailing slash)
            const normalized = `${urlObj.origin}${urlObj.pathname}`.replace(/\/$/, '') || urlObj.origin;
            urls.add(normalized);
          }
        }
      } catch (e) {
        // Invalid URL in sitemap, skip
      }
    }
  } catch (error) {
    console.log('Error parsing sitemap XML:', error.message);
  }
  
  return Array.from(urls);
}

/**
 * Extract sub-sitemap URLs from a sitemap index
 * @param {string} sitemapContent - Sitemap index XML content
 * @returns {string[]} Array of sub-sitemap URLs
 */
function extractSubSitemaps(sitemapContent) {
  const subSitemaps = [];
  
  try {
    const locRegex = /<loc>\s*([^<]+)\s*<\/loc>/gi;
    let match;
    
    while ((match = locRegex.exec(sitemapContent)) !== null) {
      const url = match[1].trim();
      
      // Only include XML files (sub-sitemaps)
      if (url.endsWith('.xml')) {
        subSitemaps.push(url);
      }
    }
  } catch (error) {
    console.log('Error extracting sub-sitemaps:', error.message);
  }
  
  return subSitemaps;
}

/**
 * Fetch and parse a single sitemap or sitemap index recursively
 * @param {string} sitemapUrl - URL of the sitemap
 * @param {string} baseDomain - Base domain to filter URLs
 * @param {number} depth - Current recursion depth
 * @returns {Promise<string[]>} Array of URLs from sitemap
 */
async function fetchAndParseSitemap(sitemapUrl, baseDomain, depth = 0) {
  // Prevent infinite recursion
  if (depth > 3) {
    console.log(`⚠️  Max recursion depth reached for ${sitemapUrl}`);
    return [];
  }
  
  try {
    const response = await fetch(sitemapUrl, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) return [];
    
    const content = await response.text();
    
    // Check if this is a sitemap index (contains other sitemaps)
    if (isSitemapIndex(content)) {
      console.log(`📑 Found sitemap index, fetching sub-sitemaps... (depth: ${depth})`);
      
      const subSitemaps = extractSubSitemaps(content);
      console.log(`   Found ${subSitemaps.length} sub-sitemaps`);
      
      // Fetch all sub-sitemaps in parallel
      const subSitemapPromises = subSitemaps.map(subUrl => 
        fetchAndParseSitemap(subUrl, baseDomain, depth + 1)
      );
      
      const results = await Promise.all(subSitemapPromises);
      
      // Flatten and deduplicate all URLs
      const allUrls = new Set();
      results.forEach(urls => {
        urls.forEach(url => allUrls.add(url));
      });
      
      return Array.from(allUrls);
    } else {
      // Regular sitemap with page URLs
      const urls = parseSitemapXML(content, baseDomain);
      console.log(`   Found ${urls.length} page URLs`);
      return urls;
    }
  } catch (e) {
    console.log(`Error fetching sitemap ${sitemapUrl}:`, e.message);
    return [];
  }
}

/**
 * Fetch and parse sitemap to get all site URLs
 * @param {string} baseUrl - Base URL of the site
 * @returns {Promise<string[]>} Array of URLs from sitemap
 */
async function fetchSitemapUrls(baseUrl) {
  const urlObj = new URL(baseUrl);
  const baseDomain = urlObj.hostname.replace(/^www\./, '');
  const origin = urlObj.origin;
  
  // Common sitemap locations
  const sitemapPaths = [
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/sitemap-index.xml',
    '/wp-sitemap.xml', // WordPress default
    '/sitemap1.xml',
    '/sitemap',
  ];
  
  console.log(`🗺️  Searching for sitemap on ${origin}...`);
  
  // Try to find sitemap from robots.txt first
  try {
    const robotsUrl = `${origin}/robots.txt`;
    const robotsResponse = await fetch(robotsUrl, {
      signal: AbortSignal.timeout(5000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (robotsResponse.ok) {
      const robotsText = await robotsResponse.text();
      const sitemapMatch = robotsText.match(/Sitemap:\s*([^\s]+)/i);
      
      if (sitemapMatch) {
        const sitemapUrl = sitemapMatch[1].trim();
        console.log(`📍 Found sitemap in robots.txt: ${sitemapUrl}`);
        
        const urls = await fetchAndParseSitemap(sitemapUrl, baseDomain);
        
        if (urls.length > 0) {
          console.log(`✅ Successfully parsed sitemap: found ${urls.length} URLs`);
          return urls;
        }
      }
    }
  } catch (e) {
    console.log('Error reading robots.txt:', e.message);
  }
  
  // Try common sitemap locations
  for (const path of sitemapPaths) {
    try {
      const sitemapUrl = `${origin}${path}`;
      const urls = await fetchAndParseSitemap(sitemapUrl, baseDomain);
      
      if (urls.length > 0) {
        console.log(`✅ Found sitemap at ${path}: ${urls.length} URLs`);
        return urls;
      }
    } catch (e) {
      // Try next location
    }
  }
  
  console.log('⚠️  No sitemap found');
  return [];
}

/**
 * Extract internal links from the current page using Playwright
 * @param {Page} page - Playwright page object
 * @param {string} baseDomain - Base domain to filter links
 * @param {number} maxLinks - Maximum number of links to return
 * @returns {Promise<string[]>} Array of internal URLs
 */
async function crawlInternalLinks(page, baseDomain, maxLinks = MAX_PAGES_TO_CRAWL) {
  try {
    const links = await page.evaluate((domain, max) => {
      const anchors = document.querySelectorAll('a[href]');
      const urls = new Set();
      
      for (const anchor of anchors) {
        if (urls.size >= max) break;
        
        try {
          const href = anchor.href;
          if (!href) continue;
          
          const url = new URL(href);
          const urlDomain = url.hostname.replace(/^www\./, '');
          
          // Only include links from the same domain
          if (urlDomain === domain) {
            // Normalize URL (remove hash, query params for uniqueness, and trailing slash)
            const normalized = `${url.origin}${url.pathname}`.replace(/\/$/, '') || url.origin;
            
            // Skip common non-page URLs
            if (!normalized.match(/\.(xml|json|pdf|zip|jpg|jpeg|png|gif|svg|css|js|ico)$/i)) {
              urls.add(normalized);
            }
          }
        } catch (e) {
          // Invalid URL, skip
        }
      }
      
      return Array.from(urls);
    }, baseDomain, maxLinks);
    
    return links;
  } catch (error) {
    console.log('Error crawling internal links:', error.message);
    return [];
  }
}

/**
 * Crawl site and count pages with Trustwards script installed
 * Uses a 3-tier strategy: sitemap → link crawling → homepage only
 * @param {Page} page - Playwright page object  
 * @param {string} baseUrl - Base URL of the site
 * @param {string} scriptIdentifier - Script filename to search for
 * @returns {Promise<number>} Number of pages with script installed
 */
async function crawlAndCountPages(page, baseUrl, scriptIdentifier) {
  try {
    const urlObj = new URL(baseUrl);
    const baseDomain = urlObj.hostname.replace(/^www\./, '');
    const normalizedBaseUrl = `${urlObj.origin}${urlObj.pathname}`.replace(/\/$/, '') || urlObj.origin;
    
    console.log(`\n🔍 Starting page crawl for ${baseDomain}...`);
    
    let allUrls = [];
    let crawlMethod = 'unknown';
    
    // ========== TIER 1: Try to get URLs from sitemap ==========
    console.log('📍 Tier 1: Attempting sitemap discovery...');
    const sitemapUrls = await fetchSitemapUrls(baseUrl);
    
    if (sitemapUrls.length > 0) {
      allUrls = sitemapUrls;
      crawlMethod = 'sitemap';
      console.log(`✅ Found ${sitemapUrls.length} URLs from sitemap`);
    } else {
      // ========== TIER 2: Crawl internal links from the page ==========
      console.log('📍 Tier 2: No sitemap found, crawling internal links...');
      
      try {
        const internalLinks = await crawlInternalLinks(page, baseDomain);
        
        if (internalLinks.length > 0) {
          allUrls = internalLinks;
          crawlMethod = 'link-crawl';
          console.log(`✅ Found ${internalLinks.length} URLs by crawling links`);
        } else {
          // ========== TIER 3: Use homepage only ==========
          console.log('📍 Tier 3: No internal links found, using homepage only');
          allUrls = [];
          crawlMethod = 'homepage-only';
        }
      } catch (crawlError) {
        console.log('⚠️  Link crawling failed:', crawlError.message);
        allUrls = [];
        crawlMethod = 'homepage-only';
      }
    }
    
    // Always include the base URL (homepage) if not already present
    if (!allUrls.includes(normalizedBaseUrl)) {
      allUrls.unshift(normalizedBaseUrl);
    }
    
    // Limit to max pages to avoid excessive scanning time
    const urlsToCheck = allUrls.slice(0, MAX_PAGES_TO_CRAWL);
    
    console.log(`📄 Checking ${urlsToCheck.length} pages for script installation (method: ${crawlMethod})...\n`);
    
    // Check all pages in parallel for efficiency
    const checkPromises = urlsToCheck.map(async (url) => {
      const hasScript = await quickScriptCheck(url, scriptIdentifier);
      return { url, hasScript };
    });
    
    const results = await Promise.all(checkPromises);
    
    // Log each page with script detected
    const pagesWithScript = [];
    const pagesWithoutScript = [];
    
    results.forEach(({ url, hasScript }) => {
      if (hasScript) {
        pagesWithScript.push(url);
        console.log(`✅ Script found on: ${url}`);
      } else {
        pagesWithoutScript.push(url);
        console.log(`❌ Script NOT found on: ${url}`);
      }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   🔍 Discovery method: ${crawlMethod}`);
    console.log(`   ✅ Pages WITH script: ${pagesWithScript.length}`);
    console.log(`   ❌ Pages WITHOUT script: ${pagesWithoutScript.length}`);
    console.log(`   📄 Total pages checked: ${results.length}`);
    console.log(`   📊 Installation rate: ${((pagesWithScript.length / results.length) * 100).toFixed(1)}%\n`);
    
    return pagesWithScript.length;
    
  } catch (error) {
    console.error('Error during page crawl:', error);
    // Return 1 (current page) as fallback
    return 1;
  }
}

/**
 * POST /api/scan-cookies
 * 
 * @param {Request} req - Request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.domain - Domain to scan (required)
 * @param {string} req.body.siteId - Site identifier (optional)
 * @param {string} req.body.urlPath - URL path to scan (default: '/')
 * 
 * @returns {Object} Response containing:
 *   - siteId: Site identifier
 *   - domain: Scanned domain
 *   - url: Full URL scanned
 *   - count: Number of unique cookies detected
 *   - scriptsScanned: Array of detected cookies with their sources and methods
 *   - iframesScanned: Array of detected iframes
 *   - pagesCount: Number of pages with Trustwards script installed
 */

export async function POST(req) {
  let browser;
  
  try {
    // ========== 1. REQUEST VALIDATION ==========
    const { domain, siteId, urlPath = '/' } = await req.json();
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Security validation: prevent malicious URLs
    if (/^(javascript:|data:|file:)/i.test(domain) || /^(javascript:|data:|file:)/i.test(urlPath)) {
      return NextResponse.json({ error: 'URL not allowed' }, { status: 400 });
    }
    
    // Build complete URL
    const base = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
    const url = new URL(urlPath, base).toString();

    // ========== 2. BROWSER SETUP ==========
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-features=Prerender2,InterestCohortApi,PrivacySandboxAdsAPIs',
      ],
    });

    // Create deterministic browser context
    const context = await browser.newContext({
      locale: 'en-US',
      timezoneId: 'America/New_York',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      ignoreHTTPSErrors: true,
      serviceWorkers: 'block',
      viewport: { width: 1366, height: 768 },
    });

    const page = await context.newPage();

    // ========== 3. CDP (Chrome DevTools Protocol) SETUP ==========
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Page.enable');

    // ========== 4. FRAME TRACKING ==========
    // Track iframes and their relationships
    const framesIndex = new Map();
    const uniqueIframes = new Set();

    // Listen for frame attachment events
    cdp.on('Page.frameAttached', (evt) => {
      try {
        const { frameId, parentFrameId } = evt;
        const prev = framesIndex.get(frameId) || {};
        framesIndex.set(frameId, {
          id: frameId,
          parentId: parentFrameId || prev.parentId || null,
          url: prev.url || 'about:blank',
          name: prev.name || null,
        });
      } catch {
        // Ignore frame attachment errors - non-critical for cookie detection
      }
    });

    // Listen for frame navigation events
    cdp.on('Page.frameNavigated', (evt) => {
      try {
        const f = evt.frame || {};
        const prev = framesIndex.get(f.id) || {};
        framesIndex.set(f.id, {
          id: f.id,
          parentId: (typeof f.parentId !== 'undefined') ? f.parentId : (prev.parentId || null),
          url: f.url || prev.url || 'about:blank',
          name: f.name || prev.name || null,
        });
      } catch {
        // Ignore frame navigation errors - non-critical for cookie detection
      }
    });

    // ========== 5. HELPER FUNCTIONS ==========
    
    /**
     * Extract origin from URL
     * @param {string} u - URL string
     * @returns {string|null} Origin or null if invalid
     */
    const getOrigin = (u) => { 
      try { return new URL(u).origin; } 
      catch { 
        // Invalid URL - return null
        return null; 
      } 
    };
    
    /**
     * Check if URL has trivial scheme (about:, data:)
     * @param {string} u - URL to check
     * @returns {boolean} True if trivial scheme
     */
    const isTrivialScheme = (u) => /^about:|^data:/i.test(String(u || ''));

    // ========== 6. COOKIE EVENT ACCUMULATOR ==========
    // Map to store unique cookie events with deduplication
    const cookieEvents = new Map();
    let lastEventTimestamp = Date.now();

    /**
     * Update the last event timestamp
     */
    const touch = () => { 
      lastEventTimestamp = Date.now(); 
    };
    
    /**
     * Add a cookie detection event with deduplication logic
     * @param {string} cookieName - Name of the cookie
     * @param {string} src - Source URL or identifier where cookie was set
     * @param {string} method - Method used to set cookie (http-set-cookie, document.cookie, etc.)
     * @param {string|null} customCategory - Optional category for custom scripts/iframes
     */
    const addCookieEvent = (cookieName, src, method, customCategory = null) => {
      // Skip test/configuration cookies
      if (isTestCookie(cookieName)) return;
      
      // Create unique key for complete deduplication
      const key = customCategory 
        ? `${cookieName}::${method}::${src}::${customCategory}`
        : `${cookieName}::${method}::${src}`;
      
      // If exact combination already exists, skip
      if (cookieEvents.has(key)) {
        return;
      }
      
      // Custom scripts don't deduplicate with other methods
      if (method === 'custom') {
        const eventData = { cookieName, src, method };
        if (customCategory) eventData.customCategory = customCategory;
        cookieEvents.set(key, eventData);
        touch();
        try { page.evaluate(() => window.__tw_cookie_event?.()); } catch {
          // Ignore evaluation errors - page context may not be available
        }
        return;
      }
      
      // Check if same cookie exists with same method but different source
      let existingKey = null;
      for (const [k, v] of cookieEvents.entries()) {
        if (v.cookieName === cookieName && v.method === method && v.method !== 'custom') {
          existingKey = k;
          break;
        }
      }
      
      if (existingKey) {
        const existing = cookieEvents.get(existingKey);
        // Only update if we have better source information
        if (existing.src === 'unknown' && src !== 'unknown') {
          cookieEvents.delete(existingKey);
          cookieEvents.set(key, { cookieName, src, method });
        } else if (src && src !== 'unknown' && src !== 'inline-script' && 
                   (existing.src === 'inline-script' || existing.src === 'unknown' || existing.src === 'pre-existing')) {
          cookieEvents.delete(existingKey);
          cookieEvents.set(key, { cookieName, src, method });
        }
      } else {
        // Add new cookie event
        cookieEvents.set(key, { cookieName, src: src || 'unknown', method });
      }
      
      touch();
      try { page.evaluate(() => window.__tw_cookie_event?.()); } catch {
        // Ignore evaluation errors - page context may not be available
      }
    };

    /**
     * Detect test/configuration cookies that should be filtered out
     * @param {string} name - Cookie name
     * @returns {boolean} True if test cookie
     */
    const isTestCookie = (name) => {
      // Currently not filtering - can be customized
      return false;
    };

    // ========== 7. NETWORK REQUEST TRACKING ==========
    // Track request initiators to determine cookie sources
    const initiatorByRequestId = new Map();
    const urlByRequestId = new Map();
    const lastInitiatorByUrl = new Map();

    /**
     * Extract source URL from request initiator
     * @param {Object} initiator - CDP initiator object
     * @returns {string|null} Source URL or null
     */
    const getInitiatorSource = (initiator) => {
      try {
        if (!initiator) return null;
        
        // Check call stack frames
        const frames = initiator.stack?.callFrames || [];
        for (const f of frames) {
          if (f?.url && /^https?:\/\//.test(f.url)) return f.url;
        }
        
        // Check direct URL
        if (initiator.url && /^https?:\/\//.test(initiator.url)) return initiator.url;
        
        return null;
      } catch { 
        // Error parsing initiator - return null
        return null; 
      }
    };

    // Track request initiators
    cdp.on('Network.requestWillBeSent', (evt) => {
      try {
        const requestId = evt.requestId;
        const requestUrl = evt.request?.url;
        const initiatorSource = getInitiatorSource(evt.initiator) || null;
        
        if (requestId) {
          initiatorByRequestId.set(requestId, initiatorSource);
          if (requestUrl) {
            urlByRequestId.set(requestId, requestUrl);
            if (initiatorSource) {
              lastInitiatorByUrl.set(requestUrl, initiatorSource);
            }
          }
        }
      } catch {
        // Ignore request tracking errors - non-critical
      }
    });

    // Track response URLs
    cdp.on('Network.responseReceived', (evt) => {
      try {
        if (evt?.requestId && evt?.response?.url) {
          urlByRequestId.set(evt.requestId, evt.response.url);
        }
      } catch {
        // Ignore response tracking errors - non-critical
      }
    });

    // Detect cookies from HTTP Set-Cookie headers (CDP)
    cdp.on('Network.responseReceivedExtraInfo', (evt) => {
      try {
        const headers = evt.headers || {};
        const toArray = (v) => Array.isArray(v) ? v : (v ? [v] : []);
        const setCookieHeaders = toArray(headers['set-cookie']);
        
        if (!setCookieHeaders.length) return;

        const requestId = evt.requestId;
        const initiatorSource = requestId ? (initiatorByRequestId.get(requestId) || null) : null;
        const urlFromRequest = requestId ? (urlByRequestId.get(requestId) || null) : null;
        const source = initiatorSource || urlFromRequest || null;

        for (const setCookie of setCookieHeaders) {
          const firstPart = String(setCookie).split(';', 1)[0];
          const name = firstPart.split('=')[0]?.trim();
          if (!name) continue;
          addCookieEvent(name, source, 'http-set-cookie');
        }
      } catch {
        // Ignore header parsing errors - continue with other detection methods
      }
    });

    // Detect cookies from HTTP responses (Playwright)
    page.on('response', async (res) => {
      try {
        const responseUrl = res.url();
        let setCookies = [];
        const anyRes = res;
        
        // Handle different response formats
        if (typeof anyRes.headersArray === 'function') {
          const arr = anyRes.headersArray();
          setCookies = arr.filter(h => h.name.toLowerCase() === 'set-cookie').map(h => h.value);
        } else {
          const obj = res.headers();
          const sc = obj['set-cookie'];
          setCookies = sc ? (Array.isArray(sc) ? sc : [sc]) : [];
        }
        
        if (!setCookies.length) return;

        const source = lastInitiatorByUrl.get(responseUrl) || responseUrl;

        for (const setCookie of setCookies) {
          if (typeof setCookie !== 'string') continue;
          const firstPart = setCookie.split(';', 1)[0];
          const name = firstPart.split('=')[0]?.trim();
          if (!name) continue;
          addCookieEvent(name, source, 'http-set-cookie');
        }
      } catch {
        // Ignore response parsing errors - continue with other detection methods
      }
    });

    // ========== 8. PAGE COOKIE EVENT LISTENER ==========
    // Expose function for page to notify about cookie events
    let cookieEventResolver = null;
    const cookiePing = new Promise((resolve) => { 
      cookieEventResolver = resolve; 
    });
    
    await page.exposeFunction('__tw_cookie_event', () => { 
      try { cookieEventResolver?.(); } catch {
        // Ignore resolver errors - non-critical
      } 
    });

    // ========== 9. INJECT CLIENT-SIDE COOKIE DETECTION ==========
    await page.addInitScript(() => {
      // Initialize tracking structures
      window.__tw_detected_cookies = new Map();
      window.__tw_currentScriptSrc = null;
      window.__tw_isInConfigArray = false;
      window.__tw_custom_scripts = [];
      window.__tw_custom_iframes = [];

      /**
       * Add detected cookie to tracking map
       * @param {string} cookieName - Cookie name
       * @param {string} src - Source location
       * @param {string} method - Detection method
       * @param {string|null} customCategory - Optional category
       */
      const addDetectedCookie = (cookieName, src, method, customCategory = null) => {
        // Skip if we're inside a configuration array (not real cookies)
        if (window.__tw_isInConfigArray) return;
        
        // Filter out configuration cookies that aren't actually set
        if (cookieName === '_ga' || /^GTM-[A-Z0-9]+$/.test(cookieName)) {
          const currentCookies = document.cookie.split(';').map(c => c.trim().split('=')[0]);
          if (!currentCookies.includes(cookieName)) {
            return; // Configuration name, not a real cookie
          }
        }
        
        const key = customCategory 
          ? `${cookieName}::${method}::${src}::${customCategory}`
          : `${cookieName}::${method}::${src}`;
          
        if (!window.__tw_detected_cookies.has(key)) {
          const data = { cookieName, src, method };
          if (customCategory) data.customCategory = customCategory;
          window.__tw_detected_cookies.set(key, data);
          try { window.__tw_cookie_event?.(); } catch {
            // Ignore event notification errors - non-critical
          }
        }
      };

      /**
       * Parse cookie name from cookie string
       * @param {string} v - Cookie string
       * @returns {string|null} Cookie name or null
       */
      const parseName = (v) => {
        if (typeof v !== 'string') return null;
        const first = v.split(';', 1)[0];
        const idx = first.indexOf('=');
        return idx > 0 ? first.slice(0, idx).trim() : null;
      };

      /**
       * Extract source URL from stack trace
       * @param {string} stack - Error stack trace
       * @returns {string|null} Source URL or null
       */
      const srcFromStack = (stack) => {
        if (!stack) return null;
        const lines = String(stack).split('\n');
        for (const l of lines) {
          const m = l.match(/\((https?:\/\/[^\s)]+)\)/) || l.match(/\bat\s+(https?:\/\/[^\s)]+)\b/);
          if (m && m[1]) return m[1];
        }
        return null;
      };

      /**
       * Set current script source context
       * @param {string} src - Source identifier
       * @returns {Function} Restore function
       */
      const setCurrent = (src) => {
        const prev = window.__tw_currentScriptSrc;
        window.__tw_currentScriptSrc = src;
        return () => { window.__tw_currentScriptSrc = prev; };
      };

      // ========== DETECT CONFIGURATION ARRAYS ==========
      // Override Array.push to detect when configuration objects are being pushed
      const originalPush = Array.prototype.push;
      Array.prototype.push = function(...args) {
        // Check if pushing configuration objects
        const isConfigPush = args.some(arg => 
          arg && typeof arg === 'object' && 
          ('cookieName' in arg || 'category' in arg || 'description' in arg)
        );
        
        if (isConfigPush) {
          window.__tw_isInConfigArray = true;
          const result = originalPush.apply(this, args);
          window.__tw_isInConfigArray = false;
          return result;
        }
        
        return originalPush.apply(this, args);
      };

      // ========== WRAP DOM INSERTION METHODS ==========
      /**
       * Wrap DOM insertion method to track inline script sources
       * @param {Object} proto - Prototype object
       * @param {string} method - Method name
       */
      const wrapInsert = (proto, method) => {
        const orig = proto[method];
        if (!orig) return;
        
        proto[method] = function(...args) {
          const node = args[0];
          if (node && node.tagName === 'SCRIPT' && !node.src) {
            const virtualSrc = `inline@${location.href}#${method}`;
            const restore = setCurrent(virtualSrc);
            try { 
              return orig.apply(this, args); 
            } finally { 
              restore(); 
            }
          }
          return orig.apply(this, args);
        };
      };

      // Wrap various DOM insertion methods
      try {
        wrapInsert(Node.prototype, 'appendChild');
        wrapInsert(Element.prototype, 'insertBefore');
        wrapInsert(Element.prototype, 'replaceChild');
      } catch {
        // Ignore wrapping errors - browser may not support all methods
      }

      // Wrap document.write methods
      try {
        const w = document.write;
        document.write = function(...args) {
          const restore = setCurrent(`document.write@${location.href}`);
          try { return w.apply(this, args); }
          finally { restore(); }
        };
        
        const wl = document.writeln;
        document.writeln = function(...args) {
          const restore = setCurrent(`document.writeln@${location.href}`);
          try { return wl.apply(this, args); }
          finally { restore(); }
        };
      } catch {
        // Ignore document.write wrapping errors - older browsers may not support
      }

      // ========== HOOK document.cookie ==========
      try {
        const desc =
          Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
          Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
          
        if (desc && desc.set && desc.get) {
          const originalSet = desc.set;
          const originalGet = desc.get;
          
          const replacementSetter = function (v) {
            try {
              const err = new Error('cookie-set');
              const name = parseName(v);
              const source =
                window.__tw_currentScriptSrc ||
                (document.currentScript?.src || (document.currentScript ? 'inline-script' : null)) ||
                srcFromStack(err.stack) ||
                'unknown';
                
              if (name) {
                addDetectedCookie(name, source, 'document.cookie');
              }
            } catch {
              // Ignore cookie detection errors - still set the cookie
            }
            return originalSet.call(document, v);
          };
          
          Object.defineProperty(Document.prototype, 'cookie', {
            configurable: true,
            enumerable: true,
            get() { return originalGet.call(document); },
            set: replacementSetter,
          });
        }
      } catch {
        // Ignore cookie hooking errors - browser may not support property descriptors
      }

      // ========== HOOK CookieStore API ==========
      if ('cookieStore' in window) {
        try {
          const _set = cookieStore.set.bind(cookieStore);
          cookieStore.set = async function(...args) {
            try {
              const err = new Error('cookieStore.set');
              const name = typeof args[0] === 'string' ? args[0] : args[0]?.name;
              const source =
                window.__tw_currentScriptSrc ||
                (document.currentScript?.src || (document.currentScript ? 'inline-script' : null)) ||
                srcFromStack(err.stack) ||
                'unknown';
                
              if (name) {
                addDetectedCookie(name, source, 'cookieStore');
              }
            } catch {
              // Ignore cookie detection errors - still set the cookie
            }
            return _set(...args);
          };

          // Listen for cookie change events
          let processedChanges = new Set();
          cookieStore.addEventListener('change', (ev) => {
            for (const c of (ev.changed || [])) {
              const key = `${c.name}::change`;
              if (!processedChanges.has(key)) {
                processedChanges.add(key);
                
                // Check if already detected via another method
                const existingKey = `${c.name}::cookieStore`;
                let found = false;
                for (const [k, v] of window.__tw_detected_cookies.entries()) {
                  if (v.cookieName === c.name && v.method === 'cookieStore') {
                    found = true;
                    break;
                  }
                }
                
                if (!found) {
                  addDetectedCookie(c.name, 'cookieStore-event', 'cookieStore');
                }
              }
            }
          });
        } catch {
          // Ignore cookieStore event listener errors - browser may not support
        }
      }

      // ========== CAPTURE INITIAL COOKIES ==========
      try {
        const raw = document.cookie || '';
        if (raw) {
          raw.split(';').forEach(p => {
            const name = p.split('=')[0]?.trim();
            if (name) {
              // Only add if not already detected
              let found = false;
              for (const [k, v] of window.__tw_detected_cookies.entries()) {
                if (v.cookieName === name) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                addDetectedCookie(name, 'pre-existing', 'existing');
              }
            }
          });
        }
      } catch {
        // Ignore initial cookie capture errors - continue with other detection
      }

      // ========== DETECT CUSTOM CATEGORIZED ELEMENTS ==========
      
      /**
       * Scan for scripts with data-tw-category attribute
       */
      const scanCustomScripts = () => {
        const scripts = document.querySelectorAll('script[data-tw-category]');
        scripts.forEach(script => {
          const category = script.getAttribute('data-tw-category');
          const src = script.src || 'inline-script';
          
          // Create unique key to avoid duplicates
          const key = `script::${src}::${category}`;
          if (!window.__tw_custom_scripts.some(s => `script::${s.src}::${s.customCategory}` === key)) {
            window.__tw_custom_scripts.push({
              cookieName: 'custom',
              src: src,
              method: 'custom',
              customCategory: category
            });
            
            // Also add to detected cookies
            addDetectedCookie('custom', src, 'custom', category);
          }
        });
      };

      /**
       * Scan for iframes with data-tw-category attribute
       */
      const scanCustomIframes = () => {
        const iframes = document.querySelectorAll('iframe[data-tw-category]');
        iframes.forEach(iframe => {
          const category = iframe.getAttribute('data-tw-category');
          const src = iframe.src || 'about:blank';
          
          // Get parent source
          let parentSrc = window.location.href;
          try {
            if (iframe.ownerDocument && iframe.ownerDocument !== document) {
              parentSrc = iframe.ownerDocument.location.href;
            }
          } catch {
            // Ignore cross-origin access errors
          }
          
          // Create unique key to avoid duplicates
          const key = `iframe::${src}::${parentSrc}::${category}`;
          if (!window.__tw_custom_iframes.some(i => 
            `iframe::${i.src}::${i.parentSrc}::${i.customCategory}` === key)) {
            window.__tw_custom_iframes.push({
              src: src,
              parentSrc: parentSrc,
              customCategory: category
            });
          }
        });
      };

      // Initial scan
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          scanCustomScripts();
          scanCustomIframes();
        });
      } else {
        scanCustomScripts();
        scanCustomIframes();
      }

      // ========== OBSERVE DOM MUTATIONS ==========
      const observer = new MutationObserver((mutations) => {
        let shouldScan = false;
        
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const node of mutation.addedNodes) {
              if (node.nodeType === 1) { // Element node
                if ((node.tagName === 'SCRIPT' || node.tagName === 'IFRAME') && 
                    node.hasAttribute('data-tw-category')) {
                  shouldScan = true;
                  break;
                }
                
                // Also check descendants
                const elements = node.querySelectorAll?.('script[data-tw-category], iframe[data-tw-category]');
                if (elements?.length > 0) {
                  shouldScan = true;
                  break;
                }
              }
            }
          }
          if (shouldScan) break;
        }
        
        if (shouldScan) {
          scanCustomScripts();
          scanCustomIframes();
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    });

    // ========== 10. WEB WORKER COOKIE DETECTION ==========
    page.on('worker', async (worker) => {
      try {
        await worker.evaluate(() => {
          try {
            if ('cookieStore' in self) {
              const _set = self.cookieStore.set.bind(self.cookieStore);
              self.cookieStore.set = async function(...args) {
                try {
                  const name = typeof args[0] === 'string' ? args[0] : args[0]?.name;
                  const source = `worker@${self.location?.href || 'unknown'}`;
                  if (name) {
                    console.log(`__tw_worker_cookie__ ${JSON.stringify({ name, src: source })}`);
                  }
                } catch {
                  // Ignore worker cookie detection errors - still set the cookie
                }
                return _set(...args);
              };
            }
          } catch {
            // Ignore worker cookieStore hook errors - worker may not support API
          }
        });
      } catch {
        // Ignore worker evaluation errors - worker context may not be available
      }
    });

    // Listen for worker console messages
    page.on('console', async (msg) => {
      try {
        const text = msg.text?.() ?? msg.text();
        if (text && text.startsWith('__tw_worker_cookie__')) {
          const json = text.replace('__tw_worker_cookie__', '').trim();
          const data = JSON.parse(json);
          if (data?.name) {
            addCookieEvent(data.name, data.src || 'unknown', 'cookieStore');
          }
        }
      } catch {
        // Ignore worker console message parsing errors - continue processing
      }
    });

    // ========== 11. NAVIGATION AND SCANNING ==========
    // Navigate to the target URL
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

    // ========== 12. SIMULATE USER INTERACTION ==========
    // Trigger events that may cause lazy-loaded scripts to execute
    await page.evaluate(() => {
      // Dispatch load events
      window.dispatchEvent(new Event('load'));
      window.dispatchEvent(new Event('DOMContentLoaded'));
      document.dispatchEvent(new Event('DOMContentLoaded'));
      
      // Simulate scroll to trigger lazy-loaded scripts
      window.scrollTo(0, 100);
      window.scrollTo(0, 0);
      
      // Dispatch visibility change event
      document.dispatchEvent(new Event('visibilitychange'));
      
      // Simulate mouse movement (triggers tracking scripts like Hotjar)
      const mouseEvent = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 100
      });
      document.dispatchEvent(mouseEvent);
    });

    // ========== 13. STABILITY WINDOW ==========
    let startTime = Date.now();
    
    // Wait minimum time before checking stability
    await page.waitForTimeout(3000);

    // Wait for network to be idle
    await Promise.race([
      page.waitForLoadState('networkidle').catch(() => {}),
      new Promise((r) => setTimeout(r, 5000)),
    ]);

    // Stability loop - wait for cookie detection to stabilize
    let lastCookieCount = cookieEvents.size;
    let stableIterations = 0;
    const requiredStableIterations = 3; // Need 3 iterations without changes
    
    while (true) {
      await page.waitForTimeout(1000);
      
      const now = Date.now();
      const elapsedTime = now - startTime;
      const currentCookieCount = cookieEvents.size;
      
      // Check if there have been changes
      if (currentCookieCount === lastCookieCount) {
        stableIterations++;
      } else {
        stableIterations = 0;
        lastCookieCount = currentCookieCount;
        touch(); // Update last event timestamp
      }
      
      // Exit conditions
      if (elapsedTime >= MAX_SCAN_TIME_MS) break; // Maximum time reached
      if (elapsedTime >= MIN_WAIT_TIME_MS && stableIterations >= requiredStableIterations) break; // Stable after minimum time
      if (elapsedTime >= QUIET_PERIOD_MS && (now - lastEventTimestamp) >= QUIET_PERIOD_MS) break; // No events for quiet period
    }

    // Final wait to capture very late scripts
    await page.waitForTimeout(2000);

    // ========== 14. COLLECT CUSTOM ELEMENTS ==========
    const customElements = await page.evaluate(() => {
      const result = {
        scripts: [],
        iframes: []
      };
      
      // Get custom scripts
      if (window.__tw_custom_scripts && Array.isArray(window.__tw_custom_scripts)) {
        result.scripts = window.__tw_custom_scripts;
      }
      
      // Get custom iframes
      if (window.__tw_custom_iframes && Array.isArray(window.__tw_custom_iframes)) {
        result.iframes = window.__tw_custom_iframes;
      }
      
      return result;
    });

    // Add custom scripts to cookie events
    customElements.scripts.forEach(script => {
      addCookieEvent(script.cookieName, script.src, script.method, script.customCategory);
    });

    // ========== 15. COLLECT PAGE-DETECTED COOKIES ==========
    const inPageDetected = await page.evaluate(() => {
      const cookies = [];
      if (window.__tw_detected_cookies instanceof Map) {
        for (const [key, value] of window.__tw_detected_cookies) {
          // Filter out custom cookies without category and standalone custom entries
          if (value.method !== 'custom' && value.cookieName !== 'custom') {
            cookies.push(value);
          }
        }
      }
      return cookies;
    });

    // Add page-detected cookies
    inPageDetected.forEach(cookie => {
      addCookieEvent(cookie.cookieName, cookie.src, cookie.method, cookie.customCategory);
    });

    // ========== 16. COLLECT CONTEXT COOKIES ==========
    // Get all cookies from browser context (includes httpOnly)
    const contextCookies = await context.cookies();
    for (const c of contextCookies) {
      if (!c?.name) continue;
      
      // Only add if not detected by another method
      const hasOtherMethod = Array.from(cookieEvents.values()).some(
        e => e.cookieName === c.name && e.method !== 'existing'
      );
      
      if (!hasOtherMethod) {
        addCookieEvent(c.name, 'context-cookie', 'existing');
      }
    }

    // ========== 17. DEDUPLICATE AND PRIORITIZE RESULTS ==========
    const uniqueCookies = new Map();
    
    // Define priority for methods (higher = more informative)
    const methodPriority = {
      'existing': 0,
      'cookieStore': 1,
      'document.cookie': 2,
      'http-set-cookie': 3,
      'custom': 4
    };
    
    // Define priority for sources (higher = more specific)
    const sourcePriority = {
      'unknown': 0,
      'pre-existing': 1,
      'context-cookie': 1,
      'cookieStore-event': 2,
      'inline-script': 3,
      // Full URLs have highest priority (value 10 as default)
    };
    
    for (const item of cookieEvents.values()) {
      // Custom items don't deduplicate with others
      if (item.method === 'custom') {
        const key = `${item.cookieName}::custom::${item.customCategory}`;
        uniqueCookies.set(key, item);
        continue;
      }
      
      const key = item.cookieName;
      
      if (!uniqueCookies.has(key)) {
        uniqueCookies.set(key, item);
      } else {
        // Keep the entry with better information
        const existing = uniqueCookies.get(key);
        
        // Don't replace custom entries
        if (existing.method === 'custom') continue;
        
        // Calculate total priority (method + source)
        const existingMethodPri = methodPriority[existing.method] ?? 2;
        const newMethodPri = methodPriority[item.method] ?? 2;
        
        const existingSourcePri = sourcePriority[existing.src] ?? 10;
        const newSourcePri = sourcePriority[item.src] ?? 10;
        
        // Prioritize by method first, then by source
        const existingTotalPri = (existingMethodPri * 100) + existingSourcePri;
        const newTotalPri = (newMethodPri * 100) + newSourcePri;
        
        if (newTotalPri > existingTotalPri) {
          uniqueCookies.set(key, item);
        }
      }
    }

    const finalResults = Array.from(uniqueCookies.values());

    // ========== 18. PROCESS IFRAMES ==========
    const frameList = Array.from(framesIndex.values()).filter(f => f && f.parentId);
    const urlById = new Map(Array.from(framesIndex.values()).map(f => [f.id, f.url]));

    // Use Set to deduplicate iframes by src + parentSrc
    const uniqueIframeKeys = new Set();
    const iframesScanned = [];
    
    // Add regular iframes
    for (const f of frameList) {
      if (isTrivialScheme(f.url)) continue;
      
      const parentSrc = urlById.get(f.parentId) || null;
      const iframeKey = `${f.url}::${parentSrc}`;
      
      if (!uniqueIframeKeys.has(iframeKey)) {
        uniqueIframeKeys.add(iframeKey);
        iframesScanned.push({
          src: f.url,
          parentSrc: parentSrc,
        });
      }
    }
    
    // Add custom categorized iframes
    customElements.iframes.forEach(iframe => {
      const iframeKey = `${iframe.src}::${iframe.parentSrc}::${iframe.customCategory}`;
      
      if (!uniqueIframeKeys.has(iframeKey)) {
        uniqueIframeKeys.add(iframeKey);
        iframesScanned.push({
          src: iframe.src,
          parentSrc: iframe.parentSrc,
          customCategory: iframe.customCategory
        });
      }
    });

    // ========== 19. CRAWL PAGES AND COUNT SCRIPT INSTALLATIONS ==========
    let pagesCount = 1; // Default to 1 (current page)
    
    if (siteId) {
      try {
        const scriptIdentifier = `${siteId}.js`;
        pagesCount = await crawlAndCountPages(page, url, scriptIdentifier);
      } catch (crawlError) {
        console.error('Error crawling pages:', crawlError);
        // Keep default value of 1
      }
    }

    // ========== 20. RETURN RESULTS ==========
    return NextResponse.json({
      siteId,
      domain,
      url,
      count: finalResults.length,
      scriptsScanned: finalResults,
      iframesScanned,
      pagesCount,
    });
    
  } catch (e) {
    console.error('Cookie scanner error:', e);
    return NextResponse.json({ 
      error: String(e?.message || e) 
    }, { 
      status: 500 
    });
  } finally {
    // ========== 21. CLEANUP ==========
    try { 
      await browser?.close(); 
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  }
}