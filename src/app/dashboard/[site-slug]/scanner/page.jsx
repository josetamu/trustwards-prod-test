'use client'

import './scanner.css';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import Scan from '@components/scan/Scan.jsx';

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
  return (
    <>
      {results.map((cat) => (
        <div className="scanner__card" key={cat.category}>
            <div className='scanner__card-wrapper'>
                <div className="scanner__card-scripts-count">
                    {cat.groups.reduce((acc, group) => acc + group.length, 0)} SCRIPTS
                </div>
                <div className="scanner__card-title">{cat.category}</div>
                <div className="scanner__card-table">
                    <div className="scanner__card-table-header">
                    <span className="scanner__card-table-title">Status
                        <span className="scanner__card-info">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.5" y="0.5" width="9" height="9" rx="1.5" stroke="#5E5E5E"/>
                                <path d="M4.2983 7V3.72727H5.47443V7H4.2983ZM4.88636 3.38636C4.72727 3.38636 4.59091 3.33381 4.47727 3.22869C4.36364 3.12358 4.30682 2.99716 4.30682 2.84943C4.30682 2.7017 4.36364 2.57528 4.47727 2.47017C4.59091 2.36506 4.72727 2.3125 4.88636 2.3125C5.04688 2.3125 5.18324 2.36506 5.29545 2.47017C5.40909 2.57528 5.46591 2.7017 5.46591 2.84943C5.46591 2.99716 5.40909 3.12358 5.29545 3.22869C5.18324 3.33381 5.04688 3.38636 4.88636 3.38636Z" fill="#5E5E5E"/>
                            </svg>
                        </span>
                    </span>
                    <span className="scanner__card-table-title">Name</span>
                    <span className="scanner__card-table-title">Script</span>
                    </div>
                    <div className="scanner__card-divider" />
                    {cat.groups.map((group, gIdx) =>
                    group.map((script, sIdx) => (
                        <div className="scanner__card-table-content" key={gIdx + '-' + sIdx}>
                        <span
                            className={`scanner__card-table-script ${script.status === 'tracked'
                            ? 'scanner__card-status--tracked'
                            : 'scanner__card-status--untracked'
                            }`}
                        >
                            {script.status === 'tracked' ? '● Tracked' : '✖ Untracked'}
                        </span>
                        <span className='scanner__card-table-script'>{script.name}</span>
                        <span className='scanner__card-table-script'>{script.script}</span>
                        </div>
                    ))
                    )}
                </div>
            </div>
        </div>
      ))}
    </>
  );
}

// Manages scan state, triggers scans, and displays results or scan UI.
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
                    <button className="scanner__scan" onClick={startScan} disabled={isScanning || scanCount >= MAX_SCANS}>
                        {isScanning ? (
                            <Scan isScanning={isScanning} onlyBar key={scanSession} />
                        ) : 'Scan'}
                    </button>
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
                <ResultCardArray results={scanResults} />
            ) : (
                <div className="scanner__main-box">
                    <div className="scanner__main-box-content">
                        {isScanning ? (
                            <Scan isScanning={isScanning} onFinish={handleScanFinish} />
                        ) : (
                            <>
                                <div className="scanner__main-box-text">Scan your website for the first time<br/>to see all the scripts inserting cookies</div>
                                <button className="scanner__scan" onClick={startScan} disabled={isScanning || scanCount >= MAX_SCANS}>Scan</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;