import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Serviço unificado de banco de dados para sincronizar com o Supabase
export const dbService = {
  async getAppData(key: string) {
    try {
      const { data, error } = await supabase
        .from('app_data')
        .select('value')
        .eq('key', key)
        .single()
      
      if (error || !data) return null
      return data.value
    } catch {
      return null
    }
  },

  async saveAppData(key: string, value: any) {
    try {
      await supabase
        .from('app_data')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    } catch (e) {
      console.error('Erro ao salvar no Supabase:', e)
    }
  },

  async getPatients() {
    try {
      const { data, error } = await supabase.from('patients').select('*')
      if (error) return []
      return data || []
    } catch {
      return []
    }
  }
}