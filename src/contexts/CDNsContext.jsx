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
    //REPLACE THIS WITH BUILDSCRIPT WHEN FINISHED
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
    const idsCSSData = convertJSONtoCSS(builderJSON.idsCSSData);
    const classesCSSData = convertJSONtoCSS(builderJSON.classesCSSData);
    const jsonBanner = await convertJSONtoHTML(builderJSON.roots?.[0]);
    const jsonModal = await convertJSONtoHTML(builderJSON.roots?.[1]);

    //Define trustwardsTextsVersion and siteID
    const trustwardsTextsVersion = "0.0.0";
    const siteID = siteId;
    const TW_COOKIE_RETENTION_MONTHS = 12;

    //get the site's scriptsScanned and builderJSON from the database
    const scriptsScannedResponse = await supabase.from('Site').select('scriptsScanned').eq('id', siteId);
    const scriptsScanned = scriptsScannedResponse?.data?.[0]?.scriptsScanned || [];

    //get the defaultCDNscript content as raw from the defaultCDNscript.txt file in the public directory
    const response = await fetch('/defaultCDNscript.txt');
    const content = await response.text();

    //Merge idsCSSData, classesCSSData, jsonBanner, jsonModal, scriptsScanned, trustwardsTextsVersion and siteID with defaultCDNscript content
    const prelude = [
        `const idsCSSData = ${JSON.stringify(idsCSSData)};`,
        `const classesCSSData = ${JSON.stringify(classesCSSData)};`,
        `const jsonBanner = ${JSON.stringify(jsonBanner)};`,
        `const jsonModal = ${JSON.stringify(jsonModal)};`,
        `const scriptsScanned = ${JSON.stringify(scriptsScanned)};`,
        `const trustwardsTextsVersion = ${JSON.stringify(trustwardsTextsVersion)};`,
        `const siteID = ${JSON.stringify(siteID)};`,
        `const TW_COOKIE_RETENTION_MONTHS = ${JSON.stringify(TW_COOKIE_RETENTION_MONTHS)};`,
    ].join('\n');

    const script = `${prelude}\n\n${content}`;

    //minify script
    const minifiedScript = await minify(script, {
        compress: true,
        mangle: true,
    });

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