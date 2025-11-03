'use client'

import './home.css';
import './scanner/scanner.css';
import { useParams, notFound, useRouter } from 'next/navigation';
import { useDashboard } from '@dashboard/DashboardContext';
import { useState, useMemo, Suspense } from 'react';
import { supabase } from '@supabase/supabaseClient.js';
import { InstallationFirst } from './homeComponents/InstallationFirst';
import { HomeInstallationSkeleton } from '@components/Skeletons/HomeInstallationSkeleton';
import ScriptCopy from '@components/ScriptCopy/ScriptCopy';

function createResource(promise) {
  let status = 'pending';
  let result;
  const suspender = promise.then(
    r => { status = 'success'; result = r; },
    e => { status = 'error'; result = e; }
  );
  return {
    read() {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      return result;
    }
  };
}

async function fetchSite(siteId) {
  const { data: site, error } = await supabase.from('Site').select('*').eq('id', siteId).single();
  if (error) throw error;
  return { site };
}

function HomeContent({ resource }) {
  const router = useRouter();
  const { showNotification } = useDashboard();
  const { site } = resource.read();
  if (!site) notFound();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);

  const getCanvasPreviewUrl = () => {
    const userId = site?.userid || 'anonymous';
    const filePath = `${userId}/${site?.id}.png`;
    const { data: { publicUrl } } = supabase.storage
      .from('Canvas capture')
      .getPublicUrl(filePath);
    return publicUrl;
  };

  const hasCanvasCapture = () => getCanvasPreviewUrl() && imageLoaded;
  const getCanvasColor = () => site?.JSON?.canvasColor || 'var(--site-background)';
  const handleBuilderClick = () => router.push(`/builder/${site.id}`);

  if (!site?.Verified) {
    return <InstallationFirst siteSlug={site.id} />;
  }

  return (
    <div className='home__installation-container home__installation-container--installed'>
      <ScriptCopy showNotification={showNotification}/>
      <div className="home__preview-container">
        <div 
          className={`home__preview ${imageLoaded ? 'home__preview--loaded' : ''} ${hasCanvasCapture() ? 'home__preview--with-capture' : ''} ${isPreviewHovered ? 'home__preview--hovered' : ''}`}
          style={{
            backgroundColor: hasCanvasCapture() ? 'transparent' : getCanvasColor(),
            backgroundImage: hasCanvasCapture() ? `url(${getCanvasPreviewUrl()})` : 'none'
          }}
          onMouseEnter={() => { setIsPreviewHovered(true); setIsButtonAnimating(false); }}
          onMouseLeave={() => { setIsButtonAnimating(true); setIsPreviewHovered(false); setTimeout(() => setIsButtonAnimating(false), 300); }}
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
  );
}

function Home() {
  const { ['site-slug']: siteSlug } = useParams();

  const { allUserDataResource } = useDashboard();

  // Unified: site + user-data in one resource to avoid unnecessary re-renders
  const resource = useMemo(() => {
    if (!siteSlug) return null;

    const sitePromise = fetchSite(siteSlug);

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const delay = 1500;

    const res = allUserDataResource;

    // - if there is no resource => wait delay
    // - if resource is PENDING => wait for its promise (without extra delay)
    // - if resource is RESOLVED => wait delay
    const gate = (async () => {
      if (!res) {
        await sleep(delay);
        return null;
      }
      try {
        const v = res.read(); 
        await sleep(delay);
        return v;
      } catch (p) {
        if (p && typeof p.then === 'function') {
          await p; 
          return null;
        }
        throw p;
      }
    })();

    return createResource(
      Promise.all([sitePromise, gate]).then(([siteData]) => siteData)
    );
  }, [siteSlug, allUserDataResource]);

  const Combined = ({ resource }) => {
    return <HomeContent resource={resource} />;
  };

  return (
    <div className="home">
      <Suspense fallback={<HomeInstallationSkeleton />}>
        {resource ? <Combined resource={resource} /> : <HomeInstallationSkeleton />}
      </Suspense>
    </div>
  );
}
export default Home;