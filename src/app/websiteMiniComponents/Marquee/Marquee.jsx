import React, { useEffect, useRef } from 'react';
import Reeller from 'reeller';
import gsap from 'gsap';
import './Marquee.css';

// Register GSAP with Reeller
Reeller.registerGSAP(gsap);

const Marquee = ({ 
  children, 
  speed = 10, 
  reverse = false, 
  pauseOnHover = true,
  className = '',
  itemClassName = 'tw-marquee__item',
  ...props 
}) => {
  const marqueeRef = useRef(null);
  const reellerInstance = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Clean up previous instance
    if (reellerInstance.current) {
      reellerInstance.current.destroy();
    }

    // Initialize Reeller
    reellerInstance.current = new Reeller({
      container: marquee,
      wrapper: '.tw-marquee__wrapper',
      itemSelector: `.${itemClassName}`,
      speed: speed,
      reversed: reverse,
      paused: false, // Start playing immediately
      loop: true,
      autoStop: false, // Don't stop when out of view
      autoUpdate: true,
      clonesOverflow: true,
      clonesMin: 1,
    });

    // Pause on hover
    if (pauseOnHover) {
      const pauseAnimation = () => {
        if (reellerInstance.current) {
          reellerInstance.current.pause();
        }
      };
      
      const resumeAnimation = () => {
        if (reellerInstance.current) {
          reellerInstance.current.resume();
        }
      };
      
      marquee.addEventListener('mouseenter', pauseAnimation);
      marquee.addEventListener('mouseleave', resumeAnimation);
      
      // Cleanup event listeners
      return () => {
        marquee.removeEventListener('mouseenter', pauseAnimation);
        marquee.removeEventListener('mouseleave', resumeAnimation);
      };
    }
    
    // Cleanup on unmount
    return () => {
      if (reellerInstance.current) {
        reellerInstance.current.destroy();
      }
    };
  }, [speed, reverse, pauseOnHover, itemClassName]);

  return (
    <div 
      ref={marqueeRef}
      className={`tw-marquee ${className}`}
      data-speed-duration={speed}
      data-defaultreverse={reverse}
      data-pauseonhover={pauseOnHover}
      {...props}
    >
      <div className="tw-marquee__wrapper">
        <div className="tw-marquee__nestable"></div>
        {children}
      </div>
    </div>
  );
};

export default Marquee;