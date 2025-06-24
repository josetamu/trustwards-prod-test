import { useState } from 'react';
import './SiteView.css';
import { Overview } from '../Overview/Overview';
import { Integrations } from '../Integrations/Integrations';
import { Scanner } from '../Scanner/Scanner';
import { ComplyMap } from '../ComplyMap/ComplyMap';

export default function SiteView({selectedSite, siteTab, setSiteTab}) {
    



   const renderTabSite = () => {
    switch (siteTab) {
        case 'Home':
            return <Overview />;
        case 'Scanner':
            return <Scanner />;
        case 'Comply Map':
            return <ComplyMap />;
        case 'Integrations':
            return <Integrations />;
        default:
            return <Overview />;
    }
}






return (
    <div className='siteView'>
        <div className='siteView__header'>
            <span className='siteView__header__title'>{selectedSite.Name}</span>
        </div>
        <div className='siteView__content'>
            {renderTabSite()}
        </div>
    </div>
)
}