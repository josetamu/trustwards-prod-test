import './Profile.css';
import { supabase } from '../../supabase/supabaseClient';
import { useEffect, useState } from 'react';
import { Alert } from '../alert/Alert';

// Modal profile
export function Profile({ setUserSettings, user, setUser }) {
  //states to save user data
  const [firstName, setFirstName] = useState(user?.["First Name"]);
  const [secondName, setSecondName] = useState(user?.["Second Name"]);
  const [email, setEmail] = useState(user?.Email);
  const [errors, setErrors] = useState({});

  //useEffect to set user data
  useEffect(() => {
    setFirstName(user?.["First Name"]);
    setSecondName(user?.["Second Name"]);
    setEmail(user?.Email);
    setErrors({});
  }, [user]);

  // Validate inputs
  const validateInputs = () => {
    const newErrors = {};
    if (!firstName?.trim()) {
      newErrors.firstName = 'Please enter your first name';
    }
    if (!secondName?.trim()) {
      newErrors.secondName = 'Please enter your second name';
    }
    if (!email?.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input blur
  const handleInputBlur = (field) => {
    if (field === 'firstName' && !firstName?.trim()) {
      setErrors(prev => ({ ...prev, firstName: 'Please enter your first name' }));
    }
    if (field === 'secondName' && !secondName?.trim()) {
      setErrors(prev => ({ ...prev, secondName: 'Please enter your second name' }));
    }
    if (field === 'email') {
      if (!email?.trim()) {
        setErrors(prev => ({ ...prev, email: 'Please enter your email' }));
      } else if (!email.includes('@') || !email.includes('.')) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    }
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
      if (value.trim() && value.includes('@') && value.includes('.')) {
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
      .from('Users')
      .update({
        "First Name": firstName.trim(),
        "Second Name": secondName.trim(),
        Email: email.trim()
      }).eq('id', user?.id);

    if(error) throw error;

    setUser({
      ...user,
      "First Name": firstName.trim(),
      "Second Name": secondName.trim(),
      Email: email.trim()
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
        setUserSettings(null);
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

  /* function to close profile modal with escape key */
  useEffect(() => {
    const handelEscape = (e) => {
      if(e.key === 'Escape'){
        setUserSettings(null);
      }
    }
    window.addEventListener('keydown', handelEscape);
    return () => {
      window.removeEventListener('keydown', handelEscape);
    }
  }, []);

  return (
    <div className="profile open" onClick={() => setUserSettings(null)}>
      <div className="profile__modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile__banner">

        </div>
        <div className="profile__header">
          <div className="profile__avatar">
            <img className="profile__avatar__img" src="https://cdn-icons-png.flaticon.com/512/1308/1308845.png" alt="User" />
            <svg className="profile__avatar__svg" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.07202 1.99478L5.53925 1.52753C5.79732 1.26947 6.21572 1.26947 6.47378 1.52753C6.73182 1.78558 6.73182 2.20398 6.47378 2.46203L6.00652 2.92929M5.07202 1.99478L2.32739 4.73942C1.97896 5.08785 1.80474 5.26205 1.68611 5.47435C1.56747 5.68665 1.44812 6.18795 1.33398 6.66732C1.81335 6.55318 2.31465 6.43382 2.52695 6.31518C2.73925 6.19655 2.91346 6.02235 3.2619 5.67392L6.00652 2.92929M5.07202 1.99478L6.00652 2.92929" stroke="#696969" strokeWidth="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path opacity="0.4" d="M3.66602 6.66602H5.66602" stroke="#696969" strokeWidth="1.5" stroke-linecap="round"/>
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
                  placeholder={`${user?.["First Name"] || 'FirstName'}`} 
                  value={firstName} 
                  onChange={(e) => handleInputEdit('firstName', e.target.value)}
                  onBlur={() => handleInputBlur('firstName')}
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {errors.firstName && (
                  <Alert 
                    message={errors.firstName} 
                    id="firstName-error"
                    position="bottom"
                  />
                )}
              </div>
              <div className="profile__input-wrapper">
                <input 
                  className="profile__label profile__label__name" 
                  type="text" 
                  placeholder={`${user?.["Second Name"] || 'Second Name'}`} 
                  value={secondName} 
                  onChange={(e) => handleInputEdit('secondName', e.target.value)}
                  onBlur={() => handleInputBlur('secondName')}
                  aria-invalid={!!errors.secondName}
                  aria-describedby={errors.secondName ? 'secondName-error' : undefined}
                />
                {errors.secondName && (
                  <Alert 
                    message={errors.secondName} 
                    id="secondName-error"
                    position="top"
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
                  placeholder={`${user?.Email || 'example@email.com'}`} 
                  value={email} 
                  onChange={(e) => handleInputEdit('email', e.target.value)}
                  onBlur={() => handleInputBlur('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <Alert 
                    message={errors.email} 
                    id="email-error"
                    position="bottom"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="profile__row profile__row--last">
            <span className="profile__row__span">Password</span>
            <div className="profile__input">
              <button className="profile__input__button">Reset link</button>
            </div>    
          </div>
        </div>
        <div className="profile__footer">
         {/*  <button className="profile__footer__logout" onClick={userLogout}>Log out</button> */}
          <button className="profile__footer__save" onClick={async () => {
            try {
              const success = await updateUser();
              if (success) {
                setUserSettings(null);
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
      </div>
    </div>
  )
}

