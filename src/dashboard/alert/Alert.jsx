import React from 'react';
import './Alert.css';

export function Alert({ 
  message,
  className = ''
}) {
  return (
    <div 
      className={`alert ${className}`}
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
} 