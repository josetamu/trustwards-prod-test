import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../dashboard_animations';
import './Dropdown.css';



export function Dropdown({ 
  trigger,
  menu,
  openOnHover = false, 
  position = "bottom-left", 
  onMouseEnter,
  onMouseLeave,
  onOpen,
  onClose
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(position);
  const dropdownId = useId();
  // Close dropdown when clicking outside (only if not openOnHover)
  useEffect(() => {
    if (!openOnHover) {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open, openOnHover]);

  // Mouse enter and leave events
  const handleMouseEnter = () => {
    if (onMouseEnter) onMouseEnter();
    if (openOnHover) setOpen(true);
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) onMouseLeave();
    if (openOnHover) setOpen(false);
  };

  // Menu alignment
  useEffect(() => {
    if (open && dropdownRef.current && menuRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
  
      // Default position
      let newPos = position;
  
      // Check horizontal overflow (right side)
      const overflowsRight = dropdownRect.left + menuRect.width > vw;
      const overflowsLeft = dropdownRect.right - menuRect.width < 0;
  
      // Right overflow then switch to left, left overflow then switch to right
      if (newPos.includes('right') && overflowsRight) {
        newPos = newPos.replace('right', 'left');
      } else if (newPos.includes('left') && overflowsLeft) {
        newPos = newPos.replace('left', 'right');
      }
  
      // Check vertical overflow (bottom side)
      const overflowsBottom = dropdownRect.bottom + menuRect.height > vh;
      const overflowsTop = dropdownRect.top - menuRect.height < 0;
  
      // Bottom overflow then switch to top, top overflow then switch to bottom
      if (newPos.startsWith('bottom') && overflowsBottom) {
        newPos = newPos.replace('bottom', 'top');
      } else if (newPos.startsWith('top') && overflowsTop) {
        newPos = newPos.replace('top', 'bottom');
      }
  
      setCurrentPosition(newPos);
    }
  }, [open, position]);

  // Call onOpen/onClose
  useEffect(() => {
    if (open && onOpen) onOpen();
    if (!open && onClose) onClose();
  }, [open, onOpen, onClose]);

  return (
    <div
      className="dropdown"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-position={currentPosition}
      id={dropdownId}
    >
      <div onClick={() => setOpen(v => !v)}>
        {trigger}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            {...ANIM_TYPES.find(anim => anim.name === 'SCALE_TOP')}

            className={`dropdown__menu dropdown__menu--${currentPosition}`}
            ref={menuRef}
          >
            {menu}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
