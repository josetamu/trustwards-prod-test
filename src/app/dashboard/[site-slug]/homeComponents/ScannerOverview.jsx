import { ScanButton } from '../scanner/ScanButton';
import  Scan  from '@components/scan/Scan';
import Link from 'next/link';
import { useDashboard } from '../../layout';
import { ScannerOverviewSkeleton } from '@components/Skeletons/ScannerOverviewSkeleton';

export const ScannerOverview = ({ isScanning, MAX_SCANS, setIsScanning, setScanDone, scanDone, siteSlug, noInstalled}) => {
    const {allUserDataResource } = useDashboard();

    if(!allUserDataResource) return <ScannerOverviewSkeleton />;

    const {webs} = allUserDataResource.read();

    if(!siteSlug || !webs || !Array.isArray(webs)) return null;

    const site = webs.find(web => web.id === siteSlug);
    const isInstalled = site?.Verified;
    const scans = site?.Scans;
    //variables for the scanner overview
    const general = /* scanGeneral || */ 0;
    const analytics = /* scanAnalytics || */ 0;
    const marketing = /* scanMarketing || */ 0;
    const other = /* scanOther || */ 0;
    const social = /* scanSocial || */ 0;



    return (
        <div className="home__mid-card">
                        <div className="home__mid-card-header">
                            <span className="home__mid-card-title">Scanner Overview</span>
                            {isInstalled && (
                                    <ScanButton isScanning={isScanning} MAX_SCANS={MAX_SCANS} setIsScanning={setIsScanning} setScanDone={setScanDone} scanDone={scanDone} siteSlug={siteSlug}/>
                            )}
                        </div>
                        {noInstalled()}
                        <div className="home__mid-card-content">
                            {isScanning ? (
                                <div className="home__scanner home__scanner--scanning">
                                    <Scan isScanning={isScanning} />
                                </div>
                            ) : (
                                
                                <div className={`home__scanner home__scanner-content`}>
                                    {scans === 0 ? (
                                        <div className="home__no-scans">
                                            <span className="home__no-scans-text">Scan your website for the first time
                                            to see all the scripts inserting cookies</span>
                                        </div>
                                    ) : (
                                    <>
                                        <div className="home__scanner-items">
                                            <div className="home__scanner-item">
                                                <span className="home__scanner-item-text">General</span>
                                                <span className="home__scanner-item-text">{general}</span>
                                            </div>
                                            <div className="home__scanner-item">
                                                <span className="home__scanner-item-text">Analytics</span>
                                                <span className="home__scanner-item-text">{analytics}</span>
                                            </div>
                                            <div className="home__scanner-item">
                                                <span className="home__scanner-item-text">Marketing</span>
                                                <span className="home__scanner-item-text">{marketing}</span>
                                            </div>
                                            <div className="home__scanner-item">
                                                <span className="home__scanner-item-text">Other</span>
                                                <span className="home__scanner-item-text">{other}</span>
                                            </div>
                                        </div>
                                        <div className="home__full-view">
                                            <span className="home__full-view-text">To have a full view go to the <Link href={`/dashboard/${siteSlug}/scanner`} className="home__full-view-link">scanner.</Link></span>
                                        </div>
                                    </>
                                )}
                                </div>
                                )}
                            
                        </div>
                    </div>
    )
}