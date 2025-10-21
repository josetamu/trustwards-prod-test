import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimTypes } from '@animations/animations';
import './Tooltip.css';
import { useId } from 'react';

// Tooltip: Responsive tooltip component with position adjustment
export function Tooltip({ 
  message,
  className = '',
  responsivePosition,
  open = false,
  width,
  animationType = 'SCALE_TOOLTIP_TOP',
  responsiveAnimation,
}) {
  const tooltipId = useId();
  const tooltipRef = useRef(null);
  const [fixedStyle, setFixedStyle] = useState(null);
  const defaultPosition = responsivePosition ? null : 'right';
  const [finalPosition, setFinalPosition] = useState(defaultPosition || (responsivePosition && responsivePosition.desktop));
  const [finalAnimation, setFinalAnimation] = useState(animationType);

  // Handle responsive position and animation adjustment
  useEffect(() => {
    if (!responsivePosition) {
      setFinalPosition('right');
      setFinalAnimation(animationType);
      return;
    }
    const handleResize = () => {
      if (window.innerWidth <= 467) {
        setFinalPosition(responsivePosition.mobile);
        setFinalAnimation(responsiveAnimation?.mobile || animationType);
      } else if (window.innerWidth <= 1100) {
        setFinalPosition(responsivePosition.tablet || responsivePosition.mobile);
        setFinalAnimation(responsiveAnimation?.tablet || responsiveAnimation?.mobile || animationType);
      } else {
        setFinalPosition(responsivePosition.desktop);
        setFinalAnimation(responsiveAnimation?.desktop || animationType);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsivePosition, responsiveAnimation, animationType]);

  // Positioning logic for sidebar
  /*
  useEffect(() => {
    if (open && finalPosition === 'sidebar' && tooltipRef.current) {
      // Find the parent with the class .sidebarSites__site
      let parent = tooltipRef.current.closest('.sidebarSites__site');
      let rect;
      if (parent) {
        rect = parent.getBoundingClientRect();
      } else {
        rect = tooltipRef.current.getBoundingClientRect();
      }
      if (window.innerWidth < 767) {
        setFixedStyle({
          position: 'fixed',
          top: rect.top + 4,
        });
      } else {
        setFixedStyle({
          position: 'fixed',
          top: rect.top + 4,
          left: 50,
        });
      }
    } else {
      setFixedStyle(null);
    }
  }, [open, finalPosition]);
  */

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="tooltip"
          className={`tooltip tooltip--${finalPosition} ${className}`}
          role="tooltip"
          aria-live="polite"
          id={tooltipId}
          ref={tooltipRef}
          style={finalPosition === 'sidebar' && fixedStyle ? { ...fixedStyle, ...(width ? { '--tooltip-width': width } : {}) } : (width ? { '--tooltip-width': width } : {})}
          {...getAnimTypes().find(anim => anim.name === finalAnimation)}
        >
          <div className="tooltip__mask">
            <span className="tooltip__message">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 