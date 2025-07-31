import { useState, useRef } from 'react';
import { supabase } from '../../../supabase/supabaseClient';
import './BuilderHeader.css';
export default function BuilderHeader({site, setSite, setModalType, setIsModalOpen, checkSitePicture, SiteStyle, openChangeModalSettings}) {
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);
    // Avatar's colors pool


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
        console.log(updateData);

        setSite(prev => ({
          ...prev,
          "Avatar URL": publicUrl
        }));
        // Clear any previous errors
        setErrors({});

        
      } catch (error) {
        console.error('Error uploading file:', error);
        setErrors({ file: 'Failed to upload file' });
      } 
    }
  };

    return (
        <>
            <div className='tw-builder__header-avatar'>
                <span className={`tw-builder__header-color ${checkSitePicture(site) === '' ? '' : 'tw-builder__header-color--null'}`} 
                        style={SiteStyle(site)} onClick={handleImgEditClick} >
                        {site?.Name?.charAt(0)}
                    </span> 
                    <img className={`tw-builder__header-img ${checkSitePicture(site) === '' ? 'tw-builder__header-img--null' : ''}`} src={site?.["Avatar URL"]} alt={site?.Name} onClick={handleImgEditClick}/> 
                                    {/* Hidden input to open file selector */}
                <input className='tw-builder__header-input'
                type="file"
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*"
                
                />
            <span className='tw-builder__header-title' onClick={() => {
                openChangeModalSettings(site);
            }}>{site?.Name || 'SITE'}</span> 
            </div>
            <span className={`tw-builder__header-plan ${site?.Plan === 'Pro' ? 'tw-builder__header-plan--pro' : ''}`} onClick={() => {
              setModalType('Plan');
              setIsModalOpen(true);
            }}>
                {site?.Plan || 'Free'}
            </span>
        </>
    )
}