import React from 'react';
import './Tooltip.css';

export function Tooltip({ 
  message,
  className = '',
  position = 'right',
  type = 'default'
}) {
  return (
    <div 
      className={`tooltip tooltip--${position} tooltip--${type} ${className}`}
      role="tooltip"
      aria-live="polite"
    >
      <div className="tooltip__mask">{message}</div>
    </div>
  );
} 