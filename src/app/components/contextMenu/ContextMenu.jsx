import React, { useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../../dashboard/dashboard_animations';
import './ContextMenu.css';

// ContextMenu component - exactly like Dropdown but with position instead of children
export function ContextMenu({ open, menu, onClose, className = "", animationType = 'SCALE_TOP', position = { x: 0, y: 0 } }) {
    const containerRef = useRef(null);
    const menuRef = useRef(null);
    const contextMenuId = useId();

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

    // Calculate menu position to ensure it fits in viewport
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
                            left: getMenuPosition().x,
                            top: getMenuPosition().y,
                            zIndex: 9999
                        }}
                    >
                        {menu}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
