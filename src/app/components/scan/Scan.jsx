import React, { useEffect, useRef, useState } from 'react';
import './Scan.css';

function Scan({ isScanning, onFinish, onlyBar = false }) {
  const [progress, setProgress] = useState(0);
  const PROGRESS_DURATION = 5000; // ms
  const animRef = useRef();

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
      <div className="scan__progress-bar">
        <div className="scan__progress-bar-inner" style={{ width: `${progress}%` }}></div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <div className="scan__progress-box">
        <div className="scan__progress-text">Scanning <span role="img" aria-label="loading">⏳</span></div>
        <div className="scan__progress-bar">
          <div className="scan__progress-bar-inner" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    );
  }
  return null;
}

export default Scan;
