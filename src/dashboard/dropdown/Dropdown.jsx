import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../dashboard_animations';
import './Dropdown.css';

export function Dropdown({ 
  open,
  menu,
  position = "bottom-left",
  onClose,
  children
}) {
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(position);

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

  // Menu alignment
  useEffect(() => {
    if (open && containerRef.current && menuRef.current) {
      const anchorRect = containerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let newPos = position;
      // Horizontal overflow
      const overflowsRight = anchorRect.left + menuRect.width > vw;
      const overflowsLeft = anchorRect.right - menuRect.width < 0;
      if (newPos.includes('right') && overflowsRight) {
        newPos = newPos.replace('right', 'left');
      } else if (newPos.includes('left') && overflowsLeft) {
        newPos = newPos.replace('left', 'right');
      }
      // Vertical overflow
      const overflowsBottom = anchorRect.bottom + menuRect.height > vh;
      const overflowsTop = anchorRect.top - menuRect.height < 0;
      if (newPos.startsWith('bottom') && overflowsBottom) {
        newPos = newPos.replace('bottom', 'top');
      } else if (newPos.startsWith('top') && overflowsTop) {
        newPos = newPos.replace('top', 'bottom');
      }
      setCurrentPosition(newPos);
    }
  }, [open, position]);

  return (
    <div
      className="dropdown"
      ref={containerRef}
      data-position={currentPosition}
    >
      {children}
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

