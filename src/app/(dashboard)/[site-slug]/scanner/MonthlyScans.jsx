import './scanner.css';
import { useDashboard } from '@dashboard/DashboardContext';
import { MonthlyScansSkeleton } from '@components/Skeletons/MonthlyScansSkeleton';



export const MonthlyScans = ({scanCount, MAX_SCANS}) => {
    const {allUserDataResource } = useDashboard();
    if(!allUserDataResource) return <MonthlyScansSkeleton />;
    const {webs} = allUserDataResource.read();

    return (
        <div className="scanner__monthly">
        <div className='scanner__monthly-wrapper'>
            <span className="scanner__monthly-label">Monthly Scans</span>
            <span className="scanner__monthly-count">{scanCount}/{MAX_SCANS}</span>
        </div>
        <div className="scanner__progress-bar">
            <div className="scanner__progress-bar-background"></div>
            <div className="scanner__progress-bar-inner">
                <div
                    className="scanner__progress-bar-fill"
                    style={{ transform: `scaleX(${(scanCount / MAX_SCANS)})` }}
                ></div>
            </div>
        </div>
    </div>
    )
}