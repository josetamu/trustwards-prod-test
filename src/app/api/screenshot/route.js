import { chromium } from 'playwright';
/**
 * GET /api/screenshot?domain=example.com
 * 
 * Generates a screenshot of the specified domain
 */
export async function GET(req) {
    let browser;
    
    try {
      const { searchParams } = new URL(req.url);
      const domain = searchParams.get('domain');
    
      if (!domain) {
        return new Response('Domain and screenshot parameter required', { status: 400 });
      }
  
      // Security validation
      if (/^(javascript:|data:|file:)/i.test(domain)) {
        return new Response('URL not allowed', { status: 400 });
      }
      
      // Build complete URL
      const url = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;

      // Retardo opcional para animaciones (por defecto 2000ms, máx 15000ms)
      const delayParam = searchParams.get('delay');
      let waitMs = 2000;
      if (delayParam !== null) {
        const n = parseInt(delayParam, 10);
        if (!Number.isNaN(n)) waitMs = Math.max(0, Math.min(n, 3000));
      }

      // Use the same browser setup as the POST endpoint
      browser = await chromium.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-features=Prerender2,InterestCohortApi,PrivacySandboxAdsAPIs',
          ],
      });
  
      const context = await browser.newContext({
        locale: 'en-US',
        timezoneId: 'America/New_York',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        ignoreHTTPSErrors: true,
        serviceWorkers: 'block',
        viewport: { width: 1920, height: 1080 },

      });
  
      const page = await context.newPage();
      
      // Navigate to the page
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });

      await Promise.race([
        page.waitForLoadState('networkidle').catch(() => {}),
        new Promise((r) => setTimeout(r, 3000)),
      ]);

      await page.waitForTimeout(waitMs);

      // Take screenshot
      const screenshotBuffer = await page.screenshot({
        type: 'png',
        fullPage: false
      });
  
      await browser.close();
  
      return new Response(screenshotBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-store, no-cache, must-revalidate', // Cache for 1 hour
        },
      });
  
    } catch (error) {
      if (browser) {
        await browser.close();
      }
      console.error('Screenshot error:', error);
      return new Response('Screenshot failed', { status: 500 });
    }
  }