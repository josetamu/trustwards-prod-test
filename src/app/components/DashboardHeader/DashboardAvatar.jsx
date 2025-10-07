import { useDashboard } from '@dashboard/layout';
import UserAvatarSkeleton from '@components/Skeletons/UserAvatarSkeleton';
import { useState, useRef } from 'react';
import { supabase } from '@supabase/supabaseClient';

export const DashboardAvatar = ({siteSlug, checkSitePicture, SiteStyle, setSiteData}) => {
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    const { allUserDataResource, setWebs } = useDashboard();

    if(!allUserDataResource) return <UserAvatarSkeleton />;

    const {webs} = allUserDataResource.read();

    if(!siteSlug || !webs || !Array.isArray(webs)) return null;
    const site = webs.find(web => web.id === siteSlug);

    return (
      <div className='dashboard-header__color-wrapper' style={SiteStyle(site)}>
        <span className={`dashboard-header__color ${checkSitePicture(site) === '' ? '' : 'dashboard-header__color--null'}`}>
          {site?.Name?.charAt(0)}
        </span> 
      </div>
    );
}