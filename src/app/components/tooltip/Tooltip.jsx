import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ANIM_TYPES } from '../../dashboard/dashboard_animations';
import './Tooltip.css';
import { useId } from 'react';

// Tooltip: Responsive tooltip component with position adjustment
export function Tooltip({ 
  message,
  className = '',
  responsivePosition,
  open = false,
  width = '100px',
  animationType = 'SCALE_TOP',
}) {
  const tooltipId = useId();
  const tooltipRef = useRef(null);
  const [fixedStyle, setFixedStyle] = useState(null);
  const defaultPosition = responsivePosition ? null : 'right';
  const [finalPosition, setFinalPosition] = useState(defaultPosition || (responsivePosition && responsivePosition.desktop));

  // Handle responsive position adjustment
  useEffect(() => {
    if (!responsivePosition) {
      setFinalPosition('right');
      return;
    }
    const handleResize = () => {
      if (window.innerWidth <= 467) {
        setFinalPosition(responsivePosition.mobile);
      } else {
        setFinalPosition(responsivePosition.desktop);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsivePosition]);

  // Lógica de posicionamiento fixed para sidebar
  useEffect(() => {
    if (open && finalPosition === 'sidebar' && tooltipRef.current) {
      // Busca el padre con la clase .sidebarSites__site
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
          {...ANIM_TYPES.find(anim => anim.name === animationType)}
        >
          <div className="tooltip__mask">
            <span className="tooltip__message">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 