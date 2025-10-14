'use client'

import './InstallationFirst.css';
import { useDashboard } from '@dashboard/layout';
import ScriptCopy from '@components/ScriptCopy/ScriptCopy';
import { supabase } from '@supabase/supabaseClient.js';

export const InstallationFirst = ({ siteSlug }) => {
    const { showNotification, setWebs, allUserDataResource, setIsInstalled, siteData, isVerifying, setIsVerifying } = useDashboard();

    const verify = async () => {
        // Prevent more clicks if already verifying
        if (isVerifying) return;
        
        setIsVerifying(true);
        try {
            // 1. Verify that the script is installed on the website
            if (!siteData?.Domain || !siteData?.id) {
                if (showNotification) {
                    showNotification('Site data not available. Please try again.', 'top', false, true);
                }
                return;
            }

            // Call the verification API (Playwright)
            const verifyResponse = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    domain: siteData.Domain,
                    siteId: siteData.id
                })
            });

            const verifyResult = await verifyResponse.json();

            // If the script is not found, show message from API (Playwright) and do not continue
            if (!verifyResult.success) {
                if (showNotification) {
                    showNotification(verifyResult.message || "The script couldn't be found on your website", 'top', false, true);
                }
                return;
            }

            // 2. If the script is found, update in the database
            const { data, error } = await supabase
                .from('Site')
                .update({ Verified: true })
                .eq('id', siteSlug)
                .select()
                .single();

            if (error) {
                console.error('Error updating site verification:', error);
                if (showNotification) {
                    showNotification('Failed to verify site. Please try again.', 'top', false, true);
                }
                return;
            }

            // 3. Update the local state
            setIsInstalled(true);

            // 4. Update the global webs state
            setWebs(prevWebs =>
                prevWebs.map(site =>
                    site.id === siteSlug ? { ...site, Verified: true } : site
                )
            );

            // 5. Update the resource to maintain consistency
            if (allUserDataResource) {
                const currentData = allUserDataResource.read();
                currentData.webs = currentData.webs.map(web =>
                    web.id === siteSlug ? { ...web, Verified: true } : web
                );
            }

            // 6. Show success notification
            if (showNotification) {
                showNotification('Site verified successfully!', 'top', true, false);
            }

        } catch (error) {
            console.error('Error verifying site:', error);
            if (showNotification) {
                showNotification('Failed to verify site. Please try again.', 'top', false, true);
            }
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className='home__installation-container'>
            <div className='home__installation-header'>
                <span className='home__installation-title'>Installation</span>
                <div 
                    className={`home__verify ${isVerifying ? 'home__verify--loading' : ''}`} 
                    onClick={verify}
                    style={{ cursor: isVerifying ? 'not-allowed' : 'pointer' }}
                >
                    {isVerifying ? (
                        <>
                            <svg 
                                className="home__verify-spinner" 
                                width="14" 
                                height="14" 
                                viewBox="0 0 14 14" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path 
                                    d="M7 1V3M7 11V13M13 7H11M3 7H1M11.364 11.364L9.95 9.95M4.05 4.05L2.636 2.636M11.364 2.636L9.95 4.05M4.05 9.95L2.636 11.364" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className='home__verify-text'>Verifying...</span>
                        </>
                    ) : (
                        <span className='home__verify-text'>Verify</span>
                    )}
                </div>
            </div>
            <div className='home__installation-content'>
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
    );
};

