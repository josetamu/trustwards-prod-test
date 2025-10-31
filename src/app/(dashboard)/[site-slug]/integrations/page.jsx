'use client'

import './integrations.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import { InstallationFirst } from '../homeComponents/InstallationFirst';
import { useMemo, Suspense } from 'react';
import { HomeInstallationSkeleton } from '@components/Skeletons/HomeInstallationSkeleton';
import { supabase } from '@supabase/supabaseClient';

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


async function fetchIntegrationsData(siteSlug) {
  const { data: site, error } = await supabase
    .from('Site')
    .select('*')
    .eq('id', siteSlug)
    .single();
  if (error) throw error;
  return { site };
}

function IntegrationsContent({ resource }) {
  const { site } = resource.read();
  const params = useParams();
  const siteSlug = params['site-slug'];

  if (!site) {
    notFound();
  }

  if (!site.Verified) {
    return (
      <div className='integrations'>
        <InstallationFirst siteSlug={siteSlug} />
      </div>
    );
  }

  return (
    <div className='integrations'>
      <div className='integrations__card'>
        <h2 className='integrations__card-title'>Google Consent Mode v2</h2>

        <p className='integrations__card-text'>
          Trustwards complies with Google Consent Mode v2 by integrating automatically with Google Ads and Google Tag Manager.
          <br/>
          <br/>
          No API keys or third-party consent has to be granted. If you are using Google Analytics or Google Tag Manager on your website,
          Trustwards will detect them automatically and will keep Google updated with user's consent choices.
        </p>

        <div className='integrations__card-divider'></div>

        <div className='integrations__mini-cards-wrapper'>
          <a target='_blank' href='https://analytics.google.com' className='integrations__mini-card integrations__mini-card--google-analytics'>
            <h3 className='integrations__mini-card-title'>Google Analytics</h3>
            <img className='integrations__mini-card-image' src='/assets/google-analytics.svg' alt='Google Analytics'></img>
          </a>
          <a target='_blank' href='https://tagmanager.google.com' className='integrations__mini-card integrations__mini-card--google-tag-manager'>
            <h3 className='integrations__mini-card-title'>Google Tag Manager</h3>
            <img className='integrations__mini-card-image' src='/assets/google-tag-manager.svg' alt='Google Tag Manager'></img>
          </a>
        </div>
      </div>
    </div>
  );
}

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { allUserDataResource } = useDashboard();
  
    const resource = useMemo(() => {
      if (!siteSlug) return null;
  
      const sleep = (ms) => new Promise(r => setTimeout(r, ms));
      const delay = 1500;
  
      const res = allUserDataResource;
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
        Promise.all([fetchIntegrationsData(siteSlug), gate]).then(([data]) => data)
      );
    }, [siteSlug, allUserDataResource]);
  
    return (
      <div className='integrations'>
        <Suspense fallback={<HomeInstallationSkeleton />}>
          {resource ? <IntegrationsContent resource={resource} /> : <HomeInstallationSkeleton />}
        </Suspense>
      </div>
    );
  }

export default Home;