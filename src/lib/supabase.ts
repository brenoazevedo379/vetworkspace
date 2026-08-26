import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jzphctzxqqaucbqprpe.supabase.co'
const supabaseAnonKey = 'sb_publishable_sMMvs6unzDRNFnFAyoR9iw_nLvbiePH'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)