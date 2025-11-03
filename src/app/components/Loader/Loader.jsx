'use client'

import { useEffect, useState } from 'react';
import './Loader.css';

const Loader = ({ isVisible, loaderCompleted, setLoaderCompleted, isLiveWebsiteLoading, isHugeIconsLoading }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [hugeIconsCompleted, setHugeIconsCompleted] = useState(false);
  const [websiteCompleted, setWebsiteCompleted] = useState(false);

  // Initial load - Stage 1: 0-30% (loader has mounted)
  useEffect(() => {
    const initialWidth = 15 + Math.floor(Math.random() * 15); // 15-30%
    setProgressWidth(initialWidth);
  }, []);

  // Stage 2: 30-60% when HugeIcons finish loading
  useEffect(() => {
    if (!isHugeIconsLoading && !hugeIconsCompleted) {
      setHugeIconsCompleted(true);
      setTimeout(() => {
        const nextWidth = 45 + Math.floor(Math.random() * 15); // 45-60%
        setProgressWidth(nextWidth);
      }, 100);
    }
  }, [isHugeIconsLoading, hugeIconsCompleted]);

  // Stage 3: 60-85% when live website finishes loading (if applicable)
  useEffect(() => {
    if (!isLiveWebsiteLoading && !websiteCompleted && hugeIconsCompleted) {
      setWebsiteCompleted(true);
      setTimeout(() => {
        const nextWidth = 70 + Math.floor(Math.random() * 15); // 70-85%
        setProgressWidth(nextWidth);
      }, 100);
    }
  }, [isLiveWebsiteLoading, websiteCompleted, hugeIconsCompleted]);

  // Fallback: If website loading is not needed, advance to stage 3 after HugeIcons
  useEffect(() => {
    if (hugeIconsCompleted && isLiveWebsiteLoading === undefined) {
      setTimeout(() => {
        const nextWidth = 70 + Math.floor(Math.random() * 15); // 70-85%
        setProgressWidth(nextWidth);
      }, 300);
    }
  }, [hugeIconsCompleted, isLiveWebsiteLoading]);

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
      }, 600); // progress bar transition lasts 0.6s, then start fade
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