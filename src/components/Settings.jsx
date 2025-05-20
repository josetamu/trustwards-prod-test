import { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

/* const _loginDevUser = async () => {
    await supabase.auth.signInWithPassword({
      email: 'oscar.abad.brickscore@gmail.com', 
      password: 'TW.141109'
    });
  };

  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if(error) {
      console.log(error);
    }else{
      const user = data.user;

      console.log('Name:', user.user_metadata.display_name);
      console.log('Email:', user.email);
    }
  };

  useEffect(() => {
    _loginDevUser();
    getUser(); 
  }, []);  */

export function Settings() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase.auth.fetchUsers();

            if (error) {
                console.error('Error fetching users:', error);
                return;
            }

            setUsers(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Cargando usuarios...</div>;
    }

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="users-list">
                {users.map((user) => (
                    <div key={user.email} className="user-card">
                        <h3>{user.user_metadata.display_name}</h3>
                        <p>{user.email}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}