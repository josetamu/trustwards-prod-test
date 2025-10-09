'use client'

import './home.css';
import './scanner/scanner.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@supabase/supabaseClient.js';
import { HomeInstallation } from './homeComponents/HomeInstallation';
import { HomeInstallationSkeleton } from '@components/Skeletons/HomeInstallationSkeleton';








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
        <div className="home__verify-container">
            <span className="home__verify-heading">Install Trustwards on your site first.
            </span>
            <div className="home__verify-button">
                <span className="home__verify-text" onClick={verify}>Verify</span>
            </div>
        </div>
        )
    }
}


    return (
    
        <div className="home">
            <Suspense fallback={<HomeInstallationSkeleton />}>
                <HomeInstallation siteSlug={siteSlug} showNotification={showNotification} verify={verify} />
            </Suspense>
        </div>
          
    );
}
export default Home;
