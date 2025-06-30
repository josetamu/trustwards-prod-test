'use client'

import './home.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '../layout';

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];

    // Fetch sites from the database using the dashboard context
    const { webs } = useDashboard();
    const availableSites = webs.map(site => site.Name);
    
    // Find the selected site based on the slug
    const selectedSite = availableSites.find(site => site.toLowerCase() === siteSlug?.toLowerCase());
    
    if (!selectedSite) {
        notFound();
    }

    return (
        <div className='siteView'>
            <div className='siteView__header'>
                <div className='siteView__header__avatar'>
                    <img className='siteView__header__img' src={selectedSite["Avatar URL"]} alt={selectedSite.Name} />
                    <span className='siteView__header__title'>{selectedSite.Name}</span>
                </div>
                <span className='siteView__header__plan'>{selectedSite.Plan}</span>
                

            </div>
            <div className='siteView__content'>
                <div>
                    <h1>{selectedSite}</h1>
                </div>
            </div>
        </div>
    );
}

export default Home;