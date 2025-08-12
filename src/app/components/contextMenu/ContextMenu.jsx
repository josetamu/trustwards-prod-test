import React, { useRef, useEffect, useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../../dashboard/dashboard_animations';
import './ContextMenu.css';

// ContextMenu component - completely autonomous and reusable
export function ContextMenu({ 
    open, 
    onClose, 
    position = { x: 0, y: 0 },
    className = "", 
    animationType = 'SCALE_TOP',
    targetItem = null,
    treeData = [],
    onTreeDataChange = null,
    showNotification = null
}) {
    const containerRef = useRef(null);
    const menuRef = useRef(null);
    const contextMenuId = useId();

    // Clipboard state for copy/paste operations
    const [clipboard, setClipboard] = useState(null);

    // Close context menu when clicking outside
    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                onClose && onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, onClose]);

    // Close context menu when pressing Escape
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose && onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    // Close context menu when scrolling
    useEffect(() => {
        if (!open) return;
        const handleScroll = () => {
            onClose && onClose();
        };
        document.addEventListener('scroll', handleScroll, true);
        return () => document.removeEventListener('scroll', handleScroll, true);
    }, [open, onClose]);

    // Close context menu when window resizes
    useEffect(() => {
        if (!open) return;
        const handleResize = () => {
            onClose && onClose();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [open, onClose]);

    // Tree manipulation functions
    // Find an item in the tree by its ID
    const findItemById = (tree, itemId) => {
        for (const item of tree) {
            if (item.id === itemId) return item;
            if (item.children) {
                const found = findItemById(item.children, itemId);
                if (found) return found;
            }
        }
        return null;
    };

    // Remove an item from the tree by its ID
    const removeItemById = (tree, itemId) => {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === itemId) {
                tree.splice(i, 1);
                return true;
            }
            if (tree[i].children) {
                if (removeItemById(tree[i].children, itemId)) {
                    return true;
                }
            }
        }
        return false;
    };

    // Generate a unique ID for copied/duplicated items to avoid conflicts
    const generateUniqueId = (baseId) => {
        let counter = 1;
        let newId = `${baseId}-copy`;
        
        while (findItemById(treeData, newId)) {
            newId = `${baseId}-copy-${counter}`;
            counter++;
        }
        
        return newId;
    };

    // Deep clone an item and generate new unique IDs for all descendants
    const deepCloneItem = (item) => {
        const cloned = JSON.parse(JSON.stringify(item));
        
        // Generate new unique IDs for the cloned item and all its descendants
        const updateIds = (node) => {
            const oldId = node.id;
            node.id = generateUniqueId(oldId);
            
            if (node.children) {
                node.children.forEach(updateIds);
            }
        };
        
        updateIds(cloned);
        return cloned;
    };

    // Insert a new item at a specific position relative to a target item
    // Position can be 'before', 'after', or 'inside' the target
    const insertItemAtPosition = (tree, newItem, targetId, position = 'after') => {
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === targetId) {
                if (position === 'inside') {
                    if (!tree[i].children) tree[i].children = [];
                    tree[i].children.unshift(newItem);
                } else if (position === 'before') {
                    tree.splice(i, 0, newItem);
                } else if (position === 'after') {
                    tree.splice(i + 1, 0, newItem);
                }
                return true;
            }
            if (tree[i].children) {
                if (insertItemAtPosition(tree[i].children, newItem, targetId, position)) {
                    return true;
                }
            }
        }
        return false;
    };

    // Helper function to close menu and execute action
    const executeAction = (action) => {
        action();
        onClose && onClose();
    };

    // Context menu actions
    // Copy an item and all its descendants to clipboard
    const handleCopy = () => {
        if (!targetItem || !treeData.length) return;
        
        const itemToCopy = findItemById(treeData, targetItem.id);
        if (itemToCopy) {
            setClipboard(deepCloneItem(itemToCopy));
            
            // Use the same notification system as the project
            if (showNotification) {
                showNotification("Copied to clipboard", "top", false);
            }
            
            console.log('Copied:', itemToCopy.id, 'with all descendants');
        }
    };

    // Paste a copied item inside the target item
    const handlePaste = () => {
        if (!clipboard || !targetItem || !treeData.length || !onTreeDataChange) return;
        
        const newTreeData = JSON.parse(JSON.stringify(treeData));
        const clonedItem = deepCloneItem(clipboard);
        
        // Always paste inside the target item (not after it)
        if (insertItemAtPosition(newTreeData, clonedItem, targetItem.id, 'inside')) {
            onTreeDataChange(newTreeData);
            console.log('Pasted:', clonedItem.id, 'inside:', targetItem.id);
        }
    };

    // Duplicate an item and all its descendants after the original
    const handleDuplicate = () => {
        if (!targetItem || !treeData.length || !onTreeDataChange) return;
        
        const newTreeData = JSON.parse(JSON.stringify(treeData));
        const itemToDuplicate = findItemById(newTreeData, targetItem.id);
        
        if (itemToDuplicate) {
            const duplicatedItem = deepCloneItem(itemToDuplicate);
            
            // Insert the duplicated item after the original
            if (insertItemAtPosition(newTreeData, duplicatedItem, targetItem.id, 'after')) {
                onTreeDataChange(newTreeData);
                console.log('Duplicated:', targetItem.id, 'with all descendants');
            }
        }
    };

    // Wrap an item in a new container div
    const handleWrap = () => {
        if (!targetItem || !treeData.length || !onTreeDataChange) return;
        
        const newTreeData = JSON.parse(JSON.stringify(treeData));
        const itemToWrap = findItemById(newTreeData, targetItem.id);
        
        if (itemToWrap) {
            // Create a wrapper div
            const wrapper = {
                id: generateUniqueId('wrapper'),
                label: 'Wrapper',
                type: 'container',
                children: [itemToWrap]
            };
            
            // Replace the original item with the wrapper
            if (insertItemAtPosition(newTreeData, wrapper, targetItem.id, 'after')) {
                // Remove the original item
                removeItemById(newTreeData, targetItem.id);
                onTreeDataChange(newTreeData);
                console.log('Wrapped:', targetItem.id, 'in new container');
            }
        }
    };

    // Remove an item and all its descendants from the tree
    const handleRemove = () => {
        if (!targetItem || !treeData.length || !onTreeDataChange) return;
        
        const newTreeData = JSON.parse(JSON.stringify(treeData));
        
        if (removeItemById(newTreeData, targetItem.id)) {
            onTreeDataChange(newTreeData);
            console.log('Removed:', targetItem.id, 'with all descendants');
        }
    };

    // Tree context menu content - completely self-contained
    const TreeContextMenu = () => {
        return (
            <>
                {/* Copy */}
                <button 
                    className="context-menu__item"
                    onClick={() => executeAction(handleCopy)}
                >
                    <div className="context-menu__icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 2H2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H10C10.5523 14 11 13.5523 11 13V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6H14C14.5523 6 15 6.44772 15 7V15C15 15.5523 14.5523 16 14 16H6C5.44772 16 5 15.5523 5 15V7C5 6.44772 5.44772 6 6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="context-menu__label">Copy</span>
                </button>

                {/* Paste */}
                <button 
                    className={`context-menu__item ${!clipboard ? 'context-menu__item--disabled' : ''}`}
                    onClick={() => executeAction(handlePaste)}
                    disabled={!clipboard}
                >
                    <div className="context-menu__icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2H10C10.5523 2 11 2.44772 11 3V7H15V11C15 11.5523 14.5523 12 14 12H10C9.44772 12 9 11.5523 9 11V7H5V3C5 2.44772 5.44772 2 6 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="context-menu__label">Paste</span>
                </button>

                <div className="context-menu__divider"></div>

                {/* Duplicate */}
                <button 
                    className="context-menu__item"
                    onClick={() => executeAction(handleDuplicate)}
                >
                    <div className="context-menu__icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="context-menu__label">Duplicate</span>
                </button>

                {/* Wrap */}
                <button 
                    className="context-menu__item"
                    onClick={() => executeAction(handleWrap)}
                >
                    <div className="context-menu__icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 3H13V13H3V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6H10M6 9H10M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="context-menu__label">Wrap</span>
                </button>

                <div className="context-menu__divider"></div>

                {/* Remove */}
                <button 
                    className="context-menu__item context-menu__item--delete"
                    onClick={() => executeAction(handleRemove)}
                >
                    <div className="context-menu__icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H13M5 6V5C5 4.44772 5.44772 4 6 4H10C10.5523 4 11 4.44772 11 5V6M7 9V12M9 9V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span>Remove</span>
                </button>
            </>
        );
    };

    return (
        <div
            className={`context-menu ${className}`}
            ref={containerRef}
            id={contextMenuId}
        >
            <AnimatePresence>
                {open && (
                    <motion.div
                        {...ANIM_TYPES.find(anim => anim.name === animationType)}
                        className="context-menu__menu"
                        ref={menuRef}
                        style={{
                            position: 'fixed',
                            left: position.x,
                            top: position.y,
                            zIndex: 9999
                        }}
                    >
                        <TreeContextMenu />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
