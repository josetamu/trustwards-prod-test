'use client'

import './scanner.css';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import Scan from '@components/scan/Scan.jsx';

function ResultCard() {
    return (
        <div className="scanner__result-card">
            <div className="scanner__result-title">Marketing</div>
            <div className="scanner__result-meta">
                <span>Status 🛈</span>
                <span>2 SCRIPTS</span>
            </div>
            <table className="scanner__result-table">
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Script</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="scanner__result-status--tracked">● Tracked</td>
                        <td>Google Ads</td>
                        <td>https://trustwards.io/cdn/8495-9687-0233-4545.min.js</td>
                    </tr>
                    <tr>
                        <td className="scanner__result-status--untracked">✖ Untracked</td>
                        <td>???</td>
                        <td>https://trustwards.io/cdn/8495-9687-0233-4545.min.js</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const selectedSite = siteSlug || "My Site";

    const [scanCount, setScanCount] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [scanDone, setScanDone] = useState(false);
    const MAX_SCANS = 3;

    const startScan = () => {
        if (isScanning || scanCount >= MAX_SCANS) return;
        setIsScanning(true);
        setScanDone(false);
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
                            <Scan isScanning={isScanning} onlyBar />
                        ) : 'Scan'}
                    </button>
                    <div className="scanner__monthly">
                        <div className='scanner__monthly-wrapper'>
                            <span className="scanner__monthly-label">Monthly Scans</span>
                            <span className="scanner__monthly-count">{scanCount}/{MAX_SCANS}</span>
                        </div>
                        <div className="scanner__progress-bar">
                            <div className="scanner__progress-bar-inner" style={{ width: `${(scanCount === 0 && !isScanning) ? 0 : (scanCount / MAX_SCANS) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            {scanDone ? (
                <ResultCard />
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