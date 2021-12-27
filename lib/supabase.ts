import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseUrl) {
  throw new Error(`Please add NEXT_PUBLIC_SUPABASE_URL to .env`);
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseAnonKey) {
  throw new Error(`Please add NEXT_PUBLIC_SUPABASE_ANON_KEY to .env`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
