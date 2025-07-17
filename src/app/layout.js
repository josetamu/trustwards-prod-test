import { ThemeProvider } from 'next-themes';
import { supabase } from '../supabase/supabaseClient';

export default async function RootLayout({ children }) {
    /*  Note! If you do not add suppressHydrationWarning to your <html> you will get warnings because next-themes updates that element. 
        This property only applies one level deep, so it won't block hydration warnings on other elements. 
    */
   //Force login (only dev mode)
  const _loginDevUser = async () => {
    await supabase.auth.signInWithPassword({
      /* emails: 'darezo.2809@gmail.com', 'oscar.abad.brickscore@gmail.com', 'jose11tamu@gmail.com'*/
      email: 'oscar.abad.brickscore@gmail.com',  
      password: 'TW.141109'
    });
  };
  await _loginDevUser();
   const { data: { user } } = await supabase.auth.getUser();
   
   // Only fetch appearance data if user is authenticated
   let initialData = null;
   if (user) {
       initialData = await supabase.from('Appearance').select('*').eq('userid', user.id).single();
       console.log(initialData);
       console.log(initialData?.Sidebar);
   }
   
    return (
        <html lang="en" suppressHydrationWarning> 
            <head>
                <title>React App with Next.js</title>
            </head>
            <body>
                <ThemeProvider> {/* Client component from next-themes */}
                    <div data-sidebar={`${initialData?.Sidebar}`} id="root">{children}</div>
                </ThemeProvider>
            </body>
        </html>
    )
}