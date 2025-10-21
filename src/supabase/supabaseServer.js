import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Cookies can only be modified in Server Actions or Route Handlers
            // Ignore in other contexts (Server Components)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options, expires: new Date(0) });
          } catch (error) {
            // Cookies can only be modified in Server Actions or Route Handlers
            // Ignore in other contexts (Server Components)
          }
        },
      },
    }
  );
}
