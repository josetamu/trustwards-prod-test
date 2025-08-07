import "./Canvas.css";

import { useCanvas } from '@contexts/CanvasContext';
import React, { useEffect } from "react";

export const Canvas = () => {
    const { JSONtree, selectedId, setSelectedId, addElement } = useCanvas();

    /*
    * Used by the canvas to convert the JSONtree into React elements
    * node - The JSON node to render (canvas passes the root)
    * setSelectedId - When an element is clicked, set it as the selectedId
    * selectedId - Current element selected
    */
    const renderNode = (node, selectedId, setSelectedId) => {
        const isSelected = node.id === selectedId;

        // Set the node properties from its JSON (id, classes, tag, children, etc..)
        const nodeProps = {
            id: node.id, // Add the node.id as the real id
            ...(node.classList.length > 0 && { className: node.classList.join(' ') }), // Add the node.classList as the real classList
            onClick: (e) => {
                e.stopPropagation();
                setSelectedId(node.id); // Set the clicked element as the selectedId
            },
            //Add canvas classes to the node (dont use addClass on this render because it will render JSONtree in a loop)
            className: [
                ...node.classList,
                ...(node.classList.includes('tw-builder__block') && node.children.length === 0 ? ['tw-builder__block--empty'] : []), // Add the class tw-builder__block--empty if the node has the class tw-builder__block and no children
                ...(isSelected ? ['tw-builder__active'] : []), // Add the class tw-builder__active to the classList of the selected element
            ].join(' '),
        };
    
        const children = node.children?.map((child) => //Render the children of the node (JSON tree) in loop
            renderNode(child, selectedId, setSelectedId)
        );

        switch (node.tagName) {
            case 'img':
                return React.createElement(node.tagName, { key: node.id, ...nodeProps, src: node.src });
            default:
                return React.createElement(node.tagName, { key: node.id, ...nodeProps }, node.text, children);
        }
    };

    /*
    * Fallback to set the root element as the selected element when interacting outside of the canvas and the toolbar
    */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.tw-builder__canvas') && 
            !e.target.closest('.tw-builder__toolbar') &&
            !e.target.closest('.tw-builder__settings')) {
                setSelectedId('tw-root');
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

    const handleDrop = (e) => {
        e.preventDefault();
        const elementType = e.dataTransfer.getData('elementType');
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Use addElement to add the new element at the calculated position
        addElement({ tagName: elementType, style: { position: 'absolute', left: `${x}px`, top: `${y}px` } });
    };

    return (
        <div className="tw-builder__handlebars-canvas-wrapper">
            <div className="tw-builder__handlebar tw-builder__handlebar--left"></div>
            <div className="tw-builder__canvas" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                {JSONtree && renderNode(JSONtree, selectedId, setSelectedId) /* Render the JSONtree */}
            </div>
            <div className="tw-builder__handlebar tw-builder__handlebar--right"></div>
        </div>
    );
};