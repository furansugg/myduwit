
import { createClient } from '@supabase/supabase-js';

// Nilai yang Anda masukkan secara manual
const supabaseUrl = 'https://rnhbfjcurbwpoktipctv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaGJmamN1cmJ3cG9rdGlwY3R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NjgxNTYsImV4cCI6MjA4MjU0NDE1Nn0.W9oTpnlPqiuhXxFN8MEf9yRDjC18RWdPHE33KzNPNmc';

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
