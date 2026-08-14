import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL) ||
  'https://pwwhrlvhmbgwwsateruc.supabase.co';

const supabaseAnonKey: string =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  'sb_publishable_oRIll9B85FVO-l_iNLSQjQ_NTzucgd_';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
