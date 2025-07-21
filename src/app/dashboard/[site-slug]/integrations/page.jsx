'use client'

import './integrations.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '../../layout';
import { useEffect } from 'react';

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs } = useDashboard();

    
    useEffect(() => {
        // Si webs está disponible, ya no estamos cargando
        if (webs && webs.length > 0) {
           
        }
    }, [webs]);
    


        // Find the selected site based on the slug (using id like the main page)
        const selectedSite = webs.find(site => site.id === siteSlug);
        if(!webs || webs.length === 0) {
            return
        }
    
    if (!selectedSite) {
        notFound();
    }

    return (
        <div className='integrations'>
            <div className='integrations__header'>
                <h1>Coming soon...</h1>
            </div>
        </div>
    );
}
export default Home;
