import React from 'react';
import './UnderlineHover.css';

const UnderlineHover = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <span 
      className={`tw-underline-hover ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default UnderlineHover;
