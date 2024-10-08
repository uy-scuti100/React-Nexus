import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_REACT_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_REACT_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
   throw new Error("Supabase URL or key is missing.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
   auth: { persistSession: true },
});

export default supabase;
