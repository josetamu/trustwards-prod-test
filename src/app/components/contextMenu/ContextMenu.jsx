'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimTypes } from '@animations/animations';
import { useCanvas } from '@contexts/CanvasContext';
import './ContextMenu.css';

// ContextMenu component
export function ContextMenu({ 
    open, 
    onClose, 
    position = { x: 0, y: 0 },
    className = "", 
    animationType = 'SCALE_TOP',
    targetItem = null,
    showNotification = null,
    previousSelectedItem = null,
    clipboard = null,
    setClipboard = null
}) {
    const containerRef = useRef(null);
    const menuRef = useRef(null);

    // Use canvas context functions
    const { 
        addElement, 
        removeElement, 
        createElement, 
        JSONtree, 
        activeRoot,
        setJSONtree,
        generateUniqueId,
        deepCopy,
        setSelectedItem
    } = useCanvas();

    // Restore selected item when context menu closes
    useEffect(() => {
        if (!open && previousSelectedItem && setSelectedItem) {
            setSelectedItem(previousSelectedItem);
        }
    }, [open, previousSelectedItem, setSelectedItem]);

    // Helper function to find parent of an element
    const findParentById = (tree, itemId, parent = null) => {
        for (const item of tree) {
            if (item.children) {
                for (const child of item.children) {
                    if (child.id === itemId) {
                        return { parent: item, child: child, index: item.children.indexOf(child) };
                    }
                    const found = findParentById([child], itemId, item);
                    if (found) return found;
                }
            }
        }
        return null;
    };

    // Close context menu when clicking outside
    useEffect(() => {
        if (!open) return;
        
        const handleClickOutside = (event) => {
            // Check if click is outside the context menu
            const contextMenuElement = menuRef.current;
            if (contextMenuElement && !contextMenuElement.contains(event.target)) {
                onClose && onClose();
            }
        };
        
        const handleRightClickOutside = (event) => {
            // Check if right-click is outside the context menu
            const contextMenuElement = menuRef.current;
            if (contextMenuElement && !contextMenuElement.contains(event.target)) {
                event.preventDefault();
                onClose && onClose();
            }
        };
        
        // Use requestAnimationFrame to ensure menu is rendered before adding listeners
        const rafId = requestAnimationFrame(() => {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('contextmenu', handleRightClickOutside);
        });
        
        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('contextmenu', handleRightClickOutside);
        };
    }, [open, onClose]);

    // Handle Tab navigation into the menu when it opens and focus restoration on close
    useEffect(() => {
        if (!open) return;
        
        // Store the element that opened the context menu
        const triggeringElement = document.activeElement;
        
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                // ESC: Return to the element that opened the menu
                if (triggeringElement && typeof triggeringElement.focus === 'function') {
                    triggeringElement.focus();
                }
                onClose && onClose();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    // Handle Tab navigation within the menu and to next tree item
    useEffect(() => {
        if (!open) return;
        
        // Store the element that opened the context menu
        const triggeringElement = document.activeElement;
        
        const handleKeyDown = (event) => {
            // When Tab is pressed and focus is on the triggering element, move focus to menu
            if (event.key === 'Tab' && !event.shiftKey) {
                const focusable = menuRef.current?.querySelector('button, [href], [tabindex]:not([tabindex="-1"])');
                if (focusable) {
                    // Check if focus is on the triggering element (tree item or canvas element)
                    const activeElement = document.activeElement;
                    const isTriggeringElement = activeElement?.closest('.tw-builder__tree-item-header') || 
                                               activeElement?.closest('.tw-builder__active');
                    
                    if (isTriggeringElement) {
                        event.preventDefault();
                        focusable.focus();
                    }
                }
            }
            
            // When Tab is pressed on the last menu item, go to next tree item
            if (event.key === 'Tab' && !event.shiftKey) {
                const menuItems = menuRef.current?.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
                const lastMenuItem = menuItems?.[menuItems.length - 1];
                const activeElement = document.activeElement;
                
                if (lastMenuItem && activeElement === lastMenuItem) {
                    event.preventDefault();
                    
                    // Find all tree items in the left panel
                    const treeItems = document.querySelectorAll('.tw-builder__tree-item-header[tabindex="0"]');
                    const treeItemsArray = Array.from(treeItems);
                    const triggeringIndex = treeItemsArray.indexOf(triggeringElement);
                    
                    if (triggeringIndex !== -1 && triggeringIndex < treeItemsArray.length - 1) {
                        // Focus the next tree item
                        const nextTreeItem = treeItemsArray[triggeringIndex + 1];
                        if (nextTreeItem && typeof nextTreeItem.focus === 'function') {
                            nextTreeItem.focus();
                        }
                    } else if (triggeringElement && typeof triggeringElement.focus === 'function') {
                        // Fallback to the triggering element if no next tree item
                        triggeringElement.focus();
                    }
                    
                    // Close the menu when focus leaves it
                    onClose && onClose();
                }
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

    // Helper function to close menu and execute action
    const executeAction = (action) => {
        action();
        onClose && onClose();
    };

    // Context menu actions
    // Copy an item and all its descendants to clipboard
    const handleCopy = () => {
        if (!targetItem) return;
        
        // Store the item in clipboard for pasting
        setClipboard(deepCopy(targetItem));
        
        // Use the same notification system as the project
        if (showNotification) {
            showNotification("Copied to clipboard", "top", false);
        }
    };

    // Paste a copied item inside the target item
    const handlePaste = () => {
        if (!clipboard || !targetItem || !addElement) return;
        
        // Create a deep copy of the clipboard item without the id (addElement will generate new IDs)
        const copiedItem = deepCopy(clipboard);
        copiedItem.__originalId = clipboard.id;
        delete copiedItem.id; // Remove the original ID so addElement can generate new ones
        
        // Use the children attribute from CanvasContext to determine if element can accept children
        if (targetItem.children) {
            // Target can accept children, paste inside it
            addElement(copiedItem, targetItem.id);
        } else {
            // Target cannot accept children, paste at the same level
            const currentRoot = activeRoot === 'tw-root--banner' ? JSONtree.roots[0] : JSONtree.roots[1];
            const parentInfo = findParentById([currentRoot], targetItem.id);
            
            if (parentInfo) {
                // Insert the copied item after the target item at the same level
                const insertIndex = parentInfo.index + 1;
                addElement(copiedItem, parentInfo.parent.id, insertIndex);
            } else {
                // If target item is a root, add to the root level
                addElement(copiedItem, targetItem.id);
            }
        }
    };

    // Duplicate an item and all its descendants at the same level
    const handleDuplicate = () => {
        if (!targetItem || !addElement) return;
        
        // Find the parent of the target item
        const currentRoot = activeRoot === 'tw-root--banner' ? JSONtree.roots[0] : JSONtree.roots[1];
        const parentInfo = findParentById([currentRoot], targetItem.id);
        
        if (!parentInfo) return;
        
        // Create a deep copy of the target item without the id (addElement will generate new IDs)
        const duplicatedItem = deepCopy(targetItem);
        duplicatedItem.__originalId = targetItem.id;
        delete duplicatedItem.id; // Remove the original ID so addElement can generate new ones
        
        // Use addElement to properly duplicate the item with all its CSS data and initialization
        const insertIndex = parentInfo.index + 1;
        addElement(duplicatedItem, parentInfo.parent.id, insertIndex);
    };

    // Wrap an item in a new block container
    const handleWrap = () => {
        if (!targetItem || !createElement || !JSONtree || !setJSONtree) return;
        
        // Don't allow wrapping root elements
        if (targetItem.id === 'tw-root--banner' || targetItem.id === 'tw-root--modal') {
            return;
        }
        
        // Create a new block that will wrap the target item
        const blockProperties = {
            id: generateUniqueId(JSONtree),
            elementType: "block",
            icon: "block",
            tagName: "div",
            label: "Block",
            classList: ["tw-block"],
            nestable: true,
            children: [targetItem] // Put the target item directly inside the block
        };
        
        // Replace the target item with the new block containing it
        const updated = deepCopy(JSONtree);
        const targetRoot = activeRoot === 'tw-root--banner' ? updated.roots[0] : updated.roots[1];
        
        // Find the parent in the updated tree
        const updatedParentInfo = findParentById([targetRoot], targetItem.id);
        if (updatedParentInfo) {
            // Replace the target item with the new block
            updatedParentInfo.parent.children[updatedParentInfo.index] = blockProperties;
            
            setJSONtree(updated);
        }
    };

    // Remove an item and all its descendants from the tree
    const handleRemove = () => {
        if (!targetItem || !removeElement) return;

        removeElement(targetItem.id);
    };

    // Tree context menu content - completely self-contained
    const TreeContextMenu = () => {
        console.log('TreeContextMenu');
        return (
            <>
                {/* Copy */}
                <button 
                    className="tw-context-menu__item"
                    onClick={() => executeAction(handleCopy)}
                >
                    <div className="tw-context-menu__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                            <path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                    <span className="tw-context-menu__label">Copy</span>
                </button>

                {/* Paste - Only show when there's something in clipboard */}
                {clipboard && (
                    <button 
                        className="tw-context-menu__item"
                        onClick={() => executeAction(handlePaste)}
                    >
                        <div className="tw-context-menu__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none">
                                <path d="M12 2H18C19.1046 2 20 2.89543 20 4V15.0145L12.9986 22.0015H6C4.89543 22.0015 4 21.1061 4 20.0015V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 15H15C13.8954 15 13 15.8954 13 17V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 10V7.00016C12 5.89559 11.1046 5.00016 10 5.00016H4.50195M7 2L4 4.99625L7 7.99625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="tw-context-menu__label">Paste</span>
                    </button>
                )}

                <div className="tw-context-menu__divider"></div>

                {/* Duplicate */}
                <button 
                    className="tw-context-menu__item"
                    onClick={() => executeAction(handleDuplicate)}
                >
                    <div className="tw-context-menu__icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <span className="tw-context-menu__label">Duplicate</span>
                </button>

                {/* Wrap */}
                <button 
                    className="tw-context-menu__item"
                    onClick={() => executeAction(handleWrap)}
                >
                    <div className="tw-context-menu__icon">
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="12" height="12" rx="2" fill="currentColor"/>
                        </svg>
                    </div>
                    <span className="tw-context-menu__label">Wrap</span>
                </button>

                <div className="tw-context-menu__divider"></div>

                {/* Remove */}
                <button 
                    className="tw-context-menu__item tw-context-menu__item--delete"
                    onClick={() => executeAction(handleRemove)}
                >
                    <div className="tw-context-menu__icon">
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
        <AnimatePresence>
            {open && (
                <motion.div
                {...getAnimTypes().find(anim => anim.name === animationType)}
                className={`tw-context-menu ${className}`}
                ref={containerRef}
                style={{
                    left: position.x,
                    top: position.y
                }}
                >
                    <div
                        className="tw-context-menu__menu"
                        ref={menuRef}
                        role="menu"
                        aria-label="Context menu"
                    >
                        <TreeContextMenu />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}