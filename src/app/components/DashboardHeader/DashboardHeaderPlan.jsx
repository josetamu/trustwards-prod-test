import { useDashboard } from '@dashboard/layout';
import PlanSkeleton from '@components/Skeletons/PlanSkeleton';

export const DashboardHeaderPlan = ({siteSlug, setModalType, setIsModalOpen}) => {
    const { allUserDataResource } = useDashboard();
    if(!allUserDataResource) return <PlanSkeleton />;

    const {webs} = allUserDataResource.read();
    if(!siteSlug || !webs || !Array.isArray(webs)) return null;
    const site = webs.find(web => web.id === siteSlug);

    return (
        <span 
            className={`dashboard-header__plan ${site?.Plan === 'Pro' ? 'dashboard-header__plan--pro' : ''}`} 
            onClick={() => {
                setModalType('Plan');
                setIsModalOpen(true);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setModalType('Plan');
                    setIsModalOpen(true);
                }
            }}
            tabIndex={0}
            aria-label={`Current plan: ${site?.Plan || 'Free'}. Click to change plan`}
        >
            {site?.Plan || 'Free'}
        </span>
    );
}