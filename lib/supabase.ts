
import { createClient } from '@supabase/supabase-js';

// Mengambil nilai dari environment variables
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Memeriksa apakah konfigurasi sudah diset dengan benar
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== '' &&
  !supabaseUrl.includes('placeholder')
);

// Inisialisasi client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
