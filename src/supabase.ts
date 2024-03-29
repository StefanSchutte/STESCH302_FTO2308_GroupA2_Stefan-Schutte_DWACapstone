import { createClient, SupabaseClient } from '@supabase/supabase-js';

/** URL of your Supabase project. */
const supabaseUrl: string | undefined = import.meta.env.VITE_SUPABASE_URL;
/** Anonymous key for accessing your Supabase project. */
const supabaseKey: string | undefined = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Supabase key is not provided in environment variables.");
}

/**
 * Values are obtained from the environment variables.
 * Once the Supabase client is created, it's stored in the supabase variable.
 */
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export const auth = supabase.auth;

export default supabase;
