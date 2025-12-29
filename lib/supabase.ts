
import { createClient } from '@supabase/supabase-js';

// Nilai yang Anda masukkan secara manual
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Kita perbarui pengecekan ini agar melihat variabel di atas, bukan process.env
// Pastikan nilai tidak kosong dan bukan placeholder bawaan
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder')
);

if (!isSupabaseConfigured) {
  console.warn("Supabase credentials are missing or still using placeholders.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
