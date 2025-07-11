import React, { useEffect, useState } from 'react';
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
}) {
  const tooltipId = useId();
  const defaultPosition = responsivePosition ? null : 'right';
  const [finalPosition, setFinalPosition] = useState(defaultPosition || (responsivePosition && responsivePosition.desktop));

  // Handle responsive position adjustment
  useEffect(() => {
    if (!responsivePosition) return setFinalPosition('right');
    
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="tooltip"
          className={`tooltip tooltip--${finalPosition} ${className}`}
          role="tooltip"
          aria-live="polite"
          id={tooltipId}
          style={width ? { '--tooltip-width': width } : {}}
          {...ANIM_TYPES.find(anim => anim.name === 'SCALE_TOP')}
        >
          <div className="tooltip__mask">
            <span className="tooltip__message">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 