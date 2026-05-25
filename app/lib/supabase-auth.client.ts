import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ysyfoiqztuvlwctwbgsk.supabase.co';
const DEFAULT_PUBLISHABLE_KEY = 'sb_publishable_sBqx6BUwru3VM8KKOTt5YA_-S1k5Pz4';

export function createSupabaseAuthClient() {
  return createClient(SUPABASE_URL, DEFAULT_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
