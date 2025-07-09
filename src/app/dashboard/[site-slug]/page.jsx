'use client'

import './home.css';
import { useParams, notFound } from 'next/navigation';
import { useDashboard } from '../layout';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../../supabase/supabaseClient';
import ScriptCopy from '../../components/ScriptCopy/ScriptCopy';

//function to create a circle chart
function CircleChart({data, centerText, centerLabel, centerIcon}) {
    const radius = 53.5;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    return (
    <svg className="home__circleChart" viewBox="0 0 140 140">
      <g transform="translate(70,70)">
        {data.map((d, i) => {
          const value = d.value;
          const dash = (value / totalValue) * circumference;
          const dashArray = `${dash} ${circumference - dash}`;
          const circle = (
            <circle
              key={i}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={-offset}
              style={{ transition: "stroke-dasharray 0.3s" }}
            />
          );
          offset += dash;
          return circle;
        })}
      </g>
      
      {/* Center Icon - positioned behind the text */}
      {centerIcon && (
        <g transform="translate(35, 50)" style={{zIndex: 0}}>
          {centerIcon}
        </g>
      )}
      
      <text
        x="70"
        y="70"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14.5"
        fontWeight="500"
        fill="var(--home-chart-color)"
        letterSpacing="var(--letter-spacing-negative)"
        style={{zIndex: 1}}
      >
        {centerText}
      </text>
      <text
        x="70"
        y="85"
        textAnchor="middle"
        fontSize="8.5"
        fill="var(--home-chart-color)"
        letterSpacing="var(--letter-spacing-negative)"
        style={{zIndex: 1}}
      >
        {centerLabel}
      </text>
    </svg>
    );
};

