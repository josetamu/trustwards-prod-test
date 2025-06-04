import React, { useEffect, useRef, useState } from 'react';
import './Alert.css';

export function Alert({ 
  message,
  className = '',
  position = 'right',
  containerRef = null
}) {
  const alertRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(position);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setCurrentPosition(position);
    setIsVisible(false);

    const timeoutId = setTimeout(() => {
      if (alertRef.current) {
        const alertRect = alertRef.current.getBoundingClientRect();
        
        // Determine bounds: container if provided, otherwise viewport
        let bounds;
        if (containerRef?.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          bounds = {
            top: containerRect.top,
            left: containerRect.left,
            right: containerRect.right,
            bottom: containerRect.bottom,
            width: containerRect.width,
            height: containerRect.height
          };
        } else {
          bounds = {
            top: 0,
            left: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
            width: window.innerWidth,
            height: window.innerHeight
          };
        }

        let newPos = position;
        const margin = 8;
        const tolerance = 1;

        if (position === 'right') {
          const requiredRightSpace = bounds.width + margin + alertRect.width;
          const availableRightSpace = window.innerWidth - bounds.left;

          if (requiredRightSpace > availableRightSpace - tolerance) {
            if (alertRect.left - alertRect.width - margin >= bounds.left) {
              newPos = 'left';
            } else {
              if (alertRect.top - alertRect.height - margin >= bounds.top) {
                newPos = 'top';
              } else {
                newPos = 'bottom';
              }
            }
          }
        } else if (position === 'left') {
          if (alertRect.left < bounds.left - margin - tolerance) {
            if (alertRect.right + alertRect.width + margin <= bounds.right) {
              newPos = 'right';
            } else {
              if (alertRect.top - alertRect.height - margin >= bounds.top) {
                newPos = 'top';
              } else {
                newPos = 'bottom';
              }
            }
          }
        } else if (position === 'top') {
          if (alertRect.top < bounds.top - margin - tolerance) {
            if (alertRect.bottom + alertRect.height + margin <= bounds.bottom) {
              newPos = 'bottom';
            } else {
              if (alertRect.left - alertRect.width - margin >= bounds.left) {
                newPos = 'left';
              } else {
                newPos = 'right';
              }
            }
          }
        } else if (position === 'bottom') {
          if (alertRect.bottom > bounds.bottom + margin + tolerance) {
            if (alertRect.top - alertRect.height - margin >= bounds.top) {
              newPos = 'top';
            } else {
              if (alertRect.left - alertRect.width - margin >= bounds.left) {
                newPos = 'left';
              } else {
                newPos = 'right';
              }
            }
          }
        }

        if (newPos !== currentPosition) {
          setCurrentPosition(newPos);
        }
        
        setIsVisible(true);
      } else {
        setIsVisible(true);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [position, containerRef, message]);

  return (
    <div 
      ref={alertRef}
      className={`alert alert--${currentPosition} ${className}`}
      role="alert"
      aria-live="polite"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      {message}
    </div>
  );
} 