import { createClient } from "@supabase/supabase-js";

const { VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY } = window.__ENV__ || {};

const supabaseUrl = VITE_SUPABASE_URL;
const supabaseAnonKey = VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);