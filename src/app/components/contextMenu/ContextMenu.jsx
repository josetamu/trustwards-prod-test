import React, { useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../../dashboard/dashboard_animations';
import './ContextMenu.css';

// ContextMenu component for right-click menus
// Provides tree manipulation operations: copy, paste, duplicate, wrap, and remove
// Automatically positions itself to stay within viewport bounds
export function ContextMenu({ 
    open, 
    menu, 
    onClose, 
    position = { x: 0, y: 0 },
    className = "", 
    animationType = 'SCALE_TOP',
    targetItem = null,
    treeData = [],
    onTreeDataChange = null,
    onItemSelect = null,
    showNotification = null
}) {
    const containerRef = useRef(null);
    const menuRef = useRef(null);
    const contextMenuId = useId();

    // Clipboard state for copy/paste operations
    const [clipboard, setClipboard] = React.useState(null);

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

    // Calculate menu position to ensure it fits in viewport
    // Automatically adjusts position if menu would go off-screen
    const getMenuPosition = () => {
        if (!menuRef.current) return position;
        
        const menuRect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let x = position.x;
        let y = position.y;
        
        // Adjust horizontal position if menu goes off-screen
        if (x + menuRect.width > viewportWidth) {
            x = viewportWidth - menuRect.width - 10;
        }
        if (x < 10) {
            x = 10;
        }
        
        // Adjust vertical position if menu goes off-screen
        if (y + menuRect.height > viewportHeight) {
            y = position.y - menuRect.height;
        }
        if (y < 10) {
            y = 10;
        }
        
        return { x, y };
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    {...ANIM_TYPES.find(anim => anim.name === animationType)}
                    className={`context-menu ${className}`}
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        left: getMenuPosition().x,
                        top: getMenuPosition().y,
                        zIndex: 1000
                    }}
                >
                    {React.cloneElement(menu, {
                        onCopy: () => executeAction(handleCopy),
                        onPaste: () => executeAction(handlePaste),
                        onDuplicate: () => executeAction(handleDuplicate),
                        onWrap: () => executeAction(handleWrap),
                        onRemove: () => executeAction(handleRemove),
                        canPaste: !!clipboard
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
