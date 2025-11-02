'use client'

import './integrations.css';
import { useParams, notFound } from 'next/navigation';
import { InstallationFirst } from '../homeComponents/InstallationFirst';
import { useEffect, useState } from 'react';
import { supabase } from '@supabase/supabaseClient';

async function fetchIntegrationsData(siteSlug) {
  const { data: site, error } = await supabase
    .from('Site')
    .select('*')
    .eq('id', siteSlug)
    .single();
  if (error) throw error;
  return { site };
}

function IntegrationsContent({ site }) {
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


  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!siteSlug) {
      setSite(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetchIntegrationsData(siteSlug)
      .then(({ site }) => {
        if (!cancelled) {
          setSite(site);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSite(null);
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [siteSlug]);

  if (loading) return null; 
  if (error) return null;   

  return (
    <div className='integrations'>
      {site ? <IntegrationsContent site={site} /> : null}
    </div>
  );
}

export default Home;