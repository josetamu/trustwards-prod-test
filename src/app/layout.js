// app/layout.jsx (Server Component)
import { ThemeProvider } from 'next-themes';
import { SidebarSettingsProvider } from '@contexts/SidebarSettingsContext';
import { supabaseServer } from '@supabase/supabaseServer';

export const revalidate = 0;            // evita cache
export const dynamic = 'force-dynamic'; // asegura SSR con cookies

export default async function RootLayout({ children }) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  let initialSidebarState = null;
  let reducedMotion = 'no-preference';
  if (user) {
    const { data: appearance } = await supabase
      .from('Appearance')
      .select('*')
      .eq('userid', user.id)
      .single();
    if (appearance) {
      initialSidebarState = appearance.Sidebar ?? null;
      reducedMotion = appearance['Reduced Motion'] ?? false;
    }
  }

  return (
    <html lang="es" suppressHydrationWarning data-reduced-motion={reducedMotion}>
      <head><title>Trustwards</title></head>
      <body>
        <ThemeProvider>
          <SidebarSettingsProvider initialState={initialSidebarState}>
            <div id="root">{children}</div>
          </SidebarSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
