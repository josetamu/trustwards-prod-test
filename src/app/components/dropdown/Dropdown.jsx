import React, { useRef, useEffect, useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '@animations/animations';
import './Dropdown.css';

// Dropdown component for menus and actions
export function Dropdown({ open, menu, onClose, children, className = "", animationType = 'SCALE_TOP' }) {
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownId = useId();
  const [fixedStyle, setFixedStyle] = React.useState(null);

  // Close dropdown when clicking outside
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

  // Close dropdown when pressing Escape and handle Tab navigation
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose && onClose();
      }
      
      // Handle Tab navigation - close dropdown when focus leaves the last item
      if (event.key === 'Tab' && !event.shiftKey) {
        const menuItems = menuRef.current?.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
        const lastMenuItem = menuItems?.[menuItems.length - 1];
        const activeElement = document.activeElement;
        
        if (lastMenuItem && activeElement === lastMenuItem) {
          // Focus is on the last menu item and Tab was pressed
          // Close the dropdown and let the browser handle focus naturally
          onClose && onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Calculate fixed position for sidebar__sites-dropdown
  useEffect(() => {
    if (
      open &&
      className.includes('sidebar__sites-dropdown') &&
      containerRef.current &&
      menuRef.current
    ) {
      const toggleRect = containerRef.current.getBoundingClientRect();
      if (window.innerWidth < 767) {
        setFixedStyle({
          position: 'fixed',
          top: toggleRect.bottom,
        });
      } else {
        setFixedStyle({
          position: 'fixed',
          top: toggleRect.bottom,
          left: toggleRect.left,
        });
      }
    } else {
      setFixedStyle(null);
    }
  }, [open, className]);


    // Close dropdown when window width changes 
    useEffect(() => {
      const handleResize = () => {
        onClose && onClose();
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <div
      className={`dropdown ${className}`}
      ref={containerRef}
      id={dropdownId}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            {...ANIM_TYPES.find(anim => anim.name === animationType)}
            className="dropdown__menu"
            ref={menuRef}
            style={fixedStyle ? fixedStyle : undefined}
          >
            {menu}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}