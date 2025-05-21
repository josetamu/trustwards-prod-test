

import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';


export function Settings({ onClose }) {
    const [loading, setLoading] = useState(true);
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

    if (loading || !user) {
        return <div>Loading user...</div>;
    }

    return (
        <div className="settingsUser">
            <div className='settingsUser__modal'>
            <h1 className="settingsUser__title">Settings</h1>
            <table className="settingsUser__table">
                <thead className="settingsUser__table-header">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className='settingsUser__table-body'>
                    <tr>
                        <td>{user.user_metadata?.display_name}</td>
                        <td>{user.email}</td>
                        <td>
                            <button>Save</button>
                        </td>
                    </tr>
                </tbody>
                
            </table>
            </div>   
        </div>
    );
} 