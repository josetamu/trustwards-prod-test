import "./Canvas.css";

import { useCanvas } from '@contexts/CanvasContext';
import React, { useEffect } from "react";

export const Canvas = () => {
    const { JSONtree, activeRoot, selectedId, setSelectedId, moveElement, createElement } = useCanvas();

    /*
    * Used by the canvas to convert the JSONtree into React elements
    * node - The JSON node to render (canvas passes the root)
    * setSelectedId - When an element is clicked, set it as the selectedId
    * selectedId - Current element selected
    */
    const renderNode = (node, selectedId) => {
        const isSelected = node.id === selectedId;
        const isRoot = node.id === 'tw-root--banner' || node.id === 'tw-root--modal';
        const isActiveRoot = node.id === activeRoot;

        // Set the node properties from its JSON (id, classes, tag, children, etc..)
        const nodeProps = {
            id: node.id, // Add the node.id as the real id
            ...(node.classList.length > 0 && { className: node.classList.join(' ') }), // Add the node.classList as the real classList

            onClick: (e) => {
                e.stopPropagation();
                if(node.draggable !== false) { //If the node is not draggable, it can't be selected neither
                    setSelectedId(node.id); // Set the clicked element as the selectedId
                }
            },

            //Add canvas classes to the node (dont use addClass on this render because it will render JSONtree in a loop)
            className: [
                ...node.classList,
                ...(node.classList.includes('tw-block') && node.children.length === 0 ? ['tw-block--empty'] : []), // Add the class tw-block--empty if the node has the class tw-block and no children
                ...(isSelected ? ['tw-builder__active'] : []), // Add the class tw-builder__active to the classList of the selected element
                ...(isActiveRoot ? ['tw-active-root'] : []), // Add the class tw-active-root to the classList of the active root element
            ].join(' '),

            ...(isRoot || node.draggable === false ? {} : { //If the node is the root or the node is not draggable, don't make it draggable
                draggable: true,
                onDragStart: (e) => {
                    e.stopPropagation();
                    e.dataTransfer.setData("draggedElementId", node.id);
                },
            })
        };
    
        const children = node.children?.map((child) => //Renders the children of the node (JSON tree) in loop
            renderNode(child, selectedId)
        )

        switch (node.tagName) {
            case 'img':
                return React.createElement(node.tagName, { key: node.id, ...nodeProps, src: node.src });
            case 'input':
                return React.createElement(node.tagName, { key: node.id, ...nodeProps, type: node.attributes.type, name: node.attributes.name });
            case 'svg':
                return React.createElement(node.tagName, { key: node.id, ...nodeProps, ...node.attributes }, children);
            case 'path':
                return React.createElement(node.tagName, { key: node.id, ...nodeProps, ...node.attributes });
            default:
                return React.createElement(node.tagName, { key: node.id, ...nodeProps }, node.text, children);
        }
    };

    //Categories element script function
    useEffect(() => {
        categoriesElementsFunction();
    }, [JSONtree]); //We need to run this function every time the JSONtree changes (Could be optimized??)
    const categoriesElementsFunction = () => {
        //we can check for custom attributes here to customize the animation

        document.querySelectorAll('.tw-categories').forEach(categoriesElement => {
            categoriesElement.querySelectorAll('.tw-categories__expander').forEach(expander => {
                let content = expander.querySelector('.tw-categories__expander-content');
                expander.querySelector('.tw-categories__expander-header').addEventListener('click', (event) => {
                    if (event.target.classList.contains('tw-categories__expander-checkbox')) {
                        return;
                    }
                    if (expander.classList.toggle('tw-categories__expander--open')) {
                        content.style.height = content.scrollHeight + 'px';
                    } else {
                        content.style.height = '0px';
                    }
                });
                expander.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' && event.target === expander) {
                        expander.click();
                    }
                });
            });
        });
    }

    /*
    * Fallback to set the root element as the selected element when interacting outside of the canvas and the toolbar
    */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.tw-builder__canvas') && 
            !e.target.closest('.tw-builder__toolbar') &&
            !e.target.closest('.tw-builder__right-body') &&
            !e.target.closest('.tw-builder__tab-container') &&
            !e.target.closest('.tw-builder__tree-content')) {
                setSelectedId(activeRoot);
                
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
    }, []);

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

    return (
        <div className="tw-builder__handlebars-canvas-wrapper">
            <div className="tw-builder__handlebar tw-builder__handlebar--left"></div>
            <div className="tw-builder__canvas"
            
            onDragOver={handleDragOver} /*Handle where the element is being dragged over and will be dropped (using drop indicator)*/
            onDrop={handleDrop} /*Create element on drop (resposability transfered from toolbar)*/
            onMouseLeave={handleMouseLeave} /*Remove drop indicator instantly as soon as the mouse leaves the canvas*/
            >
                {JSONtree && JSONtree.roots.map(root => renderNode(root, selectedId))} {/* Renders both root nodes */}
            </div>
            <div className="tw-builder__handlebar tw-builder__handlebar--right"></div>
        </div>
    );
};