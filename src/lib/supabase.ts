import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '%c[EVENTORA]%c Running with local resilient storage engine (Seed + Reactive Storage active). To switch to live cloud Supabase, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    'background: #7C3AED; color: #fff; padding: 2px 6px; border-radius: 4px; font-weight: bold;',
    'color: #94A3B8;'
  );
}
