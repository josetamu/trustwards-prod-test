import { useEffect, useState } from 'react';
import { supabase } from '../../../supabase/supabaseClient';

export const UserName = ({ user }) => {



    return (
        <span className="user__name">{user?.Name}</span> 
    )
}