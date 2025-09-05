import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60; /*is not used anywhere*/

export async function POST(req) {
  let browser;
  try {
    const { domain, siteId, urlPath = '/' } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: 'domain requerido' }, { status: 400 });
    }

    // ---- Validación y construcción de URL ----
    if (/^(javascript:|data:|file:)/i.test(domain) || /^(javascript:|data:|file:)/i.test(urlPath)) {
      return NextResponse.json({ error: 'URL no permitida' }, { status: 400 });
    }
    const base = /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
    const url = new URL(urlPath, base).toString();

    // ---- Lanzamiento navegador ----
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-features=Prerender2,InterestCohortApi,PrivacySandboxAdsAPIs',
      ],
    });

    // Contexto determinista
    const context = await browser.newContext({
      locale: 'es-ES',
      timezoneId: 'Europe/Madrid',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      ignoreHTTPSErrors: true,
      serviceWorkers: 'block',
      viewport: { width: 1366, height: 768 },
    });

    const page = await context.newPage();

    // CDP y caché
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Page.enable');

    // ---- Índice de frames (CDP) ----
    // frameId -> { id, parentId, url, name }
    const framesIndex = new Map();

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
      } catch {}
    });

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
      } catch {}
    });

    cdp.on('Page.frameDetached', (_evt) => { /* opcional: limpieza */ });

    // ---- Helpers ----
    const getOrigin = (u) => { try { return new URL(u).origin; } catch { return null; } };
    const isTrivialScheme = (u) => /^about:|^data:/i.test(String(u || ''));

    // --------------------------
    // Acumulador + dedupe
    // --------------------------
    const items = [];
    let lastEventTs = Date.now();

    const touch = () => { lastEventTs = Date.now(); };
    const push = (it) => {
      const rec = { cookieName: it.cookieName, src: it.src ?? null, method: it.method };
      const key = `${rec.cookieName}::${rec.src || 'unknown'}::${rec.method}`;
      if (!items.some(x => `${x.cookieName}::${x.src || 'unknown'}::${x.method}` === key)) items.push(rec);
      touch();
      try { page.evaluate(() => window.__tw_cookie_event?.()); } catch {}
    };

    // --------------------------
    // (1) CDP red/iniciadores
    // --------------------------
    const initiatorByReqId = new Map();
    const urlByReqId = new Map();
    const lastInitiatorByUrl = new Map();

    const getInitiatorSrc = (initiator) => {
      try {
        if (!initiator) return null;
        const frames = initiator.stack?.callFrames || [];
        for (const f of frames) {
          if (f?.url && /^https?:\/\//.test(f.url)) return f.url;
        }
        if (initiator.url && /^https?:\/\//.test(initiator.url)) return initiator.url;
        return null;
      } catch { return null; }
    };

    cdp.on('Network.requestWillBeSent', (evt) => {
      try {
        const rid = evt.requestId;
        const reqUrl = evt.request?.url;
        const initiatorSrc = getInitiatorSrc(evt.initiator) || null;
        if (rid) {
          initiatorByReqId.set(rid, initiatorSrc);
          if (reqUrl) {
            urlByReqId.set(rid, reqUrl);
            if (initiatorSrc) lastInitiatorByUrl.set(reqUrl, initiatorSrc);
          }
        }
      } catch {}
    });

    cdp.on('Network.responseReceived', (evt) => {
      try {
        if (evt?.requestId && evt?.response?.url) {
          urlByReqId.set(evt.requestId, evt.response.url);
        }
      } catch {}
    });

    cdp.on('Network.responseReceivedExtraInfo', (evt) => {
      try {
        const headers = evt.headers || {};
        const toArray = (v) => Array.isArray(v) ? v : (v ? [v] : []);
        const arr = toArray(headers['set-cookie']);
        if (!arr.length) return;

        const rid = evt.requestId;
        const initiatorSrc = rid ? (initiatorByReqId.get(rid) || null) : null;
        const urlFromReq = rid ? (urlByReqId.get(rid) || null) : null;
        const src = initiatorSrc || urlFromReq || null;

        for (const sc of arr) {
          const first = String(sc).split(';', 1)[0];
          const name = first.split('=')[0]?.trim();
          if (!name) continue;
          push({ cookieName: name, src, method: 'http-set-cookie' });
        }
      } catch {}
    });

    page.on('response', async (res) => {
      try {
        const urlRes = res.url();
        let setCookies = [];
        const anyRes = res;
        if (typeof anyRes.headersArray === 'function') {
          const arr = anyRes.headersArray();
          setCookies = arr.filter(h => h.name.toLowerCase() === 'set-cookie').map(h => h.value);
        } else {
          const obj = res.headers();
          const sc = obj['set-cookie'];
          setCookies = sc ? (Array.isArray(sc) ? sc : [sc]) : [];
        }
        if (!setCookies.length) return;

        const src = lastInitiatorByUrl.get(urlRes) || urlRes;

        for (const sc of setCookies) {
          if (typeof sc !== 'string') continue;
          const first = sc.split(';', 1)[0];
          const name = first.split('=')[0]?.trim();
          if (!name) continue;
          push({ cookieName: name, src, method: 'http-set-cookie' });
        }
      } catch {}
    });

    // --------------------------
    // Expose ping para espera
    // --------------------------
    let cookieEventResolver = null;
    const cookiePing = new Promise((resolve) => { cookieEventResolver = resolve; });
    await page.exposeFunction('__tw_cookie_event', () => { try { cookieEventResolver?.(); } catch {} });

    // --------------------------
    // (2) Hooks en la página (+ workers)
    // --------------------------
    await page.addInitScript(() => {
      window.__tw_scanned = [];
      window.__tw_currentScriptSrc = null;

      const push = (item) => {
        const arr = window.__tw_scanned;
        const key = `${item.cookieName}::${item.src || 'unknown'}::${item.method}`;
        if (!arr.some(i => `${i.cookieName}::${i.src || 'unknown'}::${i.method}` === key)) {
          arr.push(item);
          try { window.__tw_cookie_event?.(); } catch {}
        }
      };

      const parseName = (v) => {
        if (typeof v !== 'string') return null;
        const first = v.split(';', 1)[0];
        const idx = first.indexOf('=');
        return idx > 0 ? first.slice(0, idx).trim() : null;
      };

      const srcFromStack = (stack) => {
        if (!stack) return null;
        const lines = String(stack).split('\n');
        for (const l of lines) {
          const m = l.match(/\((https?:\/\/[^\s)]+)\)/) || l.match(/\bat\s+(https?:\/\/[^\s)]+)\b/);
          if (m && m[1]) return m[1];
        }
        return null;
      };

      const setCurrent = (src) => {
        const prev = window.__tw_currentScriptSrc;
        window.__tw_currentScriptSrc = src;
        return () => { window.__tw_currentScriptSrc = prev; };
      };

      const wrapInsert = (proto, method) => {
        const orig = proto[method];
        if (!orig) return;
        proto[method] = function(...args) {
          const node = args[0];
          if (node && node.tagName === 'SCRIPT' && !node.src) {
            const virtualSrc = `inline@${location.href}#${method}`;
            const restore = setCurrent(virtualSrc);
            try { return orig.apply(this, args); }
            finally { restore(); }
          }
          return orig.apply(this, args);
        };
      };

      try {
        wrapInsert(Node.prototype, 'appendChild');
        wrapInsert(Element.prototype, 'insertBefore');
        wrapInsert(Element.prototype, 'replaceChild');
      } catch {}

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
      } catch {}

      // Hook document.cookie
      try {
        const desc =
          Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
          Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
        if (desc && desc.set && desc.get) {
          const oSet = desc.set;
          const oGet = desc.get;
          const repl = function (v) {
            try {
              const err = new Error('cookie-set');
              const name = parseName(v);
              const source =
                window.__tw_currentScriptSrc ||
                (document.currentScript?.src || (document.currentScript ? 'inline-script' : null)) ||
                srcFromStack(err.stack) ||
                'unknown';
              if (name) {
                push({ cookieName: name, src: source, method: 'document.cookie' });
              }
            } catch {}
            return oSet.call(document, v);
          };
          Object.defineProperty(Document.prototype, 'cookie', {
            configurable: true,
            enumerable: true,
            get() { return oGet.call(document); },
            set: repl,
          });
        }
      } catch {}

      // cookieStore.set
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
                push({ cookieName: name, src: source, method: 'cookieStore' });
              }
            } catch {}
            return _set(...args);
          };

          cookieStore.addEventListener('change', (ev) => {
            for (const c of (ev.changed || [])) {
              push({ cookieName: c.name, src: 'unknown', method: 'cookieStore' });
            }
          });
        } catch {}
      }

      // Snapshot inicial
      try {
        const raw = document.cookie || '';
        if (raw) {
          raw.split(';').forEach(p => {
            const name = p.split('=')[0]?.trim();
            if (name) push({ cookieName: name, src: 'unknown', method: 'existing' });
          });
        }
      } catch {}
    });

    // Workers
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
                } catch {}
                return _set(...args);
              };
            }
          } catch {}
        });
      } catch {}
    });

    page.on('console', async (msg) => {
      try {
        const text = msg.text?.() ?? msg.text();
        if (text && text.startsWith('__tw_worker_cookie__')) {
          const json = text.replace('__tw_worker_cookie__', '').trim();
          const data = JSON.parse(json);
          if (data?.name) {
            push({ cookieName: data.name, src: data.src || 'unknown', method: 'cookieStore' });
          }
        }
      } catch {}
    });

    // --------------------------
    // Navegación
    // --------------------------
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

    // --------------------------
    // Ventana de estabilidad
    // --------------------------
    const quietMs = 3000;
    const maxMs = 20000;
    let start = Date.now();

    await Promise.race([
      page.waitForLoadState('networkidle').catch(() => {}),
      new Promise((r) => setTimeout(r, 2000)),
      new Promise((r) => cookiePing.then(r).catch(r)),
    ]);

    while (true) {
      const now = Date.now();
      const sinceLast = now - lastEventTs;
      const sinceStart = now - start;
      if (sinceLast >= quietMs) break;
      if (sinceStart >= maxMs) break;
      await page.waitForTimeout(250);
    }

    await page.waitForTimeout(500);

    // Hallazgos "in-page"
    const inPage = await page.evaluate(() => {
      return Array.isArray(window.__tw_scanned) ? window.__tw_scanned : [];
    });
    inPage.forEach(push);

    // Cookies del contexto (httpOnly incluidas)
    const all = await context.cookies();
    for (const c of all) {
      if (!c?.name) continue;
      push({ cookieName: c.name, src: 'unknown', method: 'existing' });
    }

    // Post-procesado
    const byName = new Map();
    for (const it of items) {
      if (!byName.has(it.cookieName)) byName.set(it.cookieName, []);
      byName.get(it.cookieName).push(it);
    }
    const final = [];
    for (const [_name, arr] of byName.entries()) {
      const hasBetter = arr.some(a => a.method !== 'existing' && a.src && a.src !== 'unknown');
      for (const a of arr) {
        if (a.method === 'existing' && hasBetter) continue;
        final.push(a);
      }
    }

    // --------------------------
    // Iframes: resumen (CDP) -> solo src y parentSrc
    // --------------------------
    const frameList = Array.from(framesIndex.values()).filter(f => f && f.parentId);
    const urlById = new Map(Array.from(framesIndex.values()).map(f => [f.id, f.url]));

    // Agregación por frameId
    const aggByFrameId = new Map();
    for (const f of frameList) {
      aggByFrameId.set(f.id, {
        id: f.id,
        url: f.url || 'about:blank',
        parentId: f.parentId || null,
        parentUrl: urlById.get(f.parentId) || null,
        cookieCount: 0,
        methods: new Set(),
      });
    }

    // Atribución por URL o por origen
    const tryAssignEvent = (ev) => {
      const src = String(ev.src || '');
      if (!src) return;

      // 1) URL exacta o inline@URL
      for (const rec of aggByFrameId.values()) {
        const frameUrl = rec.url || '';
        if (!frameUrl) continue;
        const inlinePrefix = `inline@${frameUrl}`;
        if (src.startsWith(frameUrl) || src.startsWith(inlinePrefix)) {
          rec.cookieCount += 1;
          rec.methods.add(ev.method);
          return;
        }
      }

      // 2) Fallback por origen
      const srcOrigin = getOrigin(src);
      if (!srcOrigin) return;
      for (const rec of aggByFrameId.values()) {
        const frameOrigin = getOrigin(rec.url);
        if (frameOrigin && frameOrigin === srcOrigin) {
          rec.cookieCount += 1;
          rec.methods.add(ev.method);
          return;
        }
      }
    };

    for (const it of final) tryAssignEvent(it);

    // Serialización final: SOLO src y parentSrc
    let iframesScanned = Array.from(aggByFrameId.values())
      // Filtra iframes about:/data: sin eventos (ruido)
      .filter(r => !(isTrivialScheme(r.url) && r.cookieCount === 0))
      .map(r => ({
        src: r.url,
        parentSrc: r.parentUrl,
      }));

    return NextResponse.json({
      siteId,
      domain,
      url,
      count: final.length,
      scriptsScanned: final,
      iframesScanned, // <- SOLO { src, parentSrc }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  } finally {
    try { await browser?.close(); } catch {
      console.error('Error al cerrar el navegador');
    }
  }
}
