'use client'

import './scanner.css';
import { useParams } from 'next/navigation';
import React, { useState, Suspense } from 'react';
import Scan from '@components/scan/Scan.jsx';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';
import { ScanButton } from './ScanButton';




// tridimensional array with default scan results grouped by category
const defaultScanResults = [
  {
    category: 'Marketing',
    groups: [
      [
        { status: 'tracked', name: 'Google Ads', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
        { status: 'untracked', name: '???', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
      ],
    ],
  },
  {
    category: 'Functional',
    groups: [
      [
        { status: 'tracked', name: 'Trustwards', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
        { status: 'untracked', name: '???', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
      ],
    ],
  },
  {
    category: 'Required',
    groups: [
      [
        { status: 'tracked', name: 'Google Analytics', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
        { status: 'untracked', name: '???', script: 'https://trustwards.io/cdn/8495-9687-0233-4545.min.js' },
      ],
    ],
  },
  
];

// renders scan results grouped by category
function ResultCardArray({ results }) {
  const [isVisible, setIsVisible] = React.useState(false);

  // Trigger fade-in animation when component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`scanner__results-container ${isVisible ? 'scanner__results-container--visible' : ''}`}>
      {results.map((cat, idx) => (
        <div className="scanner__card" key={cat.category}>
            <div className='scanner__card-wrapper'>
                <div className="scanner__card-scripts-count">
                    {cat.groups.reduce((acc, group) => acc + group.length, 0)} SCRIPTS
                </div>
                <div className="scanner__card-title">{cat.category}</div>
                <div className="scanner__card-table-responsive">
                  <table className="scanner__card-table">
                    <thead>
                      <tr>
                        <th className="scanner__card-table-title">Status</th>
                        <th className="scanner__card-table-title">Name</th>
                        <th className="scanner__card-table-title">Script</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3}>
                          <div className="scanner__card-divider"></div>
                        </td>
                      </tr>
                      {cat.groups.map((group, gIdx) =>
                        group.map((script, sIdx) => (
                          <tr key={gIdx + '-' + sIdx}>
                            <td>
                              <span
                                className={`scanner__card-table-script ${script.status === 'tracked'
                                  ? 'scanner__card-status--tracked'
                                  : 'scanner__card-status--untracked'
                                  }`}
                              >
                                {script.status === 'tracked' ? '● Tracked' : '✖ Untracked'}
                              </span>
                            </td>
                            <td>
                              <span className='scanner__card-table-script'>{script.name}</span>
                            </td>
                            <td>
                              <span className='scanner__card-table-script'>{script.script}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
}

// Manages scan state, triggers scans, and displays results
function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];

    const [scanCount, setScanCount] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [scanDone, setScanDone] = useState(false);
    const MAX_SCANS = 3;
    const [scanResults, setScanResults] = useState(defaultScanResults);
    const [scanSession, setScanSession] = useState(0);

    const startScan = () => {
        if (isScanning || scanCount >= MAX_SCANS) return;
        setScanDone(false);
        setIsScanning(true);
        setScanSession(prev => prev + 1);
    };

    const handleScanFinish = () => {
        setIsScanning(false);
        setScanDone(true);
        setScanCount((prev) => Math.min(prev + 1, MAX_SCANS));
    };

    return (
        <div className="scanner__wrapper">
            <div className='scanner__top-wrapper'>
                <div className="scanner__header">
                    <h2 className='scanner__title'>Scanner</h2>
                    <p className='scanner__paragraph'>In the scanner you can check all the scripts inserting cookies on your website.</p>
                </div>
                <div className='scanner__actions'>
                    <Suspense fallback={<PlanSkeleton />}>
                        <ScanButton isScanning={isScanning} scanCount={scanCount} startScan={startScan} scanSession={scanSession} MAX_SCANS={MAX_SCANS} />
                    </Suspense>
                    <div className="scanner__monthly">
                        <div className='scanner__monthly-wrapper'>
                            <span className="scanner__monthly-label">Monthly Scans</span>
                            <span className="scanner__monthly-count">{scanCount}/{MAX_SCANS}</span>
                        </div>
                        <div className="scanner__progress-bar">
                            <div className="scanner__progress-bar-background"></div>
                            <div className="scanner__progress-bar-inner">
                                <div
                                    className="scanner__progress-bar-fill"
                                    style={{ transform: `scaleX(${(scanCount / MAX_SCANS)})` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {scanDone ? (
                <>
                    <div className="scanner__card-divider"></div>
                    <ResultCardArray results={scanResults} />
                </>
            ) : (
                <div className="scanner__main-box">
                    <div className="scanner__main-box-content">
                        {isScanning ? (
                            <Scan isScanning={isScanning} onFinish={handleScanFinish} />
                        ) : (
                            <>
                                <div className="scanner__main-box-text">Scan your website for the first time<br/>to see all the scripts inserting cookies</div>
                                <Suspense fallback={<PlanSkeleton />}>
                                    <ScanButton isScanning={isScanning} scanCount={scanCount} startScan={startScan} scanSession={scanSession} MAX_SCANS={MAX_SCANS} />
                                </Suspense>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
export default Home;
