'use client'

import './scanner.css';
import { useParams } from 'next/navigation';
import React, { useState, Suspense } from 'react';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';
import { ScanButton } from './ScanButton';
import { MonthlyScans } from './MonthlyScans';
import { MonthlyScansSkeleton } from '@components/Skeletons/MonthlyScansSkeleton';
import { ScanResult } from './ScanResult';
import { ScanResultSkeleton } from '@components/Skeletons/ScanResultSkeleton';
import { useDashboard } from '../../layout';
import { supabase } from '../../../../supabase/supabaseClient';

// Manages scan state, triggers scans, and displays results
function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const {isScanning, setIsScanning, scanDone, setScanDone, MAX_SCANS, isInstalled, setIsInstalled, siteData, setSiteData, showNotification, setWebs, allUserDataResource} = useDashboard();




    return (
        <div className="scanner__wrapper">
            <div className='scanner__top-wrapper'>
                <div className="scanner__header">
                    <h2 className='scanner__title'>Scanner</h2>
                    <p className='scanner__paragraph'>In the scanner you can check all the scripts inserting cookies on your website.</p>
                </div>
                <div className='scanner__actions'>
                    <Suspense fallback={<PlanSkeleton />}>
                        <ScanButton isScanning={isScanning}  MAX_SCANS={MAX_SCANS} setScanDone={setScanDone} setIsScanning={setIsScanning} siteSlug={siteSlug}/>
                    </Suspense>
                    <Suspense fallback={<MonthlyScansSkeleton />}>
                        <MonthlyScans siteSlug={siteSlug} MAX_SCANS={MAX_SCANS} />
                    </Suspense>
                </div>
            </div>
            <Suspense fallback={<ScanResultSkeleton />}>
                <ScanResult scanDone={scanDone} isScanning={isScanning} MAX_SCANS={MAX_SCANS} setScanDone={setScanDone} setIsScanning={setIsScanning} siteSlug={siteSlug} />
            </Suspense>
        </div>
    );
}
export default Home;
