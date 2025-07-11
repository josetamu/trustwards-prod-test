import './ModalAccount.css';

import { useEffect, useState } from 'react';
import { useRef } from 'react';

// Modal Account is a modal that allows the user to change their profile information.
export function ModalAccount({ user, openChangeModal, checkProfilePicture, profileStyle }) {
  //states to save user data
  const [Name, setName] = useState(user?.Name);
  const [email, setEmail] = useState(user?.Email);
  const [errors, setErrors] = useState({});

  //Function to open local files
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open local files
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      //file upload logic here
      console.log('File selected:', file);
     /*  if(!file.type.startsWith('image/')){
        setErrors({
          file: 'The file must be an image'
        });
        return;
      }
      if(file.size > 5 * 1024 * 1024){
        setErrors({
          file: 'The file must be less than 5MB'
        });
        return;
      } */
      
      
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


  //function to reset password
  /* const resetPassword = async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'http://localhost:5173/reset-password'
      });
  } */

  //function to logout
/*   const userLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if(error) throw error;
    setUser(null);
    setUserSettings(null); 

   
    await supabase.auth.signOut();
    window.location.reload(); // o redirige a login 

    console.log('logout');
    window.location.reload();
    
      
  } */

  return (
      <>
       <div className="modalAccount">
        <div className="modalAccount__aside">
          <div className="modalAccount__header">
            <span className={`modalAccount__color ${checkProfilePicture(user) === '' ? '' : 'modalAccount__color--null'}`} 
              style={profileStyle(user)}>
              {user?.Name.charAt(0)}
            </span>
            <img className={`modalAccount__avatar ${checkProfilePicture(user) === '' ? 'modalAccount__avatar--null' : ''}`} src={user?.["Avatar URL"]} alt="logo" />
            <span className='modalAccount__edit' onClick={handleEditClick}>Edit</span>
          </div>
        </div>
        <div className="modalAccount__main">
          <div className="modalAccount__section">
            <span className='modalAccount__title'>Name</span>  
            <span className='modalAccount__field'>{user?.Name}</span>
            <span className='modalAccount__change' onClick={() => handleChangeType('name')}>Change name</span>
          </div>
          <div className="modalAccount__divider"></div>
          <div className="modalAccount__section">
            <span className='modalAccount__title'>Email</span>  
            <span className='modalAccount__field'>{user?.Email}</span>
            <span className='modalAccount__change' onClick={() => handleChangeType('email')}>Change email</span>
          </div>
          <div className="modalAccount__divider"></div>
          <div className="modalAccount__section">
            <span className='modalAccount__title'>Password</span>  
            <span className='modalAccount__change' onClick={() => handleChangeType('password')}>Change password</span>
          </div>
        </div>
        {/* Hidden input to open file selector */}
        <input className='modalAccount__fileInput'
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
       </div>
      </>
  )
}

