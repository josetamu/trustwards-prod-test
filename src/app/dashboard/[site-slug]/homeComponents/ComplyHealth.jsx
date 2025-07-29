import { useDashboard } from '../../layout';
import { ComplyHealthSkeleton } from '@components/Skeletons/ComplyHealthSkeleton';
import { useState, useEffect } from 'react';


export const ComplyHealth = ({ siteSlug, noInstalled }) => {
    const {allUserDataResource } = useDashboard();
    const [complyHealthStatus, setComplyHealthStatus] = useState(78);
        // Function to handle the gradient of the comply health circle.
// If complyHealthStatus is 0 or 100, use the corresponding class.
// Otherwise, set a CSS variable with the complyHealthStatus value.
const gradientHandle = (complyHealthStatus) => {
    const circle = document.querySelector('.home__complyHealth');
    if(!circle){
        setTimeout(() => gradientHandle(complyHealthStatus), 100);
        return;
    }

    // Remove all possible gradient classes first
    circle.classList.remove('home__complyHealth--empty', 'home__complyHealth--full', 'home__complyHealth--gradient');

    if (complyHealthStatus === 0) {
        circle.classList.add('home__complyHealth--empty');
    } else if (complyHealthStatus === 100) {
        circle.classList.add('home__complyHealth--full');
    } else {
        circle.classList.add('home__complyHealth--gradient');
        // Set the CSS variable for complyHealthStatus
        circle.style.setProperty('--comply-health-status', complyHealthStatus + '%');
    }
}
//update the gradient when the comply health status changes
    useEffect(() => {
        gradientHandle(complyHealthStatus);
    }, [complyHealthStatus]);

    if(!allUserDataResource) return <ComplyHealthSkeleton />;   

    const {webs} = allUserDataResource.read();





   
    if(!siteSlug || !webs || !Array.isArray(webs)) return null; 


    const complyHealth = [
        {
            region: 'Europe',
            current: 9,
            total: 12,
        },
        {
            region: 'North America',
            current: 5,
            total: 6,
        },
        {
            region: 'South America',
            current: 3,
            total: 4,
        },
        {
            region: 'Asia',
            current: 6,
            total: 6,
        },
        {
            region: 'Africa',
            current: 4,
            total: 5,
        },
        {
            region: 'Oceania',
            current: 2,
            total: 3,
        },
    ]
    return (
        <div className="home__cardInfo">
                        <div className="home__cardInfo-header">
                            <span className="home__cardInfo-title">Comply Health</span>
                        </div>
                        {noInstalled()}
                        <div className="home__cardInfo-content">
                            <div className="home__complyHealth">
                                <span className="home__complyHealth-text">{complyHealthStatus}</span>
                            </div>
                            <div className="home__complyHealth-datas">
                                    {complyHealth.map((item, index) => (
                                        <div className="home__complyHealth-data" key={index}>
                                            <span className="home__complyHealth-region">{item.region}</span>
                                            <span className="home__complyHealth-value">{item.current}/{item.total}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
    )
}