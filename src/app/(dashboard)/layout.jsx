import '@app/root.css'
import './dashboard.css'
import 'react-day-picker/style.css';

import { DashboardUI } from './DashboardUI';
import { supabaseServer } from '@supabase/supabaseServer';

async function DashboardLayout({ children }) {
  const supabase = await supabaseServer();
  
  // Get the current user
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  // Initialize data as null
  let initialUser = null;
  let initialWebs = [];
  let initialAppearance = null;

  // If user is authenticated, fetch their data
  if (authUser) {
    const [userResult, sitesResult, appearanceResult] = await Promise.allSettled([
      supabase.from('User').select('*').eq('id', authUser.id).single(),
      supabase.from('Site').select('*').eq('userid', authUser.id),
      supabase.from('Appearance').select('*').eq('userid', authUser.id).single()
    ]);

    initialUser = userResult.status === 'fulfilled' && !userResult.value.error ? userResult.value.data : null;
    initialWebs = sitesResult.status === 'fulfilled' && !sitesResult.value.error ? sitesResult.value.data : [];
    initialAppearance = appearanceResult.status === 'fulfilled' && !appearanceResult.value.error ? appearanceResult.value.data : null;
  }

  return (
    <DashboardUI 
      initialUser={initialUser}
      initialWebs={initialWebs}
      initialAppearance={initialAppearance}
      authUserId={authUser?.id}
      initialSidebarState={initialAppearance?.Sidebar ?? null}
    >
      {children}
    </DashboardUI>
  );
}

export default DashboardLayout