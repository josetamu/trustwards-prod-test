import './ModalAccount.css';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { supabase } from '@supabase/supabaseClient';

// Modal Account is a modal that allows the user to change their profile information.
export function ModalAccount({ user, openChangeModal, checkProfilePicture, profileStyle, setUser, allUserDataResource }) {
  //states to save user data
  const [Name, setName] = useState(user?.Name);
  const [email, setEmail] = useState(user?.Email);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  //Function to open local files
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open local files
    }
  };

  //Function to upload the avatar image to supabase and update avatar url in the database
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
      
      setIsUploading(true);
      setErrors({});

      try {
        //Generate a unique file name that includes the user ID
        const fileExtension = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExtension}`;

        //Upload file to supabase
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatar')
          .upload(fileName, file, {
            upsert: true,
          });

        if (uploadError) {
          console.error('Error al subir el archivo:', JSON.stringify(uploadError, null, 2));
          setErrors({ file: 'No se pudo subir el archivo. Verifica los permisos o el bucket.' });
          setIsUploading(false);
          return;
        }

        //Get public url of the file
        const { data: { publicUrl } } = supabase.storage
          .from('avatar')
          .getPublicUrl(fileName);

        //Update user avatar in database with public URL
        const { data: updateData, error: updateError } = await supabase
          .from('User')
          .update({ "Avatar URL": publicUrl })
          .eq('id', user.id);

        if(updateError){
          throw updateError;
        }
        // Update local user state with the new avatar URL
        const updatedUser = { 
          ...user, 
          "Avatar URL": publicUrl 
        };
        setUser(updatedUser);
        if (allUserDataResource) {
            allUserDataResource.read().user = updatedUser;
        }

        // Clear the file input
        if(fileInputRef.current){
          fileInputRef.current.value = '';
        }



      } catch (error) {
        console.error('Error uploading file:', error);
        setErrors({ file: 'Failed to upload file' }); 
      } finally {
        setIsUploading(false);
      }
    }
  };

  //Function to open change modal
  const handleChangeType = (type) => {
    openChangeModal(type);
  };

  //useEffect to set user data from database and be dynamic data
  useEffect(() => {
    if(user){
      setName(user?.Name);
      setEmail(user?.Email);
      setErrors({});
    }
  }, [user]);

  return (
      <>
       <div className="modal-account">
        <div className="modal-account__aside">
          <div className="modal-account__header">
            <span className={`modal-account__color ${checkProfilePicture(user) === '' ? '' : 'modal-account__color--null'}`} 
              style={profileStyle(user)}>
              {user?.Name.charAt(0)}
            </span>
            <img className={`modal-account__avatar ${checkProfilePicture(user) === '' ? 'modal-account__avatar--null' : ''}`} src={user?.["Avatar URL"]} alt="logo" />
            <span className='modal-account__edit' onClick={handleEditClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleEditClick(); } }} tabIndex={0}  aria-label="Edit profile picture">Edit</span>
          </div>
        </div>
        <div className="modal-account__main">
          <div className="modal-account__section">
            <span className='modal-account__title'>Name</span>  
            <span className='modal-account__field'>{user?.Name}</span>
            <span className='modal-account__change' onClick={() => handleChangeType('name')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleChangeType('name'); } }} tabIndex={0}  aria-label="Change name">Change name</span>
          </div>
          <div className="modal-account__divider"></div>
          <div className="modal-account__section">
            <span className='modal-account__title'>Email</span>  
            <span className='modal-account__field'>{user?.Email}</span>
            <span className='modal-account__change' onClick={() => handleChangeType('email')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleChangeType('email'); } }} tabIndex={0}  aria-label="Change email">Change email</span>
          </div>
          <div className="modal-account__divider"></div>
          <div className="modal-account__section">
            <span className='modal-account__title'>Password</span>  
            <span className='modal-account__change' onClick={() => handleChangeType('password')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleChangeType('password'); } }} tabIndex={0}  aria-label="Change password">Change password</span>
          </div>
        </div>
        {/* Hidden input to open file selector */}
        <input className='modal-account__file-input'
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          tabIndex={-1}
        />
       </div>
      </>
  )
}

