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
  horizontalBreakpoint = 300, // px
  horizontalPosition = "left", // "left" / "right"
  animationOrigin, // "top", "bottom", "left", "right" (optional)
}) {
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(`${verticalPosition}-${horizontalPosition}`);
  const [inlineStyle, setInlineStyle] = useState({});
  const [currentAnim, setCurrentAnim] = useState('SCALE_TOP');
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

  // Menu alignment and breakpoints/overflow logic
  useEffect(() => {
    if (open && containerRef.current && menuRef.current) {
      const anchorRect = containerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let newVertical = verticalPosition;
      let newHorizontal = horizontalPosition;
      let newAnim = animationOrigin;
      let style = {};

      // Vertical overflow
      const overflowsBottom = anchorRect.bottom + menuRect.height > vh;
      const overflowsTop = anchorRect.top - menuRect.height < 0;
      if (verticalPosition === 'bottom' && overflowsBottom) {
        newVertical = 'top';
      } else if (verticalPosition === 'top' && overflowsTop) {
        newVertical = 'bottom';
      }

      // Horizontal breakpoint y overflow
      if (anchorRect.left < horizontalBreakpoint) {
        newHorizontal = 'left';
      } else if (anchorRect.right + menuRect.width > vw - horizontalBreakpoint) {
        newHorizontal = 'right';
      }

      // Origin
      if (!animationOrigin) {
        if (newVertical === 'top') {
          newAnim = newHorizontal === 'left' ? 'SCALE_TOP' : 'SCALE_TOP';
        } else {
          newAnim = newHorizontal === 'left' ? 'SCALE_BOTTOM' : 'SCALE_BOTTOM';
        }
        if (newHorizontal === 'left') {
          style.left = 0;
          style.right = 'auto';
        } else {
          style.right = 0;
          style.left = 'auto';
        }
        if (newVertical === 'top') {
          style.bottom = `calc(100% + 4px)`;
          style.top = 'auto';
          style.marginTop = 0;
          style.marginBottom = 4;
        } else {
          style.top = `calc(100% + 4px)`;
          style.bottom = 'auto';
          style.marginTop = 4;
          style.marginBottom = 0;
        }
      }
      setCurrentPosition(`${newVertical}-${newHorizontal}`);
      setCurrentAnim(newAnim);
      setInlineStyle(style);
    }
  }, [open, verticalPosition, horizontalBreakpoint, horizontalPosition, animationOrigin]);

  // Animation selection
  const animObj = ANIM_TYPES.find(anim => anim.name === currentAnim) || ANIM_TYPES[0];

  return (
    <div
      className="dropdown"
      ref={containerRef}
      data-position={currentPosition}
      id={dropdownId}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            {...animObj}
            className={`dropdown__menu dropdown__menu--${currentPosition}`}
            ref={menuRef}
            style={inlineStyle}
          >
            {menu}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