//Home page
function Home() {
    const params = useParams();
    const siteSlug = params['site-slug'];
    const { webs, checkSitePicture, SiteStyle, user, fetchSites, showNotification } = useDashboard();
    const selectedSite = webs.find(site => site.id === siteSlug);
    const [siteData, setSiteData] = useState(selectedSite);
    const [isInstalled, setIsInstalled] = useState(false);
    const [complyHealthStatus, setComplyHealthStatus] = useState(78);

    //update site data when the selected site changes
    useEffect(() => {
        setSiteData(selectedSite);
    }, [selectedSite]); 

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

    // if webs is empty return waiting for the webs to load. Here we could add a loading spinner or a message to the user
    if (!webs || webs.length === 0) {
        return // Añadir un loading state
    }

    if (!selectedSite) {
        notFound();
    }

//function to show the no installed message on cards
const noInstalled = () => {
    if(!isInstalled){
        return (
        <div className="home__noInstalled">
            <span className="home__noInstalled-text">Install Trustwards on your site first.
            </span>
            <div className="home__verify">
                <span className="home__verify-text">Verify</span>
            </div>
        </div>
        )
    }
}

//variables for the scanner overview
const general = /* scanGeneral || */ 0;
const analytics = /* scanAnalytics || */ 0;
const marketing = /* scanMarketing || */ 0;
const other = /* scanOther || */ 0;
const social = /* scanSocial || */ 0;

//variables for the usages
const usages = [
    {
        title: 'Pages',
        current: 6,
        total: 12,
        percentage: 6 / 12,
    },
    {
        title: 'Monthly scans',
        current: 2,
        total: 3,
        percentage: 2 / 3,
    },
    
    {
        title: 'Monthly Visitors',
        current: 217,
        total: 1000,
        percentage: 217 / 1000,
    },
]

//variables for the comply health

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

// Variables for the analytics cookies
const analyticsCookies = [
    {
        title: 'Accepted cookies',
        value: '11,054',
        color: 'blue',
        hex: '#0099FE',
    },
    {
        title: 'Modified cookies',
        value: '4,627',
        color: 'celeste',
        hex: '#0099fe80',
    },
    {
        title: 'Rejected cookies',
        value: '12,653',
        color: 'red',
        hex: '#F61C0D',
    },
    {
        title: 'No answer',
        value: '1,768',
        color: 'orange',
        hex: '#FE8700',
    },
];


// Convert analyticsCookies to format for the chart
const cookiesData = analyticsCookies.map(item => ({
    value: parseInt(item.value.replace(/,/g, "")),
    color: item.hex
}));





    return (
    
          <div className="home">
            {isInstalled ? (
                <div className='home__installation-container home__installation-container--installed'>
                    <ScriptCopy showNotification={showNotification}/>
                </div>
                ) : (
                    <div className='home__installation-container'>
                        <div className='home__installation-header'>
                            <span className='home__installation-title'>Installation</span>
                            <div className='home__verify' onClick={() => setIsInstalled(true)}>
                                <span className='home__verify-text'>Verify</span>
                            </div>
                        </div>
                        <div className='home__installation-body'>
                            <span className='home__paste'>Paste the following snippet as high as possible in the &lt;head&gt; part of your website.</span>
                            <ScriptCopy showNotification={showNotification}/>
                            <div className="home__divider"></div>
                            <div className="home__cards">
                                <div className="home__card">
                                    <div className="home__card-header">
                                        <span className='home__card-title'>Installing Trustwards</span>
                                        <span className='home__card-text'>On WordPress, Webflow, Framer and more!</span>
                                    </div>
                                    <div className="home__card-svg-container">
                                    <svg className="home__card-svg" width="121" height="82" viewBox="0 0 121 82" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 35C0 32.2386 2.23858 30 5 30H33C35.7614 30 38 32.2386 38 35V52C38 54.7614 35.7614 57 33 57H5C2.23858 57 0 54.7614 0 52V35Z" fill="white" fillOpacity="0.15"/>
                                        <path d="M83 35C83 32.2386 85.2386 30 88 30H116C118.761 30 121 32.2386 121 35V52C121 54.7614 118.761 57 116 57H88C85.2386 57 83 54.7614 83 52V35Z" fill="white" fillOpacity="0.15"/>
                                        <path d="M0 5C0 2.23858 2.23858 0 5 0H33C35.7614 0 38 2.23858 38 5V21C38 23.7614 35.7614 26 33 26H5C2.23858 26 0 23.7614 0 21V5Z" fill="url(#paint0_linear_573_2)"/>
                                        <path d="M121 5C121 2.23858 118.761 0 116 0H88C85.2386 0 83 2.23858 83 5V21C83 23.7614 85.2386 26 88 26H116C118.761 26 121 23.7614 121 21V5Z" fill="url(#paint1_linear_573_2)"/>
                                        <path d="M121 82C121 84.7614 118.761 87 116 87H88C85.2386 87 83 84.7614 83 82V66C83 63.2386 85.2386 61 88 61H116C118.761 61 121 63.2386 121 66V82Z" fill="url(#paint2_linear_573_2)"/>
                                        <path d="M0 82C0 84.7614 2.23858 87 5 87H33C35.7614 87 38 84.7614 38 82V66C38 63.2386 35.7614 61 33 61H5C2.23858 61 0 63.2386 0 66V82Z" fill="url(#paint3_linear_573_2)"/>
                                        <path d="M41 66C41 63.2386 43.2386 61 46 61H74C76.7614 61 79 63.2386 79 66V82C79 84.7614 76.7614 87 74 87H46C43.2386 87 41 84.7614 41 82V66Z" fill="white" fillOpacity="0.15"/>
                                        <path d="M41 5C41 2.23858 43.2386 0 46 0H74C76.7614 0 79 2.23858 79 5V21C79 23.7614 76.7614 26 74 26H46C43.2386 26 41 23.7614 41 21V5Z" fill="white" fillOpacity="0.15"/>
                                        <rect x="41" y="30" width="38" height="27" rx="5" fill="white"/>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M60.5 36C57.8537 36 55.3363 36.1368 53.0625 36.3837C50.6418 36.6465 49 38.3506 49 40.2417V46.7583C49 48.6494 50.6418 50.3535 53.0625 50.6163C55.3363 50.8632 57.8537 51 60.5 51C63.1463 51 65.6638 50.8632 67.9376 50.6163C70.3581 50.3535 72 48.6494 72 46.7583V40.2417C72 38.3506 70.3581 36.6465 67.9376 36.3837C65.6638 36.1368 63.1463 36 60.5 36ZM58.7733 40.3773C58.5254 40.2582 58.2167 40.255 57.9652 40.3692C57.7136 40.4833 57.5581 40.697 57.5581 40.9286V46.0714C57.5581 46.303 57.7136 46.5167 57.9652 46.6308C58.2167 46.745 58.5254 46.7418 58.7733 46.6227L64.1221 44.0512C64.3638 43.9351 64.5116 43.7258 64.5116 43.5C64.5116 43.2742 64.3638 43.0649 64.1221 42.9488L58.7733 40.3773Z" fill="#F61C0D"/>
                                        <defs>
                                        <linearGradient id="paint0_linear_573_2" x1="-4.22222" y1="7.56884e-07" x2="39.1942" y2="28.6693" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="white" stopOpacity="0"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0.05"/>
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_573_2" x1="125.222" y1="7.56884e-07" x2="81.8058" y2="28.6693" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="white" stopOpacity="0"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0.05"/>
                                        </linearGradient>
                                        <linearGradient id="paint2_linear_573_2" x1="125.222" y1="87" x2="81.8058" y2="58.3307" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="white" stopOpacity="0"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0.05"/>
                                        </linearGradient>
                                        <linearGradient id="paint3_linear_573_2" x1="-4.22222" y1="87" x2="39.1942" y2="58.3307" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="white" stopOpacity="0"/>
                                        <stop offset="1" stopColor="white" stopOpacity="0.05"/>
                                        </linearGradient>
                                        </defs>
                                    </svg>
                                    </div>
                                </div>
                                <div className="home__card home__card--reverse">
                                    <div className="home__card-header">
                                        <span className='home__card-title'>Need Support?</span>
                                        <span className='home__card-text'>We are more than happy to help!</span>
                                    </div>
                                    <div className="home__card-svg-container">
                                            <svg className="home__card-svg" width="122" height="88" viewBox="0 0 122 88" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0 36C0 33.2386 2.23858 31 5 31H33C35.7614 31 38 33.2386 38 36V52C38 54.7614 35.7614 57 33 57H5C2.23858 57 0 54.7614 0 52V36Z" fill="white" fillOpacity="0.15"/>
                                                <path d="M84 36C84 33.2386 86.2386 31 89 31H117C119.761 31 122 33.2386 122 36V52C122 54.7614 119.761 57 117 57H89C86.2386 57 84 54.7614 84 52V36Z" fill="white" fillOpacity="0.15"/>
                                                <path d="M0 5C0 2.23858 2.23858 0 5 0H33C35.7614 0 38 2.23858 38 5V21C38 23.7614 35.7614 26 33 26H5C2.23858 26 0 23.7614 0 21V5Z" fill="url(#paint0_linear_573_3)"/>
                                                <path d="M122 5C122 2.23858 119.761 0 117 0H89C86.2386 0 84 2.23858 84 5V21C84 23.7614 86.2386 26 89 26H117C119.761 26 122 23.7614 122 21V5Z" fill="url(#paint1_linear_573_3)"/>
                                                <path d="M122 83C122 85.7614 119.761 88 117 88H89C86.2386 88 84 85.7614 84 83V67C84 64.2386 86.2386 62 89 62H117C119.761 62 122 64.2386 122 67V83Z" fill="url(#paint2_linear_573_3)"/>
                                                <path d="M0 83C0 85.7614 2.23858 88 5 88H33C35.7614 88 38 85.7614 38 83V67C38 64.2386 35.7614 62 33 62H5C2.23858 62 0 64.2386 0 67V83Z" fill="url(#paint3_linear_573_3)"/>
                                                <path d="M42 67C42 64.2386 44.2386 62 47 62H75C77.7614 62 80 64.2386 80 67V83C80 85.7614 77.7614 88 75 88H47C44.2386 88 42 85.7614 42 83V67Z" fill="white" fillOpacity="0.15"/>
                                                <path d="M42 5C42 2.23858 44.2386 0 47 0H75C77.7614 0 80 2.23858 80 5V21C80 23.7614 77.7614 26 75 26H47C44.2386 26 42 23.7614 42 21V5Z" fill="white" fillOpacity="0.15"/>
                                                <rect x="42" y="31" width="38" height="26" rx="5" fill="white" fillOpacity="0.4"/>
                                                <path d="M50 37H72V41.3636H50V37Z" fill="white"/>
                                                <path d="M55.8667 53V44.2727H64.6667L55.8667 53Z" fill="white"/>
                                                <path d="M61.7333 53V44.2727H69.0667L61.7333 53Z" fill="white"/>
                                                <defs>
                                                <linearGradient id="paint0_linear_573_3" x1="-4.22222" y1="7.56884e-07" x2="39.1942" y2="28.6693" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="white" stopOpacity="0"/>
                                                <stop offset="1" stopColor="white" stopOpacity="0.05"/>
                                                </linearGradient>
                                                <linearGradient id="paint1_linear_573_3" x1="126.222" y1="7.56884e-07" x2="82.8058" y2="28.6693" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="white" stopOpacity="0"/>
                                                <stop offset="1" stopColor="white" stopOpacity="0.05"/>
                                                </linearGradient>
                                                <linearGradient id="paint2_linear_573_3" x1="126.222" y1="88" x2="82.8058" y2="59.3307" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="white" stopOpacity="0"/>
                                                <stop offset="1" stopColor="white" stopOpacity="0.05"/>
                                                </linearGradient>
                                                <linearGradient id="paint3_linear_573_3" x1="-4.22222" y1="88" x2="39.1942" y2="59.3307" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="white" stopOpacity="0"/>
                                                <stop offset="1" stopColor="white" stopOpacity="0.05"/>
                                                </linearGradient>
                                                </defs>
                                            </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="home__mid">
                    <div className="home__midCard"></div>
                    <div className="home__midCard">
                        <div className="home__midCard-header">
                            <span className="home__midCard-title">Scanner Overview</span>
                            <div className="home__scan">
                                <span className="home__scan-text">Scan</span>
                            </div>
                        </div>
                        {noInstalled()}
                        <div className="home__midCard-content">
                            <div className="home__scanner">
                                <div className="home__scannerItems">
                                    <div className="home__scannerItem">
                                        <span className="home__scannerItem-text">General</span>
                                        <span className="home__scannerItem-text">{general}</span>
                                    </div>
                                    <div className="home__scannerItem">
                                        <span className="home__scannerItem-text">Analytics</span>
                                        <span className="home__scannerItem-text">{analytics}</span>
                                    </div>
                                    <div className="home__scannerItem">
                                        <span className="home__scannerItem-text">Marketing</span>
                                        <span className="home__scannerItem-text">{marketing}</span>
                                    </div>
                                    <div className="home__scannerItem">
                                        <span className="home__scannerItem-text">Other</span>
                                        <span className="home__scannerItem-text">{other}</span>
                                    </div>
                                </div>
                                <div className="home__fullView">
                                    <div className="home__fullView-text">To have a full view go to the <a href={`/dashboard/${siteData?.id}/scanner`} className="home__fullView-link">scanner.</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="home__bottom">
                    
                    <div className="home__cardInfo">
                        <div className="home__cardInfo-header">
                            <span className="home__cardInfo-title">Site Usage</span>
                            <span className="home__cardInfo-plan">{siteData?.Plan}</span>
                        </div>
                        {noInstalled()}
                        <div className="home__cardInfo-content">
                            {siteData?.Plan === 'Free' && (
                            <div className="home__cardInfo-upgrade">
                                <span className="home__cardInfo-enjoy">Enjoy unlimited usage. <span className="home__cardInfo-enjoy--upgrade">Upgrade</span> this site to pro</span>
                            </div>
                            )}
                            <div className="home__usages">
                                <div className="home__usage">
                                    <div className="home__usage-header">
                                        <span className="home__usage-title">Pages</span>
                                        <span className="home__usage-value">{usages[0].current}/{usages[0].total}</span>
                                    </div>
                                    <div className="home__pagesBar">
                                        <div className="home__pagesBar-fill"></div>
                                        <div className="home__pagesBar-fill--color" style={{width: `${usages[0].percentage * 100}%`}}></div>
                                    </div>
                                </div>
                                <div className="home__usage">
                                <div className="home__usage-header">
                                        <span className="home__usage-title">Monthly scans</span>
                                        <span className="home__usage-value">{usages[1].current}/{usages[1].total}</span>
                                    </div>
                                    <div className="home__pagesBar">
                                        <div className="home__pagesBar-fill"></div>
                                        <div className="home__pagesBar-fill--color" style={{width: `${usages[1].percentage * 100}%`}}></div>
                                    </div>
                                </div>
                                <div className="home__usage">
                                    <div className="home__usage-header">
                                            <span className="home__usage-title">Monthly Visitors</span>
                                            <span className="home__usage-value">{usages[2].current}/{usages[2].total}</span>
                                    </div>
                                    <div className="home__pagesBar">
                                        <div className="home__pagesBar-fill"></div>
                                        <div className="home__pagesBar-fill--color" style={{width: `${usages[2].percentage * 100}%`}}></div>
                                    </div>
                                </div>
                            </div>
                            {siteData?.Plan === 'Free' && (
                                <div className="home__buttonUpgrade">
                                    <span className="home__buttonUpgrade-text">Upgrade</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="home__cardInfo home__cardInfo--analytics">
                        <div className="home__cardInfo-header home__cardInfo-header--analytics">
                            <span className="home__cardInfo-title">Analytics</span>
                        </div>
                        {noInstalled()}
                        <div className="home__cardInfo-content home__cardInfo-content--analytics">
                            <div className="home__cookiesDisplayed"> 
                                <CircleChart 
                                data={cookiesData} 
                                centerText={
                                    (cookiesData[0].value + cookiesData[1].value + cookiesData[3].value).toLocaleString()
                                }
                                centerLabel="Cookies displayed"
                                centerIcon={
                                    <g>
                                        {/* Cookie icon - simple circle with dots */}
                                        <svg className="home__circleChart-icon" width="70" height="50" viewBox="0 0 102 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0 0H102V20.4545H0V0Z" fill="currentColor"/>
                                            <path d="M27.2 75V34.0909H68L27.2 75Z" fill="currentColor"/>
                                            <path d="M54.4 75V34.0909H88.4L54.4 75Z" fill="currentColor"/>
                                        </svg>
                                    </g>
                                } />
                            </div>
                            <div className="home__analytics">
                                {analyticsCookies.map((item, index) => (
                                    <div className="home__cookie" key={index}>
                                        <div className={`home__color home__color--${item.color}`}></div>
                                        <div className="home__cookie-text">
                                            <span className="home__cookie-title">{item.title}</span>
                                            <span className="home__cookie-value">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
                </div>
          </div>
          
        
    );
}

export default Home;