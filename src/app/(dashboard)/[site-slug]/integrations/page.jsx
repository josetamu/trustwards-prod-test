'use client'

import './integrations.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';
import { InstallationFirst } from '../homeComponents/InstallationFirst';

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs } = useDashboard();

    // Find the selected site based on the slug (using id like the main page)
    const selectedSite = webs.find(site => site.id === siteSlug);
    if(!webs || webs.length === 0) {
        return
    }
    
    if (!selectedSite) {
        notFound();
    }

    // If not installed, show installation screen (check directly from site data)
    if (!selectedSite.Verified) {
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
export default Home;