import { useDashboard } from '@dashboard/layout';
import UserAvatarSkeleton from '@components/Skeletons/UserAvatarSkeleton';
import { useState } from 'react';
import { supabase } from '@supabase/supabaseClient';

export const DashboardAvatar = ({siteSlug, SiteStyle, setSiteData}) => {
    const [errors, setErrors] = useState({});
    const { allUserDataResource, setWebs } = useDashboard();

    if(!allUserDataResource) return <UserAvatarSkeleton />;

    const {webs} = allUserDataResource.read();

    if(!siteSlug || !webs || !Array.isArray(webs)) return null;
    const site = webs.find(web => web.id === siteSlug);



    return (
      
        <span className={`dashboard-header__color`} 
                        style={SiteStyle(site)} >
                        {site?.Name?.charAt(0)}
        </span> 
        
    );
}