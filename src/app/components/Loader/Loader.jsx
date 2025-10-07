'use client'

import { useEffect, useState } from 'react';
import './Loader.css';

const Loader = ({ isVisible, loaderCompleted, setLoaderCompleted, isLiveWebsiteLoading }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  // Data not available - Progress bar will go to a random width between 0 and 50% of 250px
  useEffect(() => {
   
    // starts with a random width between 0 and 50
    const initialWidth = Math.floor(Math.random() * 50);
    setProgressWidth(initialWidth);

    // if the live website is loading, the progress bar will advance to a random width between 100 and 150 after 2 seconds
    if(isLiveWebsiteLoading){
    setTimeout(() => {
      const nextWidth = 100 + Math.floor(Math.random() * 50); 
        setProgressWidth(nextWidth);
      }, 2000);
    }
  }, [isLiveWebsiteLoading]);

  // Data available - Fade out animation
  useEffect(() => {
    if (!isVisible) {
      setProgressWidth(250);
      
      setTimeout(() => {
        setIsAnimating(true);

        // Fade completed
        setTimeout(() => {
          setLoaderCompleted(true);
        }, 500); // fade transition lasts 0.5s, then remove loader
      }, 200); // progress bar transition lasts 0.2s, then start fade
    }
  }, [isVisible]);

  if (!isVisible && loaderCompleted) return null; // remove loader when builder call finished and animation is completed

  return (
    <div className={`tw-builder-loader ${isAnimating ? 'tw-builder-loader--fade-out' : ''}`}>
      <div className="tw-builder-loader__content">
        <img className="tw-builder-loader__logo" src="/assets/logo-dark-mode.svg"/>
        <div className="tw-builder-loader__progress">
          <div className="tw-builder-loader__progress-bar" style={{ width: `${progressWidth}px` }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;