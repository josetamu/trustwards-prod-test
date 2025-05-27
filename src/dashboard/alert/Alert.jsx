import React from 'react';
import './Alert.css';

export function Alert({ 
  message,
  className = '',
  position
}) {
  return (
    <div 
      className={`alert alert--${position} ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
} 