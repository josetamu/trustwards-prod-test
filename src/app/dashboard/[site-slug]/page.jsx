'use client'

import './home.css';
import './scanner/scanner.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '../layout';
import { useState, useEffect, Suspense } from 'react';
import ScriptCopy from '../../components/ScriptCopy/ScriptCopy';
import { ScanButton } from './scanner/ScanButton';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';
import Link from 'next/link';
import Scan from '@components/scan/Scan.jsx';
import { supabase } from '../../../supabase/supabaseClient.js';
import { HomeInstallation } from './homeComponents/HomeInstallation';
import { HomeInstallationSkeleton } from '@components/Skeletons/HomeInstallationSkeleton';
import { ScannerOverviewSkeleton } from '@components/Skeletons/ScannerOverviewSkeleton';
import { ScannerOverview } from './homeComponents/ScannerOverview';
import { SiteUsageSkeleton } from '@components/Skeletons/SiteUsageSkeleton';
import { SiteUsage } from './homeComponents/SiteUsage';
import { ComplyHealthSkeleton } from '@components/Skeletons/ComplyHealthSkeleton';
import { ComplyHealth } from './homeComponents/ComplyHealth';
import { AnalyticsSkeleton } from '@components/Skeletons/AnalyticsSkeleton';
import { Analytics } from './homeComponents/Analytics';








//Home page
function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs, showNotification, setModalType, setIsModalOpen,setWebs,allUserDataResource } = useDashboard();
    const [siteData, setSiteData] = useState(null);
    const [isInstalled, setIsInstalled] = useState(null);

    const [isScanning, setIsScanning] = useState(false);
    const [scanSession, setScanSession] = useState(0);
    const [isContentVisible, setIsContentVisible] = useState(true);
    const MAX_SCANS = 3;
    const [scanCount, setScanCount] = useState(0);

    //update site data when the selected site changes
    useEffect(() => {
            if(!webs || webs.length === 0) return;
      
            const selectedSite = webs.find(site => site.id === siteSlug);
            if(selectedSite){
                setSiteData(selectedSite);
                setIsInstalled(selectedSite.Verified);
            }

    }, [webs, siteSlug]);

 // scan functions
    // start the scan
    const startScan = () => {
        if (isScanning) return;
        setIsContentVisible(false);
        setIsScanning(true);
        setScanSession(prev => prev + 1);
    };
    // finish the scan
    const handleScanFinish = () => {
        setIsScanning(false);
        // Trigger fade-in animation after a short delay
        setTimeout(() => {
            setIsContentVisible(true);
        }, 100);
    }; 



    const verify = async () => {
        try {
            // 1. Actualizar en la base de datos
            const { data, error } = await supabase
                .from('Site')
                .update({ Verified: true })
                .eq('id', siteSlug)
                .select()
                .single();

            if (error) {
                console.error('Error updating site verification:', error);
                if (showNotification) {
                    showNotification('Failed to verify site. Please try again.', 'top', false);
                }
                return;
            }

            // 2. Actualizar el estado local
            const updatedSite = { ...siteData, Verified: true };
            setSiteData(updatedSite);
            setIsInstalled(true);

            // 3. Actualizar el estado global webs
            setWebs(prevWebs =>
                prevWebs.map(site =>
                    site.id === siteSlug ? { ...site, Verified: true } : site
                )
            );

            // 4. Actualizar el resource para mantener consistencia
            if (allUserDataResource) {
                const currentData = allUserDataResource.read();
                currentData.webs = currentData.webs.map(web =>
                    web.id === siteSlug ? { ...web, Verified: true } : web
                );
            }

            // 5. Mostrar notificación de éxito
            if (showNotification) {
                showNotification('Site verified successfully!', 'top', true);
            }

        } catch (error) {
            console.error('Error verifying site:', error);
            if (showNotification) {
                showNotification('Failed to verify site. Please try again.', 'top', false);
            }
        }
    };

//function to show the no installed message on cards
const noInstalled = () => {
    if(!isInstalled){
        return (
        <div className="home__noInstalled">
            <span className="home__noInstalled-text">Install Trustwards on your site first.
            </span>
            <div className="home__verify">
                <span className="home__verify-text" onClick={verify}>Verify</span>
            </div>
        </div>
        )
    }
}




//variables for the comply health









    return (
    
          <div className="home">
                <Suspense fallback={<HomeInstallationSkeleton />}>
                    <HomeInstallation siteSlug={siteSlug} showNotification={showNotification} verify={verify} />
                </Suspense>
                <div className="home__mid">
                    <div className="home__midCard"></div>
                    <Suspense fallback={<ScannerOverviewSkeleton />}>
                        <ScannerOverview siteSlug={siteSlug} showNotification={showNotification} verify={verify} noInstalled={noInstalled} isScanning={isScanning} scanCount={scanCount} scanSession={scanSession} MAX_SCANS={MAX_SCANS} startScan={startScan} handleScanFinish={handleScanFinish} isContentVisible={isContentVisible} />
                    </Suspense>
                </div>
                <div className="home__bottom">
                    <Suspense fallback={<SiteUsageSkeleton />}>
                        <SiteUsage siteSlug={siteSlug}  setModalType={setModalType} setIsModalOpen={setIsModalOpen} noInstalled={noInstalled} />
                    </Suspense>
                    <Suspense fallback={<AnalyticsSkeleton />}>
                        <Analytics siteSlug={siteSlug} noInstalled={noInstalled} />
                    </Suspense>
                    <Suspense fallback={<ComplyHealthSkeleton />}>
                        <ComplyHealth siteSlug={siteSlug} noInstalled={noInstalled} />
                    </Suspense>
                </div>
          </div>
          
        
    );
}
export default Home;
