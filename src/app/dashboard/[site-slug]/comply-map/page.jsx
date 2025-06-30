'use client'

import './comply-map.css';
import { useParams, notFound } from 'next/navigation';

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];

    // This is temporary, this has to be fetched from the database
    const availableSites = ['Noir', 'Untitled'];
    
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
                    <h1>Comply Map: {selectedSite}</h1>
                </div>
            </div>
        </div>
    );
}

export default Home;