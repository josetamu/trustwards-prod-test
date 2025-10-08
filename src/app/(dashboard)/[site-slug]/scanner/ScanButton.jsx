import { useDashboard } from '@dashboard/layout';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';
import { supabase } from '@supabase/supabaseClient';

export const ScanButton = ({isScanning, MAX_SCANS, setScanDone, setIsScanning, siteSlug}) => {
    const { allUserDataResource, setWebs } = useDashboard();
    if(!allUserDataResource) return <PlanSkeleton />;
    const { webs } = allUserDataResource.read();
    const site = webs.find(web => web.id === siteSlug);
    const isInstalled = site?.Verified;
    const currentScanCount = site?.Scans;

    const startScan = () => {
        if (isScanning || currentScanCount >= MAX_SCANS) return;
        setScanDone(false);
        setIsScanning(true);
    };

    return (
        <button className={`scanner__scan ${(isScanning || currentScanCount >= MAX_SCANS || !isInstalled) ? 'scanner__scan--disabled' : ''}`} onClick={startScan} disabled={isScanning || currentScanCount >= MAX_SCANS || !isInstalled} tabIndex={-1}>
            Scan
        </button>
    );
}