import { useDashboard } from '../../../dashboard/layout';
import PlanSkeleton from '../../../components/Skeletons/PlanSkeleton';
import Scan from '../../../components/scan/Scan';
import { supabase } from '../../../../supabase/supabaseClient';

export const ScanButton = ({isScanning, scanCount, scanSession, MAX_SCANS, setScanDone, setScanCount, setIsScanning, setScanSession, siteSlug}) => {
    const { allUserDataResource, setWebs } = useDashboard();
    if(!allUserDataResource) return <PlanSkeleton />;
    const { webs } = allUserDataResource.read();
    const site = webs.find(web => web.id === siteSlug);
    
    const currentScanCount = site?.Scans;

    const startScan = () => {
        if (isScanning || scanCount >= MAX_SCANS) return;
        setScanDone(false);
        setIsScanning(true);
        setScanSession(prev => prev + 1);
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
                console.error('Error updating scan count:', error);
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
            setScanCount(newScanCount);
            

        } catch (error) {
            console.error('Error in handleScanFinish:', error);
            setIsScanning(false);
        }
    };

    return (
        <button className="scanner__scan" onClick={startScan} disabled={isScanning || scanCount >= MAX_SCANS}>
            {isScanning ? (
                <Scan isScanning={isScanning} onlyBar key={scanSession} onFinish={handleScanFinish} />
            ) : 'Scan'}
        </button>
    );
}