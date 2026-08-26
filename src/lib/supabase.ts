import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export const dbService = {
  async getAppData(key: string) {
    try {
      const { data, error } = await supabase
        .from('vet_workspace_state')
        .select('data')
        .eq('key', key)
        .single()
      
      if (error || !data) return null
      return data.data
    } catch {
      return null
    }
  },

  async saveAppData(key: string, value: any) {
    try {
      await supabase
        .from('vet_workspace_state')
        .upsert({ key, data: value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    } catch (e) {
      console.error('Erro ao salvar no Supabase:', e)
    }
  }
}