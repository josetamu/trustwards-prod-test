import { useState, useRef } from 'react';
import { supabase } from '../../../supabase/supabaseClient';
import './BuilderHeader.css';
import { useCanvas } from '@contexts/CanvasContext';
export default function BuilderHeader({site, setSite, setModalType, setIsModalOpen, checkSitePicture, SiteStyle, openChangeModalSettings}) {
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const { undo, redo, canUndo, canRedo } = useCanvas();




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
      <div className="tw-builder__header">
        <div className="tw-builder__header-settings">
          <div className="tw-builder__header-setting" onClick={() => {
            setModalType('Builder');
            setIsModalOpen(true);
          }}>
            <div className="tw-builder__header-setting-icon">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M5.80009 1.33846C5.61049 1.31307 5.45065 1.36792 5.34183 1.4154C5.24179 1.45906 5.12893 1.52278 5.01945 1.5846L3.52001 2.4436C3.42281 2.51236 3.29145 2.62184 3.21606 2.79898C3.13375 2.99238 3.16031 3.1873 3.17986 3.30004C3.20102 3.42204 3.24491 3.59 3.28692 3.75074C3.55108 4.76195 2.9058 5.84976 1.86122 6.12971L1.84282 6.13464C1.68478 6.17698 1.53669 6.21665 1.42088 6.2584C1.31253 6.29747 1.13145 6.3708 1.00385 6.53635C0.88658 6.68847 0.855494 6.85527 0.84326 6.97327C0.83198 7.08214 0.832007 7.21234 0.832034 7.339V8.65847C0.832007 8.78514 0.83198 8.91534 0.84326 9.0242C0.855494 9.1422 0.886574 9.30894 1.00383 9.46107C1.13143 9.6266 1.31251 9.69994 1.42085 9.739C1.53666 9.7808 1.86119 9.86774 1.86119 9.86774C2.90539 10.1477 3.55024 11.2353 3.28591 12.2466C3.28591 12.2466 3.19998 12.5753 3.17881 12.6973C3.15925 12.81 3.13268 13.0049 3.21497 13.1983C3.29036 13.3755 3.42172 13.485 3.51893 13.5538L5.01838 14.4128C5.12783 14.4746 5.24078 14.5383 5.3408 14.582C5.44963 14.6295 5.60949 14.6843 5.79909 14.6589C6.00521 14.6313 6.15799 14.5137 6.24585 14.4402C6.33913 14.3622 6.57369 14.1295 6.57369 14.1295C6.96263 13.7437 7.48063 13.5507 7.9987 13.5506C8.51677 13.5507 9.03477 13.7437 9.4237 14.1295C9.4237 14.1295 9.6583 14.3622 9.75157 14.4402C9.83943 14.5137 9.99217 14.6313 10.1983 14.6589C10.3879 14.6843 10.5478 14.6295 10.6566 14.582C10.7566 14.5383 10.8695 14.4746 10.979 14.4128L12.4784 13.5538C12.5757 13.485 12.707 13.3755 12.7824 13.1983C12.8647 13.0049 12.8382 12.81 12.8186 12.6973C12.7974 12.5753 12.7115 12.2466 12.7115 12.2466C12.4472 11.2353 13.092 10.1477 14.1362 9.86774C14.1362 9.86774 14.4608 9.7808 14.5766 9.739C14.6849 9.69994 14.866 9.6266 14.9936 9.46107C15.1108 9.30894 15.1419 9.1422 15.1542 9.0242C15.1654 8.91534 15.1654 8.78514 15.1654 8.65847V7.339C15.1654 7.21234 15.1654 7.08214 15.1542 6.97327C15.1419 6.85527 15.1108 6.68847 14.9936 6.53635C14.866 6.3708 14.6849 6.29747 14.5765 6.2584C14.4607 6.21665 14.3126 6.17698 14.1546 6.13464L14.1362 6.12971C13.0916 5.84976 12.4463 4.76195 12.7105 3.75074C12.7525 3.59 12.7964 3.42204 12.8176 3.30004C12.8371 3.1873 12.8636 2.99238 12.7814 2.79898C12.706 2.62184 12.5746 2.51236 12.4774 2.4436L10.978 1.5846C10.8684 1.52278 10.7556 1.45906 10.6556 1.4154C10.5468 1.36792 10.3869 1.31307 10.1973 1.33846C9.99123 1.36606 9.83843 1.48369 9.75057 1.55714C9.6573 1.63512 9.4227 1.8678 9.4227 1.8678C9.03397 2.25323 8.51637 2.44602 7.9987 2.44616C7.48103 2.44602 6.96343 2.25323 6.57473 1.8678C6.57473 1.8678 6.34012 1.63512 6.24684 1.55714C6.15899 1.48369 6.00619 1.36606 5.80009 1.33846ZM7.9987 10.332C9.28737 10.332 10.332 9.28734 10.332 7.99867C10.332 6.71 9.28737 5.66536 7.9987 5.66536C6.71003 5.66536 5.66537 6.71 5.66537 7.99867C5.66537 9.28734 6.71003 10.332 7.9987 10.332Z" fill="#999999"/>
              </svg>
            </div>
          </div>
          <div className="tw-builder__header-divider"></div>
          <div className="tw-builder__header-user">
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
          </div>
          <div className="tw-builder__header-divider"></div>
          <div className="tw-builder__header-controls">
            <div className="tw-builder__header-control" onClick={canUndo ? undo : () => {}} style={{opacity: canUndo ? 1 : 0.5}}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.11803 1.59802C3.35624 1.41705 3.40265 1.07724 3.22168 0.83903C3.04072 0.600816 2.70091 0.554411 2.46269 0.735377L1.83772 1.21016L1.80526 1.23482C1.31908 1.60413 0.907954 1.91643 0.623644 2.20443C0.324741 2.50722 0.0820312 2.86504 0.0820312 3.33336C0.0820312 3.80169 0.324741 4.15951 0.623644 4.46228C0.907954 4.75028 1.31907 5.06261 1.80526 5.43191L2.46269 5.93133C2.70091 6.1123 3.04072 6.06593 3.22168 5.82771C3.40265 5.58948 3.35624 5.2497 3.11803 5.06873L2.49306 4.5939C2.09413 4.29087 1.79801 4.06496 1.58079 3.875H7.1237C8.61946 3.875 9.83203 5.08758 9.83203 6.58333C9.83203 8.07909 8.61946 9.29167 7.1237 9.29167H4.95703C4.65787 9.29167 4.41536 9.53417 4.41536 9.83333C4.41536 10.1325 4.65787 10.375 4.95703 10.375H7.1237C9.21778 10.375 10.9154 8.67742 10.9154 6.58333C10.9154 4.48925 9.21778 2.79167 7.1237 2.79167H1.58086C1.79807 2.60172 2.09418 2.37583 2.49306 2.0728L3.11803 1.59802Z" fill="#999999"/>
              </svg>
            </div>
            <div className="tw-builder__header-control" onClick={canRedo ? redo : () => {}} style={{opacity: canRedo ? 1 : 0.5}}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.88197 1.59802C7.64376 1.41705 7.59735 1.07724 7.77832 0.83903C7.95928 0.600816 8.29909 0.554411 8.53731 0.735377L9.16228 1.21016L9.19474 1.23482C9.68092 1.60413 10.092 1.91643 10.3764 2.20443C10.6753 2.50722 10.918 2.86504 10.918 3.33336C10.918 3.80169 10.6753 4.15951 10.3764 4.46228C10.092 4.75028 9.68093 5.06261 9.19474 5.43191L8.53731 5.93133C8.29909 6.1123 7.95928 6.06593 7.77832 5.82771C7.59735 5.58948 7.64376 5.2497 7.88197 5.06873L8.50694 4.5939C8.90587 4.29087 9.20199 4.06496 9.41921 3.875H3.8763C2.38054 3.875 1.16797 5.08758 1.16797 6.58333C1.16797 8.07909 2.38054 9.29167 3.8763 9.29167H6.04297C6.34213 9.29167 6.58464 9.53417 6.58464 9.83333C6.58464 10.1325 6.34213 10.375 6.04297 10.375H3.8763C1.78222 10.375 0.0846367 8.67742 0.0846367 6.58333C0.0846367 4.48925 1.78222 2.79167 3.8763 2.79167H9.41914C9.20193 2.60172 8.90582 2.37583 8.50694 2.0728L7.88197 1.59802Z" fill="#999999"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    )
}