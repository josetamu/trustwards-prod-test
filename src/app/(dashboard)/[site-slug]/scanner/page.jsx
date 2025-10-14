'use client'

import './scanner.css';
import { useParams } from 'next/navigation';
import React, { useState, Suspense, useEffect } from 'react';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';
import { ScanButton } from './ScanButton';
import { MonthlyScans } from './MonthlyScans';
import { MonthlyScansSkeleton } from '@components/Skeletons/MonthlyScansSkeleton';
import { ScanResult } from './ScanResult';
import { ScanResultSkeleton } from '@components/Skeletons/ScanResultSkeleton';
import { useDashboard } from '@dashboard/layout';
import { supabase } from '@supabase/supabaseClient';
import { InstallationFirst } from '../homeComponents/InstallationFirst';

// Manages scan state, triggers scans, and displays results
function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const [scanCount, setScanCount] = useState(0);
    const {isScanning, setIsScanning, scanDone, setScanDone, MAX_SCANS, isInstalled, setIsInstalled, siteData, setSiteData, showNotification, setWebs, allUserDataResource, webs} = useDashboard();

    useEffect(() => {
        async function getScanCount() {
            const { data: currentSite } = await supabase.from('Site').select('Scans').eq('id', siteSlug).single();
            setScanCount(currentSite?.Scans || 0);
        }
        getScanCount();
    }, [siteSlug]);

    // Find the selected site based on the slug
    const selectedSite = webs.find(site => site.id === siteSlug);

    //If no webs yet, show skeletons
    //If not installed, show installation screen
    //If installed, show Scanner
    return (
        <div className="scanner">
            {(!webs || webs.length === 0) ? (
                <>
                    <div className='scanner__top-wrapper'>
                        <div className="scanner__header">
                            <h2 className='scanner__title'>Scanner</h2>
                            <p className='scanner__paragraph'>In the scanner you can check all the scripts inserting cookies on your website.</p>
                        </div>
                        <div className='scanner__actions'>
                            <PlanSkeleton />
                            <MonthlyScansSkeleton />
                        </div>
                    </div>
                    <ScanResultSkeleton />
                </>
            ) : !selectedSite?.Verified ? (
                <InstallationFirst siteSlug={siteSlug} />
            ) : (
                <>
                    <div className='scanner__top-wrapper'>
                        <div className="scanner__header">
                            <h2 className='scanner__title'>Scanner</h2>
                            <p className='scanner__paragraph'>In the scanner you can check all the scripts inserting cookies on your website.</p>
                        </div>
                        <div className='scanner__actions'>
                            <ScanButton isScanning={isScanning}  MAX_SCANS={MAX_SCANS} setScanDone={setScanDone} setIsScanning={setIsScanning} siteSlug={siteSlug}/>
                            <MonthlyScans scanCount={scanCount} MAX_SCANS={MAX_SCANS} />
                        </div>
                    </div>
                    <ScanResult scanDone={scanDone} isScanning={isScanning} MAX_SCANS={MAX_SCANS} setScanDone={setScanDone} setIsScanning={setIsScanning} siteSlug={siteSlug} scanCount={scanCount} setScanCount={setScanCount} />
                </>
            )}
        </div>
    );
}
export default Home;
