import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../dashboard_animations';
import './Dropdown.css';

export function Dropdown({ 
  open,
  menu,
  onClose,
  children,
  verticalPosition = "bottom", // "top" / "bottom"
  horizontalPosition = "left", // "left" / "right"
  horizontalBreakpoint = 1200, // px
  horizontalAnimBreakpoint = 1200, // px
  animationOrigin // "top", "bottom", "left", "right" (optional)
}) {
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const [currentVertical, setCurrentVertical] = useState(verticalPosition);
  const [currentHorizontal, setCurrentHorizontal] = useState(horizontalPosition);
  const [transformOrigin, setTransformOrigin] = useState('top left');
  const dropdownId = useId();

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

  // Menu alignment + transformOrigin
  useEffect(() => {
    if (open && containerRef.current && menuRef.current) {
      const anchorRect = containerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let newVertical = verticalPosition;
      let newHorizontal = horizontalPosition;
      // Vertical overflow
      const overflowsBottom = anchorRect.bottom + menuRect.height > vh;
      const overflowsTop = anchorRect.top - menuRect.height < 0;
      if (verticalPosition === 'bottom' && overflowsBottom) {
        newVertical = 'top';
      } else if (verticalPosition === 'top' && overflowsTop) {
        newVertical = 'bottom';
      }
      // Horizontal overflow y breakpoint
      if (anchorRect.left < horizontalBreakpoint) {
        newHorizontal = 'left';
      } else if (anchorRect.right + menuRect.width > vw - horizontalBreakpoint) {
        newHorizontal = 'right';
      }
      setCurrentVertical(newVertical);
      setCurrentHorizontal(newHorizontal);
      let origin = '';
      if (animationOrigin) {
        origin = animationOrigin;
      } else {
        // Horizontal animation breakpoint
        let animHorizontal = newHorizontal;
        if (anchorRect.left < horizontalAnimBreakpoint) {
          animHorizontal = 'left';
        } else if (anchorRect.right + menuRect.width > vw - horizontalAnimBreakpoint) {
          animHorizontal = 'right';
        }
        if (newVertical === 'top' && animHorizontal === 'left') origin = 'bottom left';
        if (newVertical === 'top' && animHorizontal === 'right') origin = 'bottom right';
        if (newVertical === 'bottom' && animHorizontal === 'left') origin = 'top left';
        if (newVertical === 'bottom' && animHorizontal === 'right') origin = 'top right';
      }
      setTransformOrigin(origin);
    }
  }, [open, verticalPosition, horizontalPosition, horizontalBreakpoint, horizontalAnimBreakpoint, animationOrigin]);

  return (
    <div
      className="dropdown"
      ref={containerRef}
      data-position={`${currentVertical}-${currentHorizontal}`}
      id={dropdownId}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            {...ANIM_TYPES.find(anim => anim.name === 'SCALE_TOP')}
            className={`dropdown__menu dropdown__menu--${currentVertical}-${currentHorizontal}`}
            ref={menuRef}
          >
            {menu}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

