'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@supabase/supabaseClient';

import { createCDN } from '@contexts/CDNsContext';
import cookieDatabase from './cookie-database.json';
import iframeDatabase from './iframe-database.json';

export default function Scanner({ domain, siteId, urlPath = '/' }) {
  const [status, setStatus] = useState('idle');
  const [scriptsScanned, setScriptsScanned] = useState(null);
  const [iframesScanned, setIframeScanned] = useState(null);

  async function runScan() {
    setStatus('scanning ' + domain); //Display scanning
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, siteId, urlPath }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Error de escaneo');
      setScriptsScanned(json.scriptsScanned);
      setIframeScanned(json.iframesScanned);
      setStatus('done'); //Display done

      await updateScriptsScannedAttribute(json.scriptsScanned); //Update the scriptsScanned attribute
      await updateIframeScannedAttribute(json.iframesScanned); //Update the iframesScanned attribute
      updateScriptCDN(siteId); //Update the script CDN
    } catch (e) {
      console.error('Error scanning', e);
      setStatus(e); //Display error
    }
  }

  async function updateScriptsScannedAttribute(scriptsScanned) {
    //we need to compare the scriptsScanned with cookies database to add the category of that cookie and update the scriptsScanned
    try {
      // Build enriched list: if cookie name matches exactly or starts with a DB cookie name, set category
      var enriched = Array.isArray(scriptsScanned)
        ? scriptsScanned.map((item) => {
            // If item already has a customCategory, use it directly and skip DB matching
            let derivedName = 'Untracked';
            let derivedCategory = 'Untracked';
            if (item && item.customCategory) {
              derivedCategory = item.customCategory;
              derivedName = item.name || 'Custom';
            } else {
              const found = cookieDatabase.find(
                (entry) =>
                  item?.cookieName === entry?.cookieName ||
                  (typeof item?.cookieName === 'string' && typeof entry?.cookieName === 'string' && item.cookieName.startsWith(entry.cookieName))
              );
              if (found) {
                derivedCategory = found.category;
                derivedName = found.name;
              }
            }
            // Only keep allowed attributes
            return {
              name: derivedName,
              cookieName: item?.cookieName ?? null,
              src: item?.src ?? null,
              category: derivedCategory,
            };
          })
        : scriptsScanned;

      // Persist enriched array
      await supabase.from('Site').update({ "scriptsScanned": enriched }).eq('id', siteId);

      // Keep local state in sync for the preview panel
      setScriptsScanned((prev) => (prev && prev.scriptsScanned ? { ...prev, scriptsScanned: enriched } : prev));
    } catch (err) {
      console.error('Error enriching scriptsScanned with categories', err);
      // Fallback to saving raw scriptsScanned if enrichment fails
      const sanitized = Array.isArray(scriptsScanned)
        ? scriptsScanned.map((item) => ({
            name: item?.name ?? 'Untracked',
            cookieName: item?.cookieName ?? null,
            src: item?.src ?? null,
            category: item?.category ?? 'Untracked',
          }))
        : scriptsScanned;
      await supabase.from('Site').update({ "scriptsScanned": sanitized }).eq('id', siteId);
    }
  }

  async function updateIframeScannedAttribute(iframesScanned) {
    //we need to compare the iframesScanned with iframe database to add the category of that iframe and update the iframesScanned
    try {
      // Build enriched list: check if iframe URL contains any path from iframe database (find the most complete path match)
      var enriched = Array.isArray(iframesScanned)
        ? iframesScanned.map((item) => {
            // If item already has a customCategory, use it directly and skip DB matching
            let derivedName = 'Untracked';
            let derivedCategory = 'Untracked';
            if (item && item.customCategory) {
              derivedCategory = item.customCategory;
              derivedName = item.name || 'Custom';
            } else {
              let bestMatch = null;
              let longestPathLength = 0;

              // Find the database entry with the longest/most complete path that matches
              iframeDatabase.forEach((entry) => {
                if (item?.url && entry?.path && item.url.includes(entry.path)) {
                  if (entry.path.length > longestPathLength) {
                    longestPathLength = entry.path.length;
                    bestMatch = entry;
                  }
                }
              });

              if (bestMatch) {
                derivedCategory = bestMatch.category;
                derivedName = bestMatch.name;
              }
            }
            // Only keep allowed attributes (map url -> src if needed)
            return {
              name: derivedName,
              cookieName: item?.cookieName ?? null,
              src: (item?.src ?? item?.url) ?? null,
              category: derivedCategory,
            };
          })
        : iframesScanned;

      // Persist enriched array
      await supabase.from('Site').update({ "iframesScanned": enriched }).eq('id', siteId);

      // Keep local state in sync for the preview panel
      setIframeScanned((prev) => (prev && prev.iframesScanned ? { ...prev, iframesScanned: enriched } : prev));
    } catch (err) {
      console.error('Error enriching iframesScanned with categories', err);
      // Fallback to saving raw scriptsScanned if enrichment fails
      const sanitized = Array.isArray(iframesScanned)
        ? iframesScanned.map((item) => ({
            name: item?.name ?? 'Untracked',
            cookieName: item?.cookieName ?? null,
            src: (item?.src ?? item?.url) ?? null,
            category: item?.category ?? 'Untracked',
          }))
        : iframesScanned;
      await supabase.from('Site').update({ "iframesScanned": sanitized }).eq('id', siteId);
    }
  }

  function updateScriptCDN(siteId) {
    createCDN(siteId);
  }

  useEffect(() => {
    if (domain) runScan();
  }, [domain, siteId, urlPath]);

  //UTILIZADO PARA SCANNER TEST - DEJAR COMENTADO O MOVER CUANDO SE IMPLEMENTE EN SCAN.JSX
  return (
    <section style={{ padding: 16 }}>
      <h1>Scanner</h1>
      <p>Estado: {status}</p>
      {scriptsScanned && (
        <>
          <div style={{ marginTop: 8 }}>Total scripts detectados: {Array.isArray(scriptsScanned) ? scriptsScanned.length : 0}</div>
          <pre style={{ maxHeight: 360, overflow: 'auto', background: '#111', color: '#eee', padding: 12 }}>
            {JSON.stringify(scriptsScanned, null, 2)}
          </pre>
        </>
      )}
      {iframesScanned && (
        <>
          <div style={{ marginTop: 8 }}>Total iframes detectados: {Array.isArray(iframesScanned) ? iframesScanned.length : 0}</div>
          <pre style={{ maxHeight: 360, overflow: 'auto', background: '#111', color: '#eee', padding: 12 }}>
            {JSON.stringify(iframesScanned, null, 2)}
          </pre>
        </>
      )}
    </section>
  );
}