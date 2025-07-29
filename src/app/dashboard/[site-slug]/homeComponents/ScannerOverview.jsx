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
        <div className="home__midCard">
                        <div className="home__midCard-header">
                            <span className="home__midCard-title">Scanner Overview</span>
                            {isInstalled && (
                                    <ScanButton isScanning={isScanning} MAX_SCANS={MAX_SCANS} setIsScanning={setIsScanning} setScanDone={setScanDone} scanDone={scanDone} siteSlug={siteSlug}/>
                            )}
                        </div>
                        {noInstalled()}
                        <div className="home__midCard-content">
                            {isScanning ? (
                                <div className="home__scanner home__scanner--scanning">
                                    <Scan isScanning={isScanning} />
                                </div>
                            ) : (
                                
                                <div className={`home__scanner home__scanner-content ${scans > 0 ? 'home__scanner-content--visible' : ''}`}>
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
                                        <span className="home__fullView-text">To have a full view go to the <Link href={`/dashboard/${siteSlug}/scanner`} className="home__fullView-link">scanner.</Link></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
    )
}