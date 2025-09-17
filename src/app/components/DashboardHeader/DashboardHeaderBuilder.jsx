import { useDashboard } from '@dashboard/layout';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';
import Link from 'next/link';

export const DashboardHeaderBuilder = ({siteSlug}) => {
    const { allUserDataResource } = useDashboard();

    if(!allUserDataResource) return <PlanSkeleton />;

    const {appearanceSettings} = allUserDataResource.read();



    return (
        <div className="dashboard-header__builder">
            <Link href={`/builder/${siteSlug}`} className="dashboard-header__builder-text">Builder</Link>
        </div>
    );
}