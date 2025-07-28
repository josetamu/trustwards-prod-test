import { useDashboard } from '../../dashboard/layout';
import PlanSkeleton from '../Skeletons/PlanSkeleton';

export const DashboardHeaderPlan = ({siteSlug, setModalType, setIsModalOpen}) => {
    const { allUserDataResource } = useDashboard();
    if(!allUserDataResource) return <PlanSkeleton />;

    const {webs} = allUserDataResource.read();
    if(!siteSlug || !webs || !Array.isArray(webs)) return null;
    const site = webs.find(web => web.id === siteSlug);

    return (
        <span className={`dashboardHeader__plan ${site?.Plan === 'Pro' ? 'dashboardHeader__plan--pro' : ''}`} onClick={() => {
            setModalType('Plan');
            setIsModalOpen(true);
        }}>
            {site?.Plan || 'Free'}
        </span>
    );
}