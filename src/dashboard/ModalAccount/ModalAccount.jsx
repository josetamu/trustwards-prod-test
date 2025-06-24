import './ModalAccount.css';
import { supabase } from '../../supabase/supabaseClient';
import { useEffect, useState } from 'react';
import { Tooltip } from '../Tooltip/Tooltip';
import { ModalAvatar } from '../ModalAvatar/ModalAvatar';
import logoDefault from '../../assets/logo default.png';
import { defaultGradient } from '../ModalContainer/ModalContainer';

// Modal profile
export function Profile({ user, setUser, setIsModalOpen }) {
  //states to save user data
  const [firstName, setFirstName] = useState(user?.["First Name"]);
  const [secondName, setSecondName] = useState(user?.["Second Name"]);
  const [email, setEmail] = useState(user?.Email);
  const [errors, setErrors] = useState({});
  const [showEdit, setShowEdit] = useState(false);

  // Avatar and header state
  const [customHeader, setCustomHeader] = useState({
    avatar: null,
    headerGradient: defaultGradient
  });
  
  // Avatar changes logic
  const handleEditSave = (editData) => {
    setCustomHeader({
      avatar: editData.avatar,
      headerGradient: editData.headerGradient
    });
    setShowEdit(false);
  };

  //useEffect to set user data
  useEffect(() => {
    if(user){
      setFirstName(user?.["First Name"]);
      setSecondName(user?.["Second Name"]);
      setEmail(user?.Email);
      setErrors({});
    }
  }, [user]);

  // Initialize customHeader with user avatar
  useEffect(() => {
    if (user) {
      const initializeHeader = async () => {
        let headerGradient = defaultGradient;
        
        if (user["Avatar URL"]) {
          try {
            // Extract colors from the existing avatar to generate the gradient
            const extractColorsFromImage = (imgSrc) => {
              return new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.onload = () => {
                  const MAX_SIZE = 100;
                  const scale = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height);
                  const width = Math.round(img.width * scale);
                  const height = Math.round(img.height * scale);

                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d', { willReadFrequently: true });
                  canvas.width = width;
                  canvas.height = height;
                  ctx.drawImage(img, 0, 0, width, height);

                  const imageData = ctx.getImageData(0, 0, width, height).data;
                  
                  const getPixelColor = (x, y) => {
                    const i = (Math.round(y) * width + Math.round(x)) * 4;
                    return `rgb(${imageData[i]}, ${imageData[i + 1]}, ${imageData[i + 2]})`;
                  };

                  const colors = {
                    top: getPixelColor(width / 2, 2),
                    right: getPixelColor(width - 2, height / 2),
                    bottom: getPixelColor(width / 2, height - 2),
                    left: getPixelColor(2, height / 2),
                    center: getPixelColor(width / 2, height / 2)
                  };

                  resolve(colors);
                };
                img.src = imgSrc;
              });
            };

            const createGradientFromColors = (colors) => {
              return `linear-gradient(135deg, 
                ${colors.top} 0%, 
                ${colors.right} 25%, 
                ${colors.center} 50%,
                ${colors.left} 75%, 
                ${colors.bottom} 100%
              )`;
            };

            const colors = await extractColorsFromImage(user["Avatar URL"]);
            headerGradient = createGradientFromColors(colors);
          } catch (error) {
            console.error('Error extracting colors from avatar:', error);
          }
        }

        setCustomHeader({
          avatar: user["Avatar URL"] ? { src: user["Avatar URL"] } : null,
          headerGradient: headerGradient
        });
      };

      initializeHeader();
    }
  }, [user]);

  // Validate inputs
  const validateInputs = () => {
    const newErrors = {};
    if (!firstName?.trim()) {
      newErrors.firstName = 'Name is required';
    }
    if (!secondName?.trim()) {
      newErrors.secondName = 'Name is required';
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
    if (field === 'firstName') {
      setFirstName(value);
      if (value.trim()) {
        setErrors(prev => ({ ...prev, firstName: undefined }));
      }
    } else if (field === 'secondName') {
      setSecondName(value);
      if (value.trim()) {
        setErrors(prev => ({ ...prev, secondName: undefined }));
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
        "First Name": firstName.trim(),
        "Second Name": secondName.trim(),
        Email: email.trim(),
        "Avatar URL": customHeader.avatar?.src || user?.["Avatar URL"] || null
      }).eq('id', user?.id);

    if(error) throw error;

    setUser({
      ...user,
      "First Name": firstName.trim(),
      "Second Name": secondName.trim(),
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

  // Conditional render of the modal avatar
  if (showEdit) {
    return <ModalAvatar 
      onClose={() => setShowEdit(false)} 
      onSave={handleEditSave}
      initialState={{
        avatar: customHeader.avatar,
        headerGradient: customHeader.headerGradient
      }}
    />;
  }

  return (
      <>
       <div className="modalAccount">
        <div className="modalAccount__aside">
          <div className="modalAccount__header">
            <img className='modalAccount__avatar' src={user?.["Avatar URL"]} alt="logo" />
            <span className='modalAccount__edit'>Edit</span>
          </div>
        </div>
        <div className="modalAccount__main">
          <div className="modalAccount__section">
            <span className='modalAccount__title'>Name</span>  
            <span className='modalAccount__field'>{user?.Name}</span>
            <span className='modalAccount__change'>Change name</span>
          </div>
          <div className="modalAccount__section">
            <span className='modalAccount__title'>Name</span>  
            <span className='modalAccount__field'>{user?.Email}</span>
            <span className='modalAccount__change'>Change name</span>
          </div>
          <div className="modalAccount__section">
            <span className='modalAccount__title'>Name</span>  
            <span className='modalAccount__change'>Change name</span>
          </div>
        </div>
       </div>
      </>
  )
}

