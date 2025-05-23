import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';





export const ProfileDropdown = () => {
    const [user, setUser] = useState(null);

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
    };

    useEffect(() => {
        _loginDevUser();
        getUser(); 
    }, []); 
    return (
        <div className="profileDropdown">
            <div className="profileDropdown__header">
                <img className="profileDropdown__header-avatar" src="https://cdn-icons-png.flaticon.com/512/1308/1308845.png" alt="avatar" />
                <span className="profileDropdown__header-name">{user?.user_metadata?.display_name || 'User'}</span>
            </div>
            <div className="profileDropdown__icons">
                <span className="profileDropdown__icons-down">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.00002 4.5C3.00002 4.5 5.20948 7.49999 6.00003 7.5C6.79058 7.5 9 4.5 9 4.5" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
                <span className="profileDropdown__icons-up">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.00002 7.5C3.00002 7.5 5.20948 4.50001 6.00003 4.5C6.79058 4.5 9 7.5 9 7.5" stroke="#6B6B6B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                </span>
            </div>
        </div>
    )
}

