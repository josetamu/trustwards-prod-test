import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../../dashboard/dashboard_animations';
import './Dropdown.css';

export function Dropdown({ 
  open,
  menu,
  onClose,
  onResize,
  children,
  verticalPosition = "bottom", // "top" / "bottom"
  horizontalPosition = "right", // "left" / "right"
  horizontalBreakpoint = 1450, // px
  horizontalBreakpointPosition = "left", // "left" / "right"
}) {
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownId = useId();
  const [currentHorizontal, setCurrentHorizontal] = useState(horizontalPosition);

  // horizontalPosition -> horizontalBreakpointPosition
  useEffect(() => {
    if (!open) return;
    const handleResize = () => {
      if (window.innerWidth < horizontalBreakpoint) {
        setCurrentHorizontal(horizontalBreakpointPosition);
      } else {
        setCurrentHorizontal(horizontalPosition);
      }
      if (onResize) onResize();
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [open, horizontalBreakpoint, horizontalBreakpointPosition, horizontalPosition, onResize]);

  // Close dropdown when clicking outside (only if not openOnHover)
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
      className="dropdown"
      ref={containerRef}
      id={dropdownId}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            {...ANIM_TYPES.find(anim => anim.name === 'SCALE_TOP')}
            className={`dropdown__menu dropdown__menu--${verticalPosition}-${currentHorizontal}`}
            ref={menuRef}
          >
            {menu}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

