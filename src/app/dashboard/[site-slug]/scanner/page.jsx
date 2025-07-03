'use client'

import './scanner.css';
import { useParams, notFound } from 'next/navigation';

function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];

    // This is temporary, this has to be fetched from the database
    // const availableSites = ['Noir', 'Untitled'];
    
    // Find the selected site based on the slug
    // const selectedSite = availableSites.find(site => site.toLowerCase() === siteSlug?.toLowerCase());
    
    // if (!selectedSite) {
    //     notFound();
    // }

    const selectedSite = siteSlug || "My Site";

    return (
        <div className="scanner__wrapper">
            <div className='scanner__top-wrapper'>
                <div className="scanner__header">
                    <h2 className='scanner__title'>Scanner</h2>
                    <p className='scanner__paragraph'>In the scanner you can check all the scripts inserting cookies on your website.</p>
                </div>
                <div className='scanner__actions'>
                    <button className="scanner__scan">Scan</button>
                    <div className="scanner__monthly">
                        <span className="scanner__monthly-label">Monthly Scans</span>
                        <span className="scanner__monthly-count">0/3</span>
                        <div className="scanner__progress-bar">
                            <div className="scanner__progress-bar-inner" style={{ width: '0%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="scanner__main-box">
                <div className="scanner__main-box-content">
                    <div className="scanner__main-box-text">Scan your website for the first time<br/>to see all the scripts inserting cookies</div>
                    <button className="scanner__scan">Scan</button>
                </div>
            </div>
        </div>
    );
}

export default Home;