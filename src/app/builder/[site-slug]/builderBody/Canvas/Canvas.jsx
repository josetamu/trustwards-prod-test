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

export const Canvas = ({site}) => {
    const { JSONtree, activeRoot, selectedId, setSelectedId, moveElement, createElement, CallContextMenu, setSelectedItem,
        runElementScript, notifyElementCreatedFromToolbar, setJSONtree, deepCopy} = useCanvas();

        const [screenshotUrl, setScreenshotUrl] = useState(null);
        const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(false);
    
    // Function to generate screenshot URL using existing scan API
    const generateScreenshotUrl = (domain) => {
        if (!domain) return null;
        
        const encodedDomain = encodeURIComponent(domain);
        return `/api/screenshot?domain=${encodedDomain}`;
    };
    
        // Effect to handle live website screenshot
        useEffect(() => {
            if (JSONtree?.liveWebsite && site?.Domain) {
                setIsLoadingScreenshot(true);
                const url = generateScreenshotUrl(site.Domain);
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

    //Create a stylesheet for the properties every time the idsData or classesData changes
    //For each id, add its CSS selector and properties
    //For each class, add its CSS selector and properties
    const createCSS = (JSONtree) => {
        const styleId = 'tw-dynamic-stylesheet';

        //valid units. If user types for example 100 or 100a it will add px to the value
        const validUnits = ['px','%', 'em', 'rem', 'vh', 'vw', 'vmin', 'vmax', 'deg', 'rad', 'grad', 'turn', 's', 'ms', 'hz', 'khz'];
        //properties that need units. opacity is not in the list because it doesn't need units
        const unitsProperties = ['width','max-width', 'height', 'max-height', 'font-size', 'line-height', 'border-width', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-radius','border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'gap', 'grid-gap', 'grid-column-gap', 'grid-row-gap', 'column-gap', 'row-gap','flex-basis'];
        
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

        //For each id, add its CSS selector and properties (if id is empty, it won't be added)
        JSONtree?.idsCSSData?.forEach(({ id, properties }) => {
            const propertyEntries = Object.entries(properties);
            if (propertyEntries.length > 0) {
                //use :where has specificity 0, so classes with the same name will override the id
                cssContent += `#${id} {\n`;
                propertyEntries.forEach(([prop, value]) => {
                    //add units to the value if needed
                    const validatedValue = addUnits(prop, value);
                    cssContent += `${prop}: ${validatedValue};\n`;
                });
                cssContent += `}\n`;
            }
        });

        //For each class, add its CSS selector and properties (if class is empty, it won't be added)
        JSONtree?.classesCSSData?.forEach(({ className, properties }) => {
            const propertyEntries = Object.entries(properties);
            if (propertyEntries.length > 0) {
                cssContent += `.${className} {\n`;
                propertyEntries.forEach(([prop, value]) => {
                    //add units to the value if needed
                    const validatedValue = addUnits(prop, value);
                    cssContent += `${prop}: ${validatedValue};\n`;
                });
                cssContent += `}\n`;
            }
        });

        // Check if style element exists and if content has changed
        let existingStyle = document.getElementById(styleId);
        if (existingStyle) { // Change current style element content if CSS properties have changed
            if(existingStyle.textContent !== cssContent) {
                existingStyle.textContent = cssContent;
            }
        } else { // Create new style element if it doesn't exist
            const css = document.createElement('style');
            css.id = styleId;
            css.textContent = cssContent;
            document.head.appendChild(css);
        }
    }
    useEffect(() => {
        createCSS(JSONtree);
    }, [JSONtree]);

    return (
        <div className="tw-builder__handlebars-canvas-wrapper">
            <div className="tw-builder__handlebar tw-builder__handlebar--left"></div>
            <div 
                className="tw-builder__canvas"
                style={{
                    backgroundColor: JSONtree?.liveWebsite ? 'transparent' : (JSONtree?.canvasColor || '#FFFFFF'),
                    backgroundImage: JSONtree?.liveWebsite && screenshotUrl ? `url(${screenshotUrl})` : 'none',
                    backgroundSize: JSONtree?.liveWebsite ? 'cover' : 'initial',
                    backgroundPosition: JSONtree?.liveWebsite ? 'top left' : 'initial',
                    backgroundRepeat: JSONtree?.liveWebsite ? 'no-repeat' : 'initial',
                    position: 'relative'
                }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onMouseLeave={handleMouseLeave}
                onDragLeave={handleDragLeave}
            >
                {isLoadingScreenshot && JSONtree?.liveWebsite && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div>Loading website screenshot...</div>
                    </div>
                )}
                {JSONtree.liveWebsite && screenshotUrl &&(
                    <img 
                    src={screenshotUrl}
                    onLoad={() => setIsLoadingScreenshot(false)}
                    onError={() => setIsLoadingScreenshot(false)}
                    style={{ display: 'none' }}
                    alt=""
                    
                    />
                )}
                {JSONtree && JSONtree?.roots?.map(root => renderNode(root, selectedId))}
            </div>
            <div className="tw-builder__handlebar tw-builder__handlebar--right"></div>
        </div>
    );
};