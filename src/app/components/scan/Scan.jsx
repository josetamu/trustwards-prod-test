import React, { useEffect, useRef, useState } from 'react';
import './Scan.css';

// shows an animated progress bar for a scanning process
function Scan({ isScanning, onFinish, onlyBar = false }) {
  const [progress, setProgress] = useState(0);
  const PROGRESS_DURATION = 5000; // ms
  const animRef = useRef();

  // Handles the animation for the scan progress
  useEffect(() => {
    if (isScanning) {
      setProgress(0);
      const start = Date.now();
      function animate() {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / PROGRESS_DURATION) * 100, 100);
        setProgress(percent);
        if (percent < 100) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          if (onFinish) onFinish();
        }
      }
      animRef.current = requestAnimationFrame(animate);
    } else {
      setProgress(0);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isScanning, onFinish]);

  if (isScanning && onlyBar) {
    return (
      <div className="scan-bar-background">
        <div className="scan-bar-track">
          <div
            className="scan-bar-fill"
            style={{ transform: `scaleX(${progress / 100})` }}
          ></div>
        </div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="scan__progress-box">
        <div className='scan__progress-text-wrapper'>
          <div className="scan__progress-text">Scanning</div>
          <svg className='scan__progress-icon' width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 4.125V0M5.5 4.125C5.86467 4.125 6.21441 4.26987 6.47227 4.52773C6.73013 4.78559 6.875 5.13533 6.875 5.5M5.5 4.125C5.13533 4.125 4.78559 4.26987 4.52773 4.52773C4.26987 4.78559 4.125 5.13533 4.125 5.5M6.875 5.5H11M6.875 5.5C6.875 5.86467 6.73013 6.21441 6.47227 6.47227C6.21441 6.73013 5.86467 6.875 5.5 6.875M0 5.5H4.125M4.125 5.5C4.125 5.86467 4.26987 6.21441 4.52773 6.47227C4.78559 6.73013 5.13533 6.875 5.5 6.875M5.5 11V6.875M1.60417 3.89583L0.458333 3.4375M9.39583 7.10417L10.5417 7.5625M1.375 1.375L2.52083 2.52083M8.25 8.25L9.39583 9.39583M9.39583 1.375L8.25 2.52083M2.52083 8.25L1.375 9.39583M9.39583 3.89583L10.5417 3.4375M7.10417 1.60417L7.5625 0.458333M7.10417 9.39583L7.5625 10.5417M3.89583 9.39583L3.4375 10.5417M1.60417 7.10417L0.458333 7.5625M3.89583 1.60417L3.4375 0.458333M5.5 9.625C6.0417 9.625 6.5781 9.5183 7.07857 9.311C7.57904 9.1037 8.03377 8.79986 8.41682 8.41682C8.79986 8.03377 9.1037 7.57904 9.311 7.07857C9.5183 6.5781 9.625 6.0417 9.625 5.5C9.625 4.9583 9.5183 4.4219 9.311 3.92143C9.1037 3.42096 8.79986 2.96623 8.41682 2.58318C8.03377 2.20014 7.57904 1.8963 7.07857 1.689C6.5781 1.4817 6.0417 1.375 5.5 1.375C4.40598 1.375 3.35677 1.8096 2.58318 2.58318C1.8096 3.35677 1.375 4.40598 1.375 5.5C1.375 6.59402 1.8096 7.64323 2.58318 8.41682C3.35677 9.1904 4.40598 9.625 5.5 9.625Z" stroke="currentColor"/>
          </svg>
        </div>
        <div className="scan__progress-bar">
          <div className="scan__progress-bar-background"></div>
          <div className="scan__progress-bar-inner">
            <div
              className="scan__progress-bar-fill"
              style={{ transform: `scaleX(${progress / 100})` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default Scan;
