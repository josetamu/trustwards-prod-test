import React, { useEffect, useState } from 'react';
import './Tooltip.css';

export function Tooltip({ 
  message,
  className = '',
  responsivePosition
}) {
  const defaultPosition = responsivePosition ? null : 'right';
  const [finalPosition, setFinalPosition] = useState(defaultPosition || (responsivePosition && responsivePosition.desktop));

  // Position adjustment
  useEffect(() => {
    if (!responsivePosition) return setFinalPosition('right');
    function handleResize() {
      if (window.innerWidth <= 467) {
        setFinalPosition(responsivePosition.mobile);
      } else {
        setFinalPosition(responsivePosition.desktop);
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [responsivePosition]);

  return (
    <div 
      className={`tooltip tooltip--${finalPosition} ${className}`}
      role="tooltip"
      aria-live="polite"
    >
      <div className="tooltip__mask">{message}</div>
    </div>
  );
} 