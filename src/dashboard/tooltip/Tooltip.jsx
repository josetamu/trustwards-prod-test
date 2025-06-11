import React from 'react';
import './Tooltip.css';
import { useId } from 'react';
export function Tooltip({ 
  message,
  className = '',
  position = 'right',
  type = 'default'
}) {
  const tooltipId = useId();
  return (
    <div 
      className={`tooltip tooltip--${position} tooltip--${type} ${className}`}
      role="tooltip"
      aria-live="polite"
      id={tooltipId}
    >
      <div className="tooltip__mask">{message}</div>
    </div>
  );
} 