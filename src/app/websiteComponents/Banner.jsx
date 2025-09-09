import React from 'react';
import './Banner.css';

const Banner = ({ children, className = '' }) => {
  return (
    <div className={`tw-banner ${className}`}>
      <div className="tw-banner__inner">
        {children}
      </div>
    </div>
  );
};

export default Banner;
