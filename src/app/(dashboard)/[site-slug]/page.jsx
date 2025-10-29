'use client'

import './home.css';
import './scanner/scanner.css';
import { useParams, notFound, useRouter } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@supabase/supabaseClient.js';
import { InstallationFirst } from './homeComponents/InstallationFirst';
import { HomeInstallationSkeleton } from '@components/Skeletons/HomeInstallationSkeleton';
import ScriptCopy from '@components/ScriptCopy/ScriptCopy';

//Home page
function Home() {
    const params = useParams();
    const router = useRouter();
    const siteSlug = params['site-slug'];
    const { webs, showNotification, setModalType, setIsModalOpen,setWebs,allUserDataResource, isInstalled, setIsInstalled } = useDashboard();
    const [siteData, setSiteData] = useState(null);
    
    // State for image loading
    const [imageLoaded, setImageLoaded] = useState(false);
    
    // State for preview hover
    const [isPreviewHovered, setIsPreviewHovered] = useState(false);
    const [isButtonAnimating, setIsButtonAnimating] = useState(false);
    



    
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

    // Preview functions
    const getCanvasPreviewUrl = () => {
        const userId = siteData?.userid || 'anonymous';
        const filePath = `${userId}/${siteData?.id}.png`;
        const { data: { publicUrl } } = supabase.storage
            .from('Canvas capture')
            .getPublicUrl(filePath);
        return publicUrl;
    };

    const hasCanvasCapture = () => getCanvasPreviewUrl() && imageLoaded;
    const getCanvasColor = () => siteData?.JSON?.canvasColor || 'var(--site-background)';

    // Handle navigation to builder
    const handleBuilderClick = () => {
        router.push(`/builder/${siteSlug}`);
    };

    // Handle mouse enter
    const handleMouseEnter = () => {
        setIsPreviewHovered(true);
        setIsButtonAnimating(false);
    };

    // Handle mouse leave
    const handleMouseLeave = () => {
        setIsButtonAnimating(true);
        setIsPreviewHovered(false);
        setTimeout(() => setIsButtonAnimating(false), 300);
    };

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
                    
                    {/* Preview Box */}
                    <div className="home__preview-container">
                        <div 
                            className={`home__preview ${imageLoaded ? 'home__preview--loaded' : ''} ${hasCanvasCapture() ? 'home__preview--with-capture' : ''} ${isPreviewHovered ? 'home__preview--hovered' : ''}`}
                            style={{
                                backgroundColor: hasCanvasCapture() ? 'transparent' : getCanvasColor(),
                                backgroundImage: hasCanvasCapture() ? `url(${getCanvasPreviewUrl()})` : 'none'
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            {getCanvasPreviewUrl() && (
                                <img 
                                    src={getCanvasPreviewUrl()}
                                    alt=""
                                    className="home__preview-image"
                                    style={{ display: imageLoaded ? 'block' : 'none' }}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => setImageLoaded(false)}
                                />
                            )}
                            
                            {/* Builder Button - appears on hover and is always accessible */}
                            <button 
                                className={`dashboard-header__builder ${isPreviewHovered || isButtonAnimating ? '' : 'home__preview-button--hidden'} ${isButtonAnimating ? 'home__preview-button--exiting' : ''}`}
                                onClick={handleBuilderClick}
                                onFocus={() => setIsPreviewHovered(true)}
                                onBlur={() => setIsPreviewHovered(false)}
                                aria-label="Open Builder to edit your website"
                            >
                                <span className="dashboard-header__builder-text">Builder</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
          
    );
}
export default Home;
