import { supabase } from '@supabase/supabaseClient';
import { minify } from "terser";

/*Elements*/
import { Banner } from '@builderElements/Banner/Banner';
import { Modal } from '@builderElements/Modal/Modal';
import { Text } from '@builderElements/Text/Text';
import { Button } from '@builderElements/Button/Button';
import { Block } from '@builderElements/Block/Block';
import { Divider } from '@builderElements/Divider/Divider';
import { Image } from '@builderElements/Image/Image';
import { Categories } from '@builderElements/Categories/Categories';
import { Checkbox } from '@builderElements/Checkbox/Checkbox';
import { Icon } from '@builderElements/Icon/Icon';

/*
* Create a CDN for a site (if it exists, it will be updated)
* siteId - The id of the site used to define the CDN path
*/
export const createCDN = async (siteId) => {
    const content = await buildScript(siteId);

    const bytes = new TextEncoder().encode(content);
  
    const { error: uploadErr } = await supabase.storage
        .from("cdn-script")
        .upload(`${siteId}.js`, new Blob([bytes], { type: "application/javascript" }), {
        upsert: true,
        contentType: "application/javascript",
        cacheControl: "3600",
        });
  
    if (uploadErr){
        console.error('Error uploading CDN script:', uploadErr);
    }
}
//Used by createCDN to build and get the whole script: scriptsScanned + builderJSON + defaultCDNscript
const buildScript = async (siteId) => {

    //get the site's builderJSON from the database and divide into idsCSSData, classesCSSData, jsonBanner and jsonModal
    const siteJSONResponse = await supabase.from('Site').select('JSON').eq('id', siteId);
    const builderJSON = siteJSONResponse?.data?.[0]?.JSON || {};

    //Define builderJSON constants
    const jsonBanner = await convertJSONtoHTML(builderJSON.roots?.[0]);
    const jsonModal = await convertJSONtoHTML(builderJSON.roots?.[1]);

    //Base CSS
    const baseIds = convertJSONtoCSS(builderJSON.idsCSSData);
    const baseClasses = convertJSONtoCSS(builderJSON.classesCSSData);

    //Responsive CSS
    const bp = builderJSON.breakpoints || {};
    const tabletMax = bp.tablet || '1024px';
    const mobileMax = bp.mobile || '767px';
    const r = builderJSON.responsive || {};
    const tbIds = convertJSONtoCSS(r.tablet?.idsCSSData);
    const tbClasses = convertJSONtoCSS(r.tablet?.classesCSSData);
    const moIds = convertJSONtoCSS(r.mobile?.idsCSSData);
    const moClasses = convertJSONtoCSS(r.mobile?.classesCSSData);

    const idsCSSCombined = [
      baseIds,
      tbIds ? `@media (max-width: ${tabletMax}) {${tbIds}}` : '',
      moIds ? `@media (max-width: ${mobileMax}) {${moIds}}` : '',
    ].filter(Boolean).join('\n');
    const classesCSSCombined = [
      baseClasses,
      tbClasses ? `@media (max-width: ${tabletMax}) {${tbClasses}}` : '',
      moClasses ? `@media (max-width: ${mobileMax}) {${moClasses}}` : '',
    ].filter(Boolean).join('\n');

    //Define general constants
    var blockEvents = builderJSON.blockEvents;
    var blockScroll = builderJSON.blockScroll;
    const defaultCSS = "[data-tw-close-banner], [data-tw-open-settings], [data-tw-close-settings], [data-tw-enable-all], [data-tw-disable-all], [data-tw-save-choices], [data-tw-accept-category], [data-tw-reject-category] { cursor: pointer; }"
    const trustwardsTextsVersion = "0.0.0";
    const siteID = siteId;
    const TW_COOKIE_RETENTION_MONTHS = 12;
    const categoriesDescriptions = [
        {
            "name": "Functional",
            "description": "These cookies are essential in order to use the website and its features.",
        },
        {
            "name": "Analytics",
            "description": "Analytics cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data is used to improve the user experience and optimize our services.",
        },
        {
            "name": "Marketing",
            "description": "Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.",
        },
    ]

    //Define scriptsScanned and iframesScanned constants
    const scriptsScannedResponse = await supabase.from('Site').select('scriptsScanned').eq('id', siteId);
    const iframesScannedResponse = await supabase.from('Site').select('iframesScanned').eq('id', siteId);
    const scriptsScanned = scriptsScannedResponse?.data?.[0]?.scriptsScanned || [];
    const iframesScanned = iframesScannedResponse?.data?.[0]?.iframesScanned || [];

    //Define the defaultCDNscript content (as raw from the defaultCDNscript.txt file in the public directory)
    const response = await fetch('/defaultCDNscript.txt');
    const content = await response.text();

    // Utility to flatten multi-line strings into a single spaced line
    const flattenSingleLine = (value) => String(value)
        .replace(/(\r\n|\n|\r)/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
    const flatIdsCSSData = flattenSingleLine(idsCSSCombined);
    const flatClassesCSSData = flattenSingleLine(classesCSSCombined);
    const flatDefaultCSS = flattenSingleLine(defaultCSS);

    //Merge jsonBanner, jsonModal, idsCSSData, classesCSSData, defaultCSS, trustwardsTextsVersion, siteID, TW_COOKIE_RETENTION_MONTHS, categoriesDescriptions, scriptsScanned, iframesScanned, defaultCDNscript content
    const prelude = [
        `const jsonBanner = ${JSON.stringify(jsonBanner)};`,
        `const jsonModal = ${JSON.stringify(jsonModal)};`,
        `const idsCSSData = ${JSON.stringify(flatIdsCSSData)};`,
        `const classesCSSData = ${JSON.stringify(flatClassesCSSData)};`,
        `var blockEvents = ${JSON.stringify(blockEvents)};`,
        `var blockScroll = ${JSON.stringify(blockScroll)};`,
        `const defaultCSS = ${JSON.stringify(flatDefaultCSS)};`,
        `const trustwardsTextsVersion = ${JSON.stringify(trustwardsTextsVersion)};`,
        `const siteID = ${JSON.stringify(siteID)};`,
        `const TW_COOKIE_RETENTION_MONTHS = ${JSON.stringify(TW_COOKIE_RETENTION_MONTHS)};`,
        `const categoriesDescriptions = ${JSON.stringify(categoriesDescriptions)};`,
        `const scriptsScanned = ${JSON.stringify(scriptsScanned)};`,
        `const iframesScanned = ${JSON.stringify(iframesScanned)};`,
    ].join('\n');

    const script = `${prelude}\n\n${content}`;

    //minify script
    const minifiedScript = await minify(script, {
        compress: true,
        mangle: true,
    });

    //console.log(minifiedScript.code)

    return minifiedScript.code;
}
//To convert idsCSSData and classesCSSData to raw CSS
const convertJSONtoCSS = (json) => {
    const items = Array.isArray(json) ? json : [];
  
    const cssEscape = (ident) => {
      if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(String(ident));
      return String(ident).replace(/[^a-zA-Z0-9_-]/g, (ch) => '\\' + ch);
    };
  
    const toKebab = (prop) => String(prop).replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
  
    // Group by selector to merge repeated properties
    const rules = new Map(); // selector -> { prop: value }
  
    for (const it of items) {
      if (!it || typeof it !== 'object') continue;
  
      let selector = null;
      if (it.id) selector = '#' + cssEscape(it.id);
      else if (it.class) selector = '.' + cssEscape(it.class);
      else if (it.className) selector = '.' + cssEscape(it.className);
      if (!selector) continue;
  
      const bag = rules.get(selector) || {};
      const props = (it.properties && typeof it.properties === 'object') ? it.properties : {};
  
      for (const [k, v] of Object.entries(props)) {
        if (v === null || v === undefined) continue;
        bag[toKebab(k)] = String(v);
      }
      rules.set(selector, bag);
    }
  
    // Convert to CSS
    let css = '';
    for (const [selector, props] of rules) {
      const body = Object.entries(props)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n');
      css += `${selector} {\n${body}\n}\n`;
    }
    return css.trim();
};
//To convert jsonBanner and jsonModal to raw HTML 
const convertJSONtoHTML = async (node) => {
    // 1) Dynamic internal imports (everything inside the function)
    const React = (await import('react')).default;
    const { renderToStaticMarkup } = await import('react-dom/server');
  
    // 2) Factory registry (components have to be imported)
    const COMPONENTS = {
      Banner,
      Modal,
      Text,
      Button,
      Block,
      Divider,
      Image,
      Categories,
      Checkbox,
      Icon,
    };
  
    // 3) Internal helpers
    const buildNodeProps = (n) => {
      const classes = (n.classList || n.classlist || [])
        .filter(Boolean)
        .join(' ')
        .trim();
  
      const attrs = n.attributes && typeof n.attributes === 'object' ? n.attributes : {};
      const dataAttrs = {};
      const otherAttrs = {};
  
      Object.entries(attrs).forEach(([k, v]) => {
        if (v == null) return;
        if (k.startsWith('data-')) dataAttrs[k] = v;
        else otherAttrs[k] = v;
      });
  
      const nodeProps = {
        ...(n.id ? { id: n.id } : {}),
        ...(classes ? { className: classes } : {}),
        ...(n.src ? { src: n.src } : {}),
        ...otherAttrs,
      };
      return { nodeProps, dataAttributes: dataAttrs };
    };
  
    const Generic = ({ node, children }) => {
      const Tag = (node.tagName || 'div').toLowerCase();
      const { nodeProps, dataAttributes } = buildNodeProps(node);
      return React.createElement(Tag, { ...nodeProps, ...dataAttributes }, children ?? node.text ?? null);
    };
  
    const nodeToElementWithKey = (n, key) => {
      const el = nodeToElement(n);
      return React.cloneElement(el, { key });
    };
  
    const nodeToElement = (n) => {
      if (!n || typeof n !== 'object') {
        return React.createElement(React.Fragment, null);
      }
  
      const compName = n.elementType
        ? n.elementType.charAt(0).toUpperCase() + n.elementType.slice(1)
        : null;
  
      const factory = (compName && COMPONENTS[compName]) || null;
  
      // Prepare recursive children (if the component doesn't consume them, nothing happens)
      const children = Array.isArray(n.children) && n.children.length
        ? n.children.map((c, i) => nodeToElementWithKey(c, i))
        : (n.text ? [n.text] : []);
  
      if (factory) {
        const { nodeProps, dataAttributes } = buildNodeProps(n);
        // Call the factory as it is defined: (node, nodeProps) => { render, groupControls }
        const instance = factory(n, { ...nodeProps, ...dataAttributes });
        const rendered = instance && typeof instance.render === 'function' ? instance.render() : null;
  
        if (React.isValidElement(rendered)) {
          return rendered;
        }
        // If the factory didn't return a valid ReactElement, fall back to generic with children
      }
  
      // Generic fallback (respects tagName, props, text and children)
      return React.createElement(Generic, { node: n }, ...(children || []));
    };
  
    // 4) Render to static HTML (string) using the actual template of each component
    const element = nodeToElement(node);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, element));
    return html;
};