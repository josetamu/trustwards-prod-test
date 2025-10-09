'use client'

import './proof-of-consent.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '@dashboard/layout';

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

    return (
        <div className='proof-of-consent'>
        </div>
    );
}
export default Home;