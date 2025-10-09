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

    const handleImgEditClick = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click(); // Open local files
        }
      };
    
      const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          //check if file is an image
          if(!file.type.startsWith('image/')){
            setErrors({
              file: 'The file must be an image'
            });
            return;
          }
          //check if file is less than 5MB
          if(file.size > 5 * 1024 * 1024){
            setErrors({
              file: 'The file must be less than 5MB'
            });
            return;
          }
          
    
          setErrors({});
    
          try {
            //Generate a unique file name
            const fileExtension = file.name.split('.').pop();
            const fileName = `${site.id}-${Date.now()}.${fileExtension}`;
    
            //Upload file to supabase
            const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatar')
            .upload(fileName, file);
    
            if(uploadError){
              throw uploadError;
            }
            //Get public url of the file
            const { data: { publicUrl } } = supabase.storage
            .from('avatar')
            .getPublicUrl(fileName);
    
            //Update site avatar in database
            const { data: updateData, error: updateError } = await supabase
            .from('Site')
            .update({ "Avatar URL": publicUrl })
            .eq('id', site.id)
            .select()
            .single();
    
            if(updateError){
              throw updateError;
            }
    
            // Update the siteData state to reflect the new avatar
            setSiteData(prev => ({
              ...prev,
              "Avatar URL": publicUrl
            }));
            // Clear the file input
            if(fileInputRef.current){
              fileInputRef.current.value = '';
            }

            // Update the webs array
            setWebs(prev => prev.map(web => web.id === site.id ? { ...web, ...updateData } : web));
            
            // Update the resource (change the avatar url in the webs array real time)
            if (allUserDataResource) {
              const currentData = allUserDataResource.read();
              currentData.webs = currentData.webs.map(web =>
                  web.id === site.id ? { ...web, ...updateData } : web
              );
            }


            // Clear any previous errors
            setErrors({});
    
            
          } catch (error) {
            console.error('Error uploading file:', error);
            setErrors({ file: 'Failed to upload file' });
          } 
        }
      };

    return (
      <div className='dashboard-header__color-wrapper' style={SiteStyle(site)}>
        <span className={`dashboard-header__color`}>
          {site?.Name?.charAt(0)}
        </span> 
      </div>
    );
}