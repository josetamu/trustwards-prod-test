'use client'

import './home.css';
import './scanner/scanner.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@supabase/supabaseClient.js';
import { InstallationFirst } from './homeComponents/InstallationFirst';
import { HomeInstallationSkeleton } from '@components/Skeletons/HomeInstallationSkeleton';
import ScriptCopy from '@components/ScriptCopy/ScriptCopy';








//Home page
function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs, showNotification, setModalType, setIsModalOpen,setWebs,allUserDataResource, isInstalled, setIsInstalled } = useDashboard();
    const [siteData, setSiteData] = useState(null);
    



    
    //update site data when the selected site changes
    useEffect(() => {
            if(!webs || webs.length === 0) return;
            const selectedSite = webs.find(site => site.id === siteSlug);
      
            if(selectedSite){
                setSiteData(selectedSite);
                setIsInstalled(selectedSite.Verified);
            }else{
                notFound();
            }

    }, [webs, siteSlug]);

    //If no site data yet, show skeleton
    //If not installed, show installation screen
    //If installed, show Home
    return (
    
        <div className="home">
            { !siteData ? (
                <HomeInstallationSkeleton />
            ) : !isInstalled ? (
                <InstallationFirst siteSlug={siteSlug} />
            ) : (
                <div className='home__installation-container home__installation-container--installed'>
                    <ScriptCopy showNotification={showNotification}/>
                </div>
            )}
        </div>
          
    );
}
export default Home;
