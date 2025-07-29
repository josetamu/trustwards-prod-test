import { useDashboard } from '../../dashboard/layout'; // Ajusta el import según tu estructura
import UserNameSkeleton from '../Skeletons/UserNameSkeleton';

export const DashboardHeaderName = ({siteSlug, openChangeModalSettings}) => {
    const { allUserDataResource } = useDashboard();

    if(!allUserDataResource) return <UserNameSkeleton />;

    const {webs} = allUserDataResource.read();

    if(!siteSlug || !webs || !Array.isArray(webs)) return null;

    const site = webs.find(web => web.id === siteSlug);

    return (
        <span className='dashboard-header__title' onClick={() => {
            openChangeModalSettings(site);
        }}>{site?.Name || 'SITE'}</span>
    );
}