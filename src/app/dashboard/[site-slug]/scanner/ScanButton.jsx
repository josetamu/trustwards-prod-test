import { useDashboard } from '../../../dashboard/layout';
import PlanSkeleton from '../../../components/Skeletons/PlanSkeleton';
import Scan from '../../../components/scan/Scan';

export const ScanButton = ({isScanning, scanCount, startScan, scanSession, MAX_SCANS}) => {
    const { allUserDataResource } = useDashboard();

    if(!allUserDataResource) return <PlanSkeleton />;

    const { appearanceSettings} = allUserDataResource.read();



    return (
        <button className="scanner__scan" onClick={startScan} disabled={isScanning || scanCount >= MAX_SCANS}>
            {isScanning ? (
                <Scan isScanning={isScanning} onlyBar key={scanSession} />
            ) : 'Scan'}
        </button>
    );
}