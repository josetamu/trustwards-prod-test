import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvtufjcqfqnlottuhhzz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// Debug: Check if environment variables are properly loaded
if (typeof window !== 'undefined') {
  console.log('Supabase Key loaded:', supabaseKey ? 'YES' : 'NO');
  if (!supabaseKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_KEY is not defined. Please check your .env.local file.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey);
