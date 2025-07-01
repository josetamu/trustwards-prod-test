'use client'

import './home.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '../layout';

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];

    // Fetch sites from the database using the dashboard context
    const { webs } = useDashboard();
    
    // Find the selected site object based on the slug
    const selectedSite = webs.find(site => site.Name.toLowerCase().replace(/\s+/g, '-') === siteSlug?.toLowerCase());
    
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
                    <h1 style={{color: 'var(--body-strong-color)'}}>{selectedSite.Name}</h1>
                </div>
            </div>
        </div>
    );
}

export default Home;