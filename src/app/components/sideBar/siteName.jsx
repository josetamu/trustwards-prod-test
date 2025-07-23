import { useDashboard } from '../../dashboard/layout'; // Ajusta el import según tu estructura
import UserNameSkeleton from '../Skeletons/UserNameSkeleton';

export const SiteName = ({siteSlug}) => {
  const { allUserDataResource } = useDashboard();

  if (!allUserDataResource) return <UserNameSkeleton />;

  const {webs} = allUserDataResource.read();

  

    
 

  const site = webs.find(web => web.slug === siteSlug);


  return (
    <span className='sidebar__sites__title sidebar__sites__title--site'>{site?.Name || 'SITE'}</span>
  );
};