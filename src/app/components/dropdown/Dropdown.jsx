import React, { useRef, useEffect, useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../../dashboard/dashboard_animations';
import './Dropdown.css';

export function Dropdown({ 
  open,
  menu,
  onClose,
  children,
  className = ""
}) {
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownId = useId();

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
            {...ANIM_TYPES.find(anim => anim.name === 'SCALE_TOP')}
            className={`dropdown__menu`}
            ref={menuRef}
          >
            {menu}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

