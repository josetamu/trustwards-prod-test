import "./Canvas.css";

import { useCanvas } from '@contexts/CanvasContext';
import React, { useEffect, useState } from "react";

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

export const Canvas = ({site, screenshotUrl, setScreenshotUrl}) => {
    const { JSONtree, activeRoot, selectedId, setSelectedId, moveElement, createElement, CallContextMenu, setSelectedItem,
        runElementScript, notifyElementCreatedFromToolbar, setJSONtree, deepCopy} = useCanvas();

        //state to handle the loading of the live website screenshot
        const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(false);

        const [enterReady, setEnterReady] = useState(false);

        //Effect to handle the enter animation. Change the enterReady state to true when the active root changes. Used by renderNode()
        useEffect(() => {
            setEnterReady(false);
            const id = requestAnimationFrame(() => {
              requestAnimationFrame(() => setEnterReady(true));
            });
            return () => cancelAnimationFrame(id);
          }, [activeRoot]);
    

    
        // Effect to handle live website screenshot. This is local because the screenshot is generated in the builder page
        useEffect(() => {
            if (JSONtree?.liveWebsite && site?.Domain) {
                setIsLoadingScreenshot(true);
                //set the url of the live website screenshot
                const url = `/api/screenshot?domain=${encodeURIComponent(site.Domain)}`;
                setScreenshotUrl(url);                
            } else {
                setScreenshotUrl(null);
                setIsLoadingScreenshot(false);
            }
        }, [JSONtree?.liveWebsite, site?.Domain]);
    /*
    * Custom hook to track elements after they are created and run their scripts
    * Used by trackElement() inside renderNode()
    */
    const processedElementsRef = React.useRef(new Set());
    const pendingScriptsRef = React.useRef(new Set());
    const trackElement = React.useCallback((node) => {
        if (node && node.id && node.script && !processedElementsRef.current.has(node.id)) {
            pendingScriptsRef.current.add(node);
        }
    }, []);
    React.useEffect(() => {
        const scriptsToExecute = Array.from(pendingScriptsRef.current);
        pendingScriptsRef.current.clear();

        scriptsToExecute.forEach(node => {
            if (!processedElementsRef.current.has(node.id)) {
                try {
                    runElementScript(node);
                    processedElementsRef.current.add(node.id);
                } catch (error) {
                    console.error(`Error running script for ${node.id}:`, error);
                }
            }
        });
    });

    /*
    * Used by the canvas to convert the JSONtree into React elements
    * node - The JSON node to render (canvas passes the root)
    * setSelectedId - When an element is clicked, set it as the selectedId
    * selectedId - Current element selected
    */
    const renderNode = (node, selectedId, hasAnchorAncestor = false) => {
        const isSelected = node.id === selectedId;
        const isRoot = node.id === 'tw-root--banner' || node.id === 'tw-root--modal';
        const isActiveRoot = node.id === activeRoot;
        
        const anchorAncestor = hasAnchorAncestor || node.tagName === 'a';
        // Set the node properties from its JSON (id, classes, tag, children, etc..)
        const nodeProps = {
            id: node.id, // Add the node.id as the real id
            ...(node.classList.length > 0 && { className: node.classList.join(' ') }), // Add the node.classList as the real classList

            onClick: (e) => {
                e.stopPropagation();
                setSelectedId(node.id); // Set the clicked element as the selectedId
            },

            onContextMenu: (e) => {
                e.preventDefault();
                e.stopPropagation();

                setSelectedId(node.id);
                //setSelectedItem(node);

                if(!isRoot) { //If the node is not banner or modal, it can call the context menu
                    CallContextMenu(e, node);
                }
            },

            //Add canvas classes to the node (dont use addClass on this render because it will render JSONtree in a loop)
            className: [
                ...node.classList,
                ...(node.classList.includes('tw-block') && node.children.length === 0 ? ['tw-block--empty'] : []), // Add the class tw-block--empty if the node has the class tw-block and no children
                ...(isSelected ? ['tw-builder__active'] : []), // Add the class tw-builder__active to the classList of the selected element
                ...(isActiveRoot ? ['tw-active-root'] : []), // Add the class tw-active-root to the classList of the active root element
                ...(isActiveRoot && enterReady && node.id === 'tw-root--modal' ? ['tw-modal--open'] : []), // Add the class tw-modal--open to the classList of the active root element if the active root is modal and the enter animation is ready
                ...(isActiveRoot && enterReady && node.id === 'tw-root--banner' ? ['tw-banner--open'] : []), // Add the class tw-banner--open to the classList of the active root element if the active root is banner and the enter animation is ready
            ].join(' '),

            ...(!isRoot ? { //Make all nodes draggable except banner and modal
                draggable: true,
                onDragStart: (e) => {
                    e.stopPropagation();
                    e.dataTransfer.setData("draggedElementId", node.id);
                },
            } : {})
        };

        const children = node.children?.map((child) => //Renders the children of the node (JSON tree) in loop
            renderNode(child, selectedId, anchorAncestor)
        )

        // Track element for script execution once it is created
        trackElement(node);
        switch (node.elementType) {
            case 'banner':
                return Banner(node, nodeProps, children).render();
            case 'modal':
                return Modal(node, nodeProps, children).render();
            case 'text':
                return Text(node, nodeProps, anchorAncestor).render();
            case 'button':
                return Button(node, nodeProps).render();
            case 'block':
                return Block(node, nodeProps, children, anchorAncestor).render();
            case 'divider':
                return Divider(node, nodeProps).render();
            case 'image':
                return Image(node, nodeProps).render();
            case 'categories':
                return Categories(node, nodeProps, children).render();
            case 'checkbox':
                return Checkbox(node, nodeProps).render();
            case 'icon':
                return Icon(node, nodeProps).render();
        }
    };

    /*
    * Fallback to set null as the selected element when interacting outside of the canvas and the toolbar
    */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.tw-active-root') && 
            !e.target.closest('.tw-builder__toolbar') &&
            !e.target.closest('.tw-builder__right-body') &&
            !e.target.closest('.tw-builder__tab-container') &&
            !e.target.closest('.tw-builder__tree-content') &&
            !e.target.closest('.tw-context-menu') &&
            !e.target.closest('.builder-save__text') &&
            !e.target.closest('.tw-builder__panel-toggle-btn') &&
            !e.target.closest('.tw-builder__logo-button') &&
            !e.target.closest('.tw-builder__settings-class-remove') &&
            !e.target.closest('.tw-builder__settings-class-unactive') &&
            !e.target.closest('.tw-builder__settings-classes-item') &&
            !e.target.closest('.tw-builder__settings-option') &&
            !e.target.closest('.tw-builder__settings-pen-controls')&&
            !e.target.closest('.tw-builder__header-breakpoint') &&
            !e.target.closest('.tw-builder__settings-class')) {
                setSelectedId(null);
                setSelectedItem(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [setSelectedId]);

    /*
    * Handlebars resize
    */
    useEffect(() => {
        const leftHandlebar = document.querySelector('.tw-builder__handlebar--left');
        const rightHandlebar = document.querySelector('.tw-builder__handlebar--right');
        const canvas = document.querySelector('.tw-builder__canvas');

        let isDragging = false;

        const handleMouseDown = (handlebar) => {
            isDragging = true;
            document.documentElement.classList.add('trustwards-builder--is-dragging');
            handlebar.classList.add('tw-builder__handlebar--active');
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;

            let handlebar = document.querySelector('.tw-builder__handlebar--active');

            if (handlebar.classList.contains('tw-builder__handlebar--left')) {
                const deltaX = canvas.getBoundingClientRect().right - e.clientX;
                canvas.style.maxWidth = `${deltaX}px`;
            } else if (handlebar.classList.contains('tw-builder__handlebar--right')) {
                const deltaX = e.clientX - canvas.getBoundingClientRect().left;
                canvas.style.maxWidth = `${deltaX}px`;
            }
        };

        const handleMouseUp = () => {
            if(isDragging) {
                //Read the max width of the canvas and update the JSONtree
                const currentMax = canvas.style.maxWidth || `${canvas.getBoundingClientRect().width}px`;
                const updated = deepCopy(JSONtree);

                // Ensure the map exists on new sites
                if (!updated.canvasMaxWidth) updated.canvasMaxWidth = {};
                //Use activeRoot to keep the modal or banner width separate
                updated.canvasMaxWidth = currentMax;
                setJSONtree(updated); 
            }
            isDragging = false;
            document.documentElement.classList.remove('trustwards-builder--is-dragging');
            leftHandlebar.classList.remove('tw-builder__handlebar--active');
            rightHandlebar.classList.remove('tw-builder__handlebar--active');


        };

        leftHandlebar.addEventListener('mousedown', () => handleMouseDown(leftHandlebar));
        rightHandlebar.addEventListener('mousedown', () => handleMouseDown(rightHandlebar));
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            leftHandlebar.removeEventListener('mousedown', () => handleMouseDown(leftHandlebar));
            rightHandlebar.removeEventListener('mousedown', () => handleMouseDown(rightHandlebar));
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [activeRoot, JSONtree, deepCopy, setJSONtree]);
// Apply the canvas width on mount and whenever the active root changes.
    useEffect(() => {
        const canvas = document.querySelector('.tw-builder__canvas');
        if (!canvas) return;
        //Store the width of the canvas separately for each root
        const saved = JSONtree?.canvasMaxWidth;
        if (saved) {
        //Apply the width to the canvas if it exists
            canvas.style.maxWidth = saved;
        } else {
        //If no value exists for the current root, remove the inline max-width to fallback to default styling.
            canvas.style.removeProperty('max-width');
        }
    }, [JSONtree?.canvasMaxWidth]);

    /*
    * Create element on drop (resposability transfered from toolbar)
    */
    const handleDrop = (e) => {
        e.preventDefault();

        const isDescendant = (parentId, childId, node) => {
            if (node.id === parentId) {
                return findNodeById(childId, node) !== null;
            }
            return node.children?.some(child => isDescendant(parentId, childId, child)) || false;
        };
        const findNodeById = (id, node) => {
            if (node.id === id) return node;
            for (const child of node.children || []) {
                const found = findNodeById(id, child);
                if (found) return found;
            }
            return null;
        };

        const draggedId = e.dataTransfer.getData("draggedElementId");
        const type = e.dataTransfer.getData("elementType");
        const dropX = e.clientX;
        const dropY = e.clientY;

        const canvas = document.querySelector('.tw-builder__canvas');
        const dropTarget = document.elementFromPoint(dropX, dropY);
        const container = dropTarget.closest('.tw-block') || canvas;
        const containerId = container?.id || activeRoot;

        let logicalContainer = container;
        if (container === canvas) {
            logicalContainer = canvas.querySelector(`#${activeRoot}`);
        }

        const children = Array.from(logicalContainer?.children || []);
        let insertIndex = null;
        for (let i = 0; i < children.length; i++) {
            const rect = children[i].getBoundingClientRect();
            if (dropY < rect.top + rect.height / 2) {
                insertIndex = i;
                break;
            }
        }
        if (insertIndex === null) insertIndex = children.length;

        if (draggedId) {
            if (draggedId === containerId) return;
            if (isDescendant(draggedId, containerId, JSONtree)) return;

            moveElement(draggedId, containerId, insertIndex);
        } 
        else if (type) {
            // Notify the context that we're creating an element from toolbar
            notifyElementCreatedFromToolbar();
            
            //Finally, create the element
            createElement(type, containerId, insertIndex);
        }

        document.querySelectorAll('.tw-block--hover-drop').forEach(el => el.classList.remove('tw-block--hover-drop'));
        setDropIndicator(null);
    };
    
    /*
    * Handle where the element is being dragged over and will be dropped (using drop indicator)
    */
    const handleDragOver = (e) => {
        e.preventDefault();
    
        const dropX = e.clientX;
        const dropY = e.clientY;
    
        const canvas = document.querySelector('.tw-builder__canvas');
        const dropTarget = document.elementFromPoint(dropX, dropY);
        const container = dropTarget.closest('.tw-block') || canvas;
        const containerId = container?.id || activeRoot;

        document.querySelectorAll('.tw-block--hover-drop').forEach(el => el.classList.remove('tw-block--hover-drop')); //only one hover drop at a time

        if (container.classList.contains('tw-block')) {
            if (container.children.length === 0) { // Allow creating a new element in an empty block
                container.classList.add('tw-block--hover-drop');
                setDropIndicator({ containerId, insertIndex: 0 });
                return;
            } else {
                container.classList.add('tw-block--hover-drop');
            }
        } else {
            document.querySelectorAll('.tw-block--hover-drop').forEach(el => el.classList.remove('tw-block--hover-drop')); //remove hover drop if not in a block
        }
    
        let logicalContainer = container;
        if (container === canvas) {
            logicalContainer = canvas.querySelector(`#${activeRoot}`);
        }
    
        const children = Array.from(logicalContainer?.children || []);
        let insertIndex = null;
    
        for (let i = 0; i < children.length; i++) {
            const rect = children[i].getBoundingClientRect();
            if (dropY < rect.top + rect.height / 2) {
                insertIndex = i;
                break;
            }
        }
    
        if (insertIndex === null) {
            insertIndex = children.length;
        }
    
        setDropIndicator({ containerId, insertIndex });
    };    

    /*
    * Remove drop indicator instantly as soon as the mouse leaves the canvas
    */
    const handleMouseLeave = () => {
        document.querySelectorAll('.tw-block--hover-drop').forEach(el => el.classList.remove('tw-block--hover-drop'));
        setDropIndicator(null);
    }

    /*
    * Remove drop indicator when drag leaves the canvas
    */
    const handleDragLeave = (e) => {
        // Only remove if leaving the canvas entirely (not moving to a child element)
        if (!e.currentTarget.contains(e.relatedTarget)) {
            document.querySelectorAll('.tw-block--hover-drop').forEach(el => el.classList.remove('tw-block--hover-drop'));
            setDropIndicator(null);
        }
    }

    /*
    * Drop indicator
    */
    const [dropIndicator, setDropIndicator] = React.useState(null);
    useEffect(() => {
        if (!dropIndicator) return;

        const { containerId, insertIndex } = dropIndicator;
        const container = document.getElementById(containerId);
        if (!container) return;

        const children = Array.from(container.children);
        const marker = document.createElement('div');
        marker.className = 'tw-builder__drop-indicator';

        let targetElement = children[insertIndex];
        if (targetElement) {
            container.insertBefore(marker, targetElement);
        } else {
            container.appendChild(marker);
        }

        return () => {
            marker.remove();
        };
    }, [dropIndicator]);

    /*
    * Load Google Fonts
    */

    // Helper to extract and load Google Fonts variants in use
const extractPrimaryFamily = (cssFontFamily) => {
    if (!cssFontFamily) return '';
    //Take the first item of the css font family
    const first = cssFontFamily.split(',')[0].trim();
    return first.replace(/^["']|["']$/g, '');
};

//This function injects the Google Fonts stylesheet into the head
const ensureGoogleFontLoaded = (family, weights = new Set(['400']), includeItalic = false) => {
    if (!family) return;

    //If the family is a generic/system keyword, skip it
    const lower = family.toLowerCase();
    const skip = new Set(['serif','sans-serif','monospace','cursive','fantasy','system-ui','inherit','initial','unset','revert']);
    if (skip.has(lower)) return;

    //Replace the spaces with + (Open Sans -> Open+Sans) and create the id for the link
    const famParam = family.trim().replace(/\s+/g, '+');
    const id = `tw-gf-${famParam}`;

    // Preconnect once for the Google Fonts API and the Google Fonts static API to have less latency
    const head = document.head;
    //Check if the preconnect link exists
    if (!head.querySelector('link[data-tw-preconnect="gfonts-apis"]')) {
        //If the preconnect link doesn't exist, create it
        const pc1 = document.createElement('link');
        pc1.rel = 'preconnect';
        pc1.href = 'https://fonts.googleapis.com';//CSS font
        pc1.setAttribute('data-tw-preconnect', 'gfonts-apis'); 
        head.appendChild(pc1);

        //Create the preconnect link for the static Google Fonts API
        const pc2 = document.createElement('link');
        pc2.rel = 'preconnect';
        pc2.href = 'https://fonts.gstatic.com'; //Binary font files
        pc2.crossOrigin = '';
        pc2.setAttribute('data-tw-preconnect', 'gfonts-apis');
        head.appendChild(pc2);
    }
    //Sort the weights
    const sortNums = (arr) => Array.from(arr).map(n => parseInt(n, 10)).filter(n => !Number.isNaN(n)).sort((a,b)=>a-b).join(';');
    const w = sortNums(weights.size ? weights : new Set(['400']));
    //Build the href
    let href = `https://fonts.googleapis.com/css2?family=${famParam}&display=swap`;
    //If the family has italic, add the italic row
    if (includeItalic) {
        // request normal and italic rows
        href = `https://fonts.googleapis.com/css2?family=${famParam}:ital,wght@0,${w};1,${w}&display=swap`;
    //If the family has weights, add the weights row
    } else if (w) {
        href = `https://fonts.googleapis.com/css2?family=${famParam}:wght@${w}&display=swap`;
    }

    //Check if the link exists
    let link = head.querySelector(`link#${id}`);
    //If the link doesn't exist, create it
    if (!link) {
        link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = href;
        //Append the link to the head
        head.appendChild(link);
    } else if (link.href !== href) {
        //If the link already exists and the href is different, update the href
        link.href = href;
    }
};

// Scan JSONtree CSS to load all used font families/weights
useEffect(() => {
    const famMap = new Map(); // family -> { weights: Set, italic: bool }

    //Function to collect the font families and weights from the idsCSSData and classesCSSData mapping them
    const collectFromProps = (props) => {
        if (!props) return;
        const fam = extractPrimaryFamily(props['font-family']);
        if (!fam) return;
        const weight = props['font-weight'];
        const italic = (props['font-style'] || '').toLowerCase() === 'italic';

        if (!famMap.has(fam)) famMap.set(fam, { weights: new Set(), italic: false });
        const entry = famMap.get(fam);
        if (weight && /^\d{3}$/.test(weight)) entry.weights.add(weight);
        if (italic) entry.italic = true;
    };

    //Use prev function 
    JSONtree?.idsCSSData?.forEach(({ properties }) => collectFromProps(properties));
    JSONtree?.classesCSSData?.forEach(({ properties }) => collectFromProps(properties));
    JSONtree?.responsive?.tablet?.idsCSSData?.forEach(({ properties }) => collectFromProps(properties));
    JSONtree?.responsive?.tablet?.classesCSSData?.forEach(({ properties }) => collectFromProps(properties));
    JSONtree?.responsive?.mobile?.idsCSSData?.forEach(({ properties }) => collectFromProps(properties));
    JSONtree?.responsive?.mobile?.classesCSSData?.forEach(({ properties }) => collectFromProps(properties));

    // If nothing specified, try defaults on common classes to avoid missing regular
    if (famMap.size === 0) return;

    famMap.forEach(({ weights, italic }, fam) => {
        if (!weights.size) weights.add('400'); // ensure regular
        //Inject the Google Fonts stylesheet into the head
        ensureGoogleFontLoaded(fam, weights, italic);
    });
}, [JSONtree?.idsCSSData, JSONtree?.classesCSSData]);

    //Create a stylesheet for the properties every time the idsData or classesData changes
    //For each id, add its CSS selector and properties
    //For each class, add its CSS selector and properties
    const createCSS = (JSONtree) => {
        const styleId = 'tw-dynamic-stylesheet';

        //valid units. If user types for example 100 or 100a it will add px to the value
        const validUnits = ['px','%', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'deg', 'rad', 'grad', 'turn', 's', 'ms', 'hz', 'khz'];
        //properties that need units. opacity is not in the list because it doesn't need units
        const unitsProperties = ['width','max-width', 'height', 'max-height', 'font-size', 'line-height', 'border-width', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-radius','border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'gap', 'grid-gap', 'grid-column-gap', 'grid-row-gap', 'column-gap', 'row-gap','flex-basis', 'top', 'right', 'bottom', 'left'];
        
        // Build the CSS content
        let cssContent = '';

        //function to validate and add units
        const addUnits = (prop, value) => {
            //As box-shadow is a special case because it has one css property but 6 controls, we need to validate and add units to it separately
            if (prop === 'box-shadow') {
                //Add px to the value if it is a number. If it has units, keep them
                const unitizeLen = (t) => (/^-?\d+(\.\d+)?$/.test(t) ? `${t}px` : t);
                //Take the color apart not mix it with the other values
                const colorMatch = value.match(/rgba?\([^)]+\)|hsla?\([^)]+\)|#[0-9a-fA-F]{3,8}/);
                const color = colorMatch ? colorMatch[0] : null;
                //Add blank spaces around the inset and color for the correct tokenization
                let v = String(value || '').replace(/\binset\b/gi, ' inset ').trim();
                if (color) v = v.replace(color, ' ' + color + ' ');
                //Split the value into tokens
                const tokens = v.split(/\s+/).filter(Boolean);
        
                let inset = false, lens = [], rest = [];
                //Split the tokens into inset, lens and rest(inset || x, y, blur, spread || color)
                for (const t of tokens) {
                    if (/^inset$/i.test(t)) inset = true;
                    else if (color && t === color) rest.push(color);
                    else lens.push(t);
                }
                //Add px to the lens if it is a number. If it has units, keep them
                lens = lens.map((t, i) => (i < 4 ? unitizeLen(t) : t));
        
                const out = [];
                //Add the inset to the out array if it is true
                if (inset) out.push('inset');
                //Add the lens and rest to the out array
                out.push(...lens, ...rest);
                //Join the out array and return the string(Box-shadow string)
                return out.join(' ');
            }

            // If the property needs units and value is a number or doesn't have valid units
            if (unitsProperties.includes(prop)) {
                // Check if value is just a number (no units)
                if (/^\d+$/.test(value)) {
                    return `${value}px`;
                }
                // Check if value has valid units
                const hasValidUnit = validUnits.some(unit => value.endsWith(unit));
                if (!hasValidUnit) {
                    // Extract the numeric part and add px
                    const numericPart = value.match(/^[\d.]+/);
                    if (numericPart) {
                        return `${numericPart[0]}px`;
                    }
                }
            }
            return value;
        };
        //build the CSS for the ids and classes. prefix is used to add the prefix to the CSS selector. Example: if prefix is .tw-builder__canvas, the CSS selector will be .tw-builder__canvas#id or .tw-builder__canvas.class
        const writeBlock = (idsArr = [], classesArr = [], prefix = '') => {
            let out = '';
          
            const emitBase = (baseSel, properties, states) => {
              const entries = Object.entries(properties || {});
              if (entries.length > 0) {
                out += `${baseSel} {\n`;
                entries.forEach(([prop, value]) => {
                  out += `${prop}: ${addUnits(prop, String(value))};\n`;
                });
                out += `}\n`;
              }
              if (states && typeof states === 'object') {
                Object.entries(states).forEach(([pseudo, props]) => {
                  const stEntries = Object.entries(props || {});
                  if (stEntries.length > 0) {
                    out += `${baseSel}${pseudo} {\n`;
                    stEntries.forEach(([prop, value]) => {
                      out += `${prop}: ${addUnits(prop, String(value))};\n`;
                    });
                    out += `}\n`;
                  }
                });
              }
            };
          
            const emitNested = (baseSel, nested) => {
              if (!nested || typeof nested !== 'object') return;
              Object.entries(nested).forEach(([sel, node]) => {
                const targetSel = sel.includes('&') ? sel.split('&').join(baseSel) : `${baseSel} ${sel.trim()}`;
                emitBase(targetSel, node.properties, node.states);
              });
            };
          
            idsArr?.forEach(({ id, properties, states, nested }) => {
              if (!id) return;
              const baseSel = `${prefix}#${id}`;
              emitBase(baseSel, properties, states);
              emitNested(baseSel, nested);
            });
          
            classesArr?.forEach(({ className, properties, states, nested }) => {
              if (!className) return;
              const baseSel = `${prefix}.${className}`;
              emitBase(baseSel, properties, states);
              emitNested(baseSel, nested);
            });
          
            return out;
          };
    
        // Desktop (base). Build the CSS for the ids and classes
        cssContent += writeBlock(JSONtree?.idsCSSData, JSONtree?.classesCSSData);
    
        // Tablet. Build the CSS for the ids and classes
        const tabletMax = JSONtree?.breakpoints?.tablet || '1024px';
        const tabletBlock = writeBlock(JSONtree?.responsive?.tablet?.idsCSSData, JSONtree?.responsive?.tablet?.classesCSSData);
        //if the tablet block has properties, add the media query 
        if (tabletBlock && tabletBlock.trim().length) {
            cssContent += `@media (max-width: ${tabletMax}) {\n${tabletBlock}}\n`;
        }
    
        // Mobile. Build the CSS for the ids and classes
        const mobileMax = JSONtree?.breakpoints?.mobile || '767px';
        const mobileBlock = writeBlock(JSONtree?.responsive?.mobile?.idsCSSData, JSONtree?.responsive?.mobile?.classesCSSData);
        //if the mobile block has properties, add the media query
        if (mobileBlock && mobileBlock.trim().length) {
            cssContent += `@media (max-width: ${mobileMax}) {\n${mobileBlock}}\n`;
        }

        //Emulate breakpoints in canvas using data-bp attribute
        const tbScoped = writeBlock(
            JSONtree?.responsive?.tablet?.idsCSSData,
            JSONtree?.responsive?.tablet?.classesCSSData,
            '.tw-builder__canvas[data-bp="tablet"] '
        );
        if (tbScoped.trim()) cssContent += `${tbScoped}`;
        const moScoped = writeBlock(
            JSONtree?.responsive?.mobile?.idsCSSData,
            JSONtree?.responsive?.mobile?.classesCSSData,
            '.tw-builder__canvas[data-bp="mobile"] '
        );
        if (moScoped.trim()) cssContent += `${moScoped}`;
        
        // Build the CSS for the enter animation. Using tw-modal--open and tw-banner--open classes next to the id or class
        const writeEnterBlock = (idsArr = [], classesArr = [], scope, prefix = '') => {
            //Declare the class depending the active root
            const openClass = scope === 'modal' ? '.tw-modal--open' : '.tw-banner--open';
            //out is the CSS content to return. Starts empty
            let out = '';

            idsArr?.forEach(({ id, enter }) => {
                //props is the properties of the id
                const props = enter?.[scope];
                if (!id || !props || Object.keys(props).length === 0) return;
                //baseSel is the CSS selector for the id. Example: .tw-builder__canvas.tw-modal--open#id(if has prefix) or .tw-modal--open#id(if no prefix)
                const baseSel = `${prefix}${openClass} #${id}`;
                //add the CSS selector and the properties to the out
                out += `${baseSel} {\n`;
                Object.entries(props).forEach(([prop, value]) => {
                    //add the property and the value to the out
                    out += `${prop}: ${addUnits(prop, String(value))};\n`;
                });
                out += `}\n`;
            });

            classesArr?.forEach(({ className, enter }) => {
                //props is the properties of the class
                const props = enter?.[scope];
                if (!className || !props || Object.keys(props).length === 0) return;
                //isOpenClass is true if the class is tw-modal--open or tw-banner--open
                const isOpenClass = (scope === 'modal' && className === 'tw-modal--open') || (scope === 'banner' && className === 'tw-banner--open');
                //baseSel is the CSS selector for the class. Example: .tw-builder__canvas.tw-modal--open.class(if has prefix) or .tw-modal--open.class(if no prefix)
                const baseSel = isOpenClass ? `${prefix}.${className}` : `${prefix}${openClass} .${className}`;
                out += `${baseSel} {\n`;
                Object.entries(props).forEach(([prop, value]) => {
                    //add the property and the value to the out
                    out += `${prop}: ${addUnits(prop, String(value))};\n`;
                });
                out += `}\n`;
            });

            return out;
        };

        // Build the CSS for the enter animation for banner and modal
        cssContent += writeEnterBlock(JSONtree?.idsCSSData, JSONtree?.classesCSSData, 'banner');
        cssContent += writeEnterBlock(JSONtree?.idsCSSData, JSONtree?.classesCSSData, 'modal');

        // Build the CSS for the enter animation for banner and modal for tablet and mobile
        const tabletEnter = 
            writeEnterBlock(JSONtree?.responsive?.tablet?.idsCSSData, JSONtree?.responsive?.tablet?.classesCSSData, 'banner') +
            writeEnterBlock(JSONtree?.responsive?.tablet?.idsCSSData, JSONtree?.responsive?.tablet?.classesCSSData, 'modal');
        if (tabletEnter.trim()) cssContent += `@media (max-width: ${tabletMax}) {\n${tabletEnter}}\n`;

        const mobileEnter = 
            writeEnterBlock(JSONtree?.responsive?.mobile?.idsCSSData, JSONtree?.responsive?.mobile?.classesCSSData, 'banner') +
            writeEnterBlock(JSONtree?.responsive?.mobile?.idsCSSData, JSONtree?.responsive?.mobile?.classesCSSData, 'modal');
        if (mobileEnter.trim()) cssContent += `@media (max-width: ${mobileMax}) {\n${mobileEnter}}\n`;

        // Build the CSS for the enter animation for banner and modal for tablet and mobile for canvas-scoped
        cssContent += writeEnterBlock(JSONtree?.responsive?.tablet?.idsCSSData, JSONtree?.responsive?.tablet?.classesCSSData, 'banner', '.tw-builder__canvas[data-bp="tablet"] ');
        cssContent += writeEnterBlock(JSONtree?.responsive?.tablet?.idsCSSData, JSONtree?.responsive?.tablet?.classesCSSData, 'modal', '.tw-builder__canvas[data-bp="tablet"] ');
        cssContent += writeEnterBlock(JSONtree?.responsive?.mobile?.idsCSSData, JSONtree?.responsive?.mobile?.classesCSSData, 'banner', '.tw-builder__canvas[data-bp="mobile"] ');
        cssContent += writeEnterBlock(JSONtree?.responsive?.mobile?.idsCSSData, JSONtree?.responsive?.mobile?.classesCSSData, 'modal', '.tw-builder__canvas[data-bp="mobile"] ');
    
        //Check if the style exists. If it does, update the content. If it doesn't, create a new style
        let existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            if(existingStyle.textContent !== cssContent) {
                existingStyle.textContent = cssContent;
            }
        } else {
            //If the style doesn't exist, create a new style
            const css = document.createElement('style');
            css.id = styleId;
            css.textContent = cssContent;
            document.head.appendChild(css);
        }
    }
    //Create the CSS for the ids and classes every time the JSONtree changes
    useEffect(() => {
        createCSS(JSONtree);
    }, [JSONtree]);

    //Get the builder breakpoint to set the data-bp attribute
    const getBuilderBP = () => {
        const canvasW = parseInt(JSONtree?.canvasMaxWidth || '99999', 10);
        const tablet = parseInt(JSONtree?.breakpoints?.tablet || '1024', 10);
        const mobile = parseInt(JSONtree?.breakpoints?.mobile || '767', 10);
        if (canvasW > tablet) return 'desktop';
        if (canvasW > mobile) return 'tablet';
        return 'mobile';
      };
    return (
        <div className="tw-builder__handlebars-canvas-wrapper">
            <div className="tw-builder__handlebar tw-builder__handlebar--left"></div>
            <div 
                className="tw-builder__canvas"
                data-bp={getBuilderBP()}
                style={{
                    //set the background color or live website screenshot
                    backgroundColor: JSONtree?.liveWebsite ? '' : (JSONtree?.canvasColor || '#FFFFFF'),
                    backgroundImage: JSONtree?.liveWebsite && screenshotUrl ? `url(${screenshotUrl})` : 'none',
                    backgroundSize: JSONtree?.liveWebsite ? 'cover' : 'initial',
                    backgroundPosition: JSONtree?.liveWebsite ? 'center' : 'initial',
                    backgroundRepeat: JSONtree?.liveWebsite ? 'no-repeat' : 'initial',
                    position: 'relative'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onMouseLeave={handleMouseLeave}
                onDragLeave={handleDragLeave}
            >
                {JSONtree && JSONtree?.roots?.map(root => renderNode(root, selectedId))}
            </div>
            <div className="tw-builder__handlebar tw-builder__handlebar--right"></div>
        </div>
    );
};