import './Profile.css';
import { supabase } from '../../supabase/supabaseClient';
import { useEffect, useState } from 'react';

// Modal profile
export function Profile({ setUserSettings,user}) {
    /* const [loading, setLoading] = useState(true); */
/*     const [user, setUser] = useState(null);

    const _loginDevUser = async () => {
        await supabase.auth.signInWithPassword({
          email: 'oscar.abad.brickscore@gmail.com', 
          password: 'TW.141109'
        });
      };
    
      const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.log(error);
        } else {
            setUser(data.user);
            setLoading(false); 
        }
    }; */
/* 
    useEffect(() => {
        _loginDevUser();
        getUser(); 
    }, []);  */

  /*   if (loading || !user) {
        return <div>Loading user...</div>;
    } */
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
        <div className="profile" onClick={() => setUserSettings(null)}>
            <div className="profile__modal" onClick={(e) => e.stopPropagation()}>
                <div className="profile__banner">

                </div>
                <div className="profile__header">
                        <div className="profile__avatar">
                            <img className="profile__avatar__img" src="https://cdn-icons-png.flaticon.com/512/1308/1308845.png" alt="User" />
                            <svg className="profile__avatar__svg" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.07202 1.99478L5.53925 1.52753C5.79732 1.26947 6.21572 1.26947 6.47378 1.52753C6.73182 1.78558 6.73182 2.20398 6.47378 2.46203L6.00652 2.92929M5.07202 1.99478L2.32739 4.73942C1.97896 5.08785 1.80474 5.26205 1.68611 5.47435C1.56747 5.68665 1.44812 6.18795 1.33398 6.66732C1.81335 6.55318 2.31465 6.43382 2.52695 6.31518C2.73925 6.19655 2.91346 6.02235 3.2619 5.67392L6.00652 2.92929M5.07202 1.99478L6.00652 2.92929" stroke="#696969" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path opacity="0.4" d="M3.66602 6.66602H5.66602" stroke="#696969" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>

                        </div> 
                        <span className="profile__header__name">{user?.user_metadata?.display_name || 'Name'}</span>
                        <span className="profile__header__email">{user?.email || 'Email'}</span>
                      
                 
                </div>
                <div className="profile__body">
                    <div className="profile__row">
                        <span className="profile__row__span">Name</span>
                        <div className="profile__input">
                            <input className="profile__label profile__label__name" type="text" placeholder={`${user?.user_metadata?.display_name || 'Name'}`} />
                            <input className="profile__label profile__label__name" type="text" placeholder="Last name" />
                        </div>
                    </div>
                    <div className="profile__row">
                        <span className="profile__row__span">Email</span>
                        <div className="profile__input">
                            <input className="profile__label" type="text" placeholder={`${user?.email || 'example@email.com'}`} />
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
                    <button className="profile__footer__logout">Log out</button>
                    <button className="profile__footer__save">Save</button>
                </div>
            </div>
        </div>
    )
}

