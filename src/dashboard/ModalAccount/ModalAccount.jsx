import './ModalAccount.css';
import { supabase } from '../../supabase/supabaseClient';
import { useEffect, useState } from 'react';
import { Tooltip } from '../Tooltip/Tooltip';
import { useRef } from 'react';

// Modal profile
export function ModalAccount({ user, setUser, setIsModalOpen, setModalType, openChangeModal }) {
  //states to save user data
  const [Name, setName] = useState(user?.Name);
  const [email, setEmail] = useState(user?.Email);
  const [errors, setErrors] = useState({});

  //Function to open files
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Abrir selector de archivos
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload logic here
      console.log('File selected:', file);
    }
  };

  //Function to open change modal
  const handleChangeType = (type) => {
    openChangeModal(type);
  };

  //useEffect to set user data
  useEffect(() => {
    if(user){
      setName(user?.Name);
      setEmail(user?.Email);
      setErrors({});
    }
  }, [user]);

  // Validate inputs
  const validateInputs = () => {
    const newErrors = {};
    if (!Name?.trim()) {
      newErrors.Name = 'Name is required';
    }
    if (!email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@') || !email.includes('.') || email.indexOf('@') > email.lastIndexOf('.')) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input editing and clear errors when input is valid
  const handleInputEdit = (field, value) => {
    if (field === 'Name') {
      setName(value);
      if (value.trim()) {
        setErrors(prev => ({ ...prev, Name: undefined }));
      }
    } else if (field === 'email') {
      setEmail(value);
      if (value.trim() /* && value.includes('@') && value.includes('.') */) {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }
  };

  //function to update user data
  const updateUser = async () => {
    if (!validateInputs()) {
      return false;
    }

    const { data, error } = await supabase
      .from('User')
      .update({
        Name: Name.trim(),
        Email: email.trim(),
        "Avatar URL": customHeader.avatar?.src || user?.["Avatar URL"] || null
      }).eq('id', user?.id);

    if(error) throw error;

    setUser({
      ...user,
      Name: Name.trim(),
      Email: email.trim(),
      "Avatar URL": customHeader.avatar?.src || user?.["Avatar URL"] || null
    });
    return true;
  };

  //function to reset password
  /* const resetPassword = async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'http://localhost:5173/reset-password'
      });
  } */
  /* function to handle key press */
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const success = await updateUser();
      if (success) {
        setIsModalOpen(false);
      }
    }
  };

  //function to logout
  const userLogout = async () => {
    /* const { error } = await supabase.auth.signOut();
    if(error) throw error;
    setUser(null);
    setUserSettings(null); */

   
    /* await supabase.auth.signOut();
    window.location.reload(); // o redirige a login */

    console.log('logout');
    window.location.reload();
    
      
  }

  return (
      <>
       <div className="modalAccount">
        <div className="modalAccount__aside">
          <div className="modalAccount__header">
            <img className='modalAccount__avatar' src={user?.["Avatar URL"]} alt="logo" />
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

