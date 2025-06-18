import './Profile.css';
import { supabase } from '../../supabase/supabaseClient';
import { useEffect, useState } from 'react';
import { Tooltip } from '../tooltip/Tooltip';
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
        <div className="profile__banner" style={{ background: customHeader.headerGradient }}>

        </div>
        <div className="profile__header">
          <div className="profile__avatar">
            {customHeader.avatar
              ? <img className="profile__avatar__img" src={customHeader.avatar.src} alt="User" />
              : <img className="profile__avatar__img" src={user?.["Avatar URL"] || logoDefault} alt="User" />
            }
            <svg 
              className="profile__avatar__svg" 
              width="8" 
              height="8" 
              viewBox="0 0 8 8" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setShowEdit(true)}
            >
              <path d="M5.07202 1.99478L5.53925 1.52753C5.79732 1.26947 6.21572 1.26947 6.47378 1.52753C6.73182 1.78558 6.73182 2.20398 6.47378 2.46203L6.00652 2.92929M5.07202 1.99478L2.32739 4.73942C1.97896 5.08785 1.80474 5.26205 1.68611 5.47435C1.56747 5.68665 1.44812 6.18795 1.33398 6.66732C1.81335 6.55318 2.31465 6.43382 2.52695 6.31518C2.73925 6.19655 2.91346 6.02235 3.2619 5.67392L6.00652 2.92929M5.07202 1.99478L6.00652 2.92929" stroke="#696969" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path opacity="0.4" d="M3.66602 6.66602H5.66602" stroke="#696969" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div> 
          <span className="profile__header__name">{user?.["First Name"]} {user?.["Second Name"] || 'User'}</span>
          <span className="profile__header__email">{user?.Email || 'Email'}</span>
        </div>
        <div className="profile__body" onKeyDown={handleKeyPress}>
          <div className="profile__row">
            <span className="profile__row__span">Name</span>
            <div className="profile__input">
              <div className="profile__input-wrapper">
                <input 
                  className="profile__label profile__label__name" 
                  type="text" 
                  /* placeholder={`${user?.["First Name"] || 'FirstName'}`}  */
                  value={firstName} 
                  onChange={(e) => handleInputEdit('firstName', e.target.value)}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {errors.firstName && (
                  <Tooltip 
                    message={errors.firstName} 
                    id="firstName-error"
                    responsivePosition={{ desktop: 'top', mobile: 'top' }}
                    type='alert'
                  />
                )}
              </div>
              <div className="profile__input-wrapper">
                <input 
                  className="profile__label profile__label__name" 
                  type="text" 
                  /* placeholder={`${user?.["Second Name"] || 'Second Name'}`}  */
                  value={secondName} 
                  onChange={(e) => handleInputEdit('secondName', e.target.value)}
                  aria-invalid={!!errors.secondName}
                  aria-describedby={errors.secondName ? 'secondName-error' : undefined}
                />
                {errors.secondName && (
                  <Tooltip 
                    message={errors.secondName} 
                    id="secondName-error"
                    responsivePosition={{ desktop: 'top', mobile: 'top' }}
                    type='alert'
                  />
                )}
              </div>
            </div>
          </div>
          <div className="profile__row">
            <span className="profile__row__span">Email</span>
            <div className="profile__input">
              <div className="profile__input-wrapper">
                <input 
                  className="profile__label" 
                  type="text" 
                 /*  placeholder={`${user?.Email || 'example@email.com'}`} */ 
                  value={email} 
                  onChange={(e) => handleInputEdit('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <Tooltip 
                    message={errors.email} 
                    id="email-error"
                    responsivePosition={{ desktop: 'bottom', mobile: 'bottom' }}
                    type='alert'
                  />
                )}
              </div>
            </div>
          </div>
          <div className="profile__row profile__row--last">
            <span className="profile__row__span">Password</span>
            <div className="profile__input">
              <button className="profile__input__button">Send link</button>
            </div>    
          </div>
        </div>
        <div className="profile__footer">
         {/*  <button className="profile__footer__logout" onClick={userLogout}>Log out</button> */}
          <button className="profile__footer__save" onClick={async () => {
            try {
              const success = await updateUser();
              if (success) {
                setIsModalOpen(false);
              }
            } catch (error) {
              console.error('Error updating user:', error);
              setErrors(prev => ({
                ...prev,
                general: 'Error updating user. Please try again.'
              }));
            }
          }}>Save</button>
        </div>
      </>
  )
}

