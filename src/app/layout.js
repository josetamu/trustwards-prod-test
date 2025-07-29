import { ThemeProvider } from 'next-themes';
import { supabase } from '../supabase/supabaseClient';
import { SidebarSettingsProvider } from '../contexts/SidebarSettingsContext';


export default async function RootLayout({ children }) {
    //When login page is made, replace this and get the current user via the created Cookie (supabase helper) and remove the forced login in the dashboard layout

    //Force login (only dev mode)
    const _loginDevUser = async () => {
        await supabase.auth.signInWithPassword({
        /* emails: 'darezo.2809@gmail.com', 'oscar.abad.brickscore@gmail.com', 'jose11tamu@gmail.com'*/
        email: 'darezo.2809@gmail.com',  
        password: 'TW.141109'
        });
    };
    await _loginDevUser();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Only fetch appearance data if user is authenticated
    let initialSidebarState = null;
    if (user) {
        const { data: appearance } = await supabase
        .from('Appearance')
        .select('*')
        .eq('userid', user.id)
        .single();

    if (appearance) {
        // Remove the window check from server-side
        initialSidebarState = appearance?.Sidebar; 
    }
      
   }
   
    return (
        <html lang="en" suppressHydrationWarning> 
            <head>
                <title>React App with Next.js</title>
            </head>
            <body>
                <ThemeProvider>
                    <SidebarSettingsProvider initialState={initialSidebarState}>
                        <div id="root">{children}</div>
                    </SidebarSettingsProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}