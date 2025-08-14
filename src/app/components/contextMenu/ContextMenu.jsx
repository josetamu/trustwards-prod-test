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
    showNotification = null,
    removeElement = null,
    addElement = null
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
        if (!clipboard || !targetItem || !addElement) return;
        
        // Create a new element with the same properties as the copied item
        const elementProperties = {
            elementType: clipboard.elementType || "block",
            icon: clipboard.icon || "block",
            tagName: clipboard.tagName || "div",
            label: clipboard.label || "Copied Element",
            children: clipboard.children || [],
            classList: clipboard.classList || [],
            nestable: clipboard.nestable || true,
            text: clipboard.text,
            src: clipboard.src,
            attributes: clipboard.attributes
        };
        
        // Use the addElement function from canvas context to add the copied element
        addElement(elementProperties, targetItem.id);
        console.log('Pasted:', clipboard.id, 'inside:', targetItem.id);
    };

    // Duplicate an item and all its descendants after the original
    const handleDuplicate = () => {
        if (!targetItem || !treeData.length || !onTreeDataChange) return;
        
        const newTreeData = JSON.parse(JSON.stringify(treeData));
        const itemToDuplicate = findItemById(newTreeData, targetItem.id);
        
        if (itemToDuplicate) {
            const duplicatedItem = deepCloneItem(itemToDuplicate);
            
            // Insert the duplicated item after the original at the same level
            if (insertItemAtPosition(newTreeData, duplicatedItem, targetItem.id, 'after')) {
                onTreeDataChange(newTreeData);
                console.log('Duplicated:', targetItem.id, 'with all descendants');
            }
        }
    };

    // Wrap an item in a new block container
    const handleBlock = () => {
        if (!targetItem || !treeData.length || !onTreeDataChange) return;
        
        // Don't allow wrapping root elements
        if (targetItem.id === 'tw-root--banner' || targetItem.id === 'tw-root--modal') {
            return;
        }
        
        const newTreeData = JSON.parse(JSON.stringify(treeData));
        const itemToWrap = findItemById(newTreeData, targetItem.id);
        
        if (itemToWrap) {
            // Create the block with a unique ID
            const block = {
                id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                elementType: "block",
                icon: "block",
                tagName: "div",
                label: "Block",
                classList: ["tw-block"],
                nestable: true,
                children: [itemToWrap] // Move the original element inside
            };
            
            // Replace the original element with the block
            // First insert the block in the same position
            if (insertItemAtPosition(newTreeData, block, targetItem.id, 'after')) {
                // Then remove the original element
                removeItemById(newTreeData, targetItem.id);
                
                onTreeDataChange(newTreeData);
                console.log('Wrapped:', targetItem.id, 'in new block');
            }
        }
    };

    // Remove an item and all its descendants from the tree
    const handleRemove = () => {
        if (!targetItem || !removeElement) return;
        
        removeElement(targetItem.id);
        console.log('Removed:', targetItem.id, 'with all descendants');
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                            <path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                    <span className="context-menu__label">Copy</span>
                </button>

                {/* Paste - Only show when there's something in clipboard */}
                {clipboard && (
                    <button 
                        className="context-menu__item"
                        onClick={() => executeAction(handlePaste)}
                    >
                        <div className="context-menu__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                                <path d="M12 2H18C19.1046 2 20 2.89543 20 4V15.0145L12.9986 22.0015H6C4.89543 22.0015 4 21.1061 4 20.0015V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 15H15C13.8954 15 13 15.8954 13 17V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 10V7.00016C12 5.89559 11.1046 5.00016 10 5.00016H4.50195M7 2L4 4.99625L7 7.99625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="context-menu__label">Paste</span>
                    </button>
                )}

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

                {/* Block */}
                <button 
                    className="context-menu__item"
                    onClick={() => executeAction(handleBlock)}
                >
                    <div className="context-menu__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="context-menu__label">Block</span>
                </button>

                <div className="context-menu__divider"></div>

                {/* Remove */}
                <button 
                    className="context-menu__item context-menu__item--delete"
                    onClick={() => executeAction(handleRemove)}
                >
                    <div className="context-menu__icon">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.625 3.20898L10.1081 11.7379C10.0708 12.3537 9.56047 12.834 8.94354 12.834H3.55644C2.93951 12.834 2.42922 12.3537 2.3919 11.7379L1.875 3.20898" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M1 3.20768H3.91667M3.91667 3.20768L4.64015 1.51956C4.73207 1.30508 4.94297 1.16602 5.17632 1.16602H7.32368C7.55702 1.16602 7.76795 1.30508 7.85982 1.51956L8.58333 3.20768M3.91667 3.20768H8.58333M11.5 3.20768H8.58333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4.79102 9.625V6.125" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7.70898 9.625V6.125" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
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