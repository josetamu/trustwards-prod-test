'use client'

import './scanner.css';
import { useParams } from 'next/navigation';
import React, { useState, Suspense } from 'react';
import Scan from '@components/scan/Scan.jsx';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';
import { ScanButton } from './ScanButton';
import { MonthlyScans } from './MonthlyScans';
import { MonthlyScansSkeleton } from '@components/Skeletons/MonthlyScansSkeleton';
import { ScanResult } from './ScanResult';
import { ScanResultSkeleton } from '@components/Skeletons/ScanResultSkeleton';






// Manages scan state, triggers scans, and displays results
function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];

    const [scanCount, setScanCount] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [scanDone, setScanDone] = useState(false);
    const MAX_SCANS = 3;

    const [scanSession, setScanSession] = useState(0);




    return (
        <div className="scanner__wrapper">
            <div className='scanner__top-wrapper'>
                <div className="scanner__header">
                    <h2 className='scanner__title'>Scanner</h2>
                    <p className='scanner__paragraph'>In the scanner you can check all the scripts inserting cookies on your website.</p>
                </div>
                <div className='scanner__actions'>
                    <Suspense fallback={<PlanSkeleton />}>
                        <ScanButton isScanning={isScanning} scanCount={scanCount} scanSession={scanSession} MAX_SCANS={MAX_SCANS} setScanDone={setScanDone} setScanCount={setScanCount} setIsScanning={setIsScanning} setScanSession={setScanSession} siteSlug={siteSlug} />
                    </Suspense>
                    <Suspense fallback={<MonthlyScansSkeleton />}>
                        <MonthlyScans siteSlug={siteSlug} MAX_SCANS={MAX_SCANS} />
                    </Suspense>
                </div>
            </div>
            <Suspense fallback={<ScanResultSkeleton />}>
                <ScanResult scanDone={scanDone} isScanning={isScanning} scanSession={scanSession} MAX_SCANS={MAX_SCANS} setScanDone={setScanDone} setScanCount={setScanCount} setIsScanning={setIsScanning} setScanSession={setScanSession} siteSlug={siteSlug} />
            </Suspense>
        </div>
    );
}
export default Home;
