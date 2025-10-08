import { useDashboard } from '@dashboard/layout';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';
import Scan from '@components/scan/Scan';
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

    const handleScanFinish = async () => {
        try {
            // Actualizar BD y estado global
            const newScanCount = currentScanCount + 1;
            const { data, error } = await supabase
                .from('Site')
                .update({ Scans: newScanCount })
                .eq('id', siteSlug)
                .select()
                .single();

            if (error) {
                console.error('Error updating scan count:', error, siteSlug,currentScanCount,newScanCount);
                setIsScanning(false);
                return;
            }

            setWebs(prevWebs =>
                prevWebs.map(site =>
                    site.id === siteSlug ? { ...site, Scans: newScanCount } : site
                )
            
            );

            if(allUserDataResource) {
                const currentData = allUserDataResource.read();
                currentData.webs = currentData.webs.map(web =>
                    web.id === siteSlug ? { ...web, Scans: newScanCount } : web
                );
            }

            setIsScanning(false);
            setScanDone(true);

            

        } catch (error) {
            console.error('Error in handleScanFinish:', error);
            setIsScanning(false);
        }
    };

    return (
        <button className={`scanner__scan ${currentScanCount >= MAX_SCANS ? 'scanner__scan--disabled' : ''}`} onClick={startScan} disabled={isScanning || currentScanCount >= MAX_SCANS || !isInstalled} tabIndex={-1}>
            {isScanning ? (
                <Scan isScanning={isScanning} onlyBar onFinish={handleScanFinish} />
            ) : 'Scan'}
        </button>
    );
}