import { supabase } from './supabase'

export const dbService = {
  // Salvar ou carregar pacientes
  async getPatients() {
    const { data, error } = await supabase.from('patients').select('*')
    if (error) {
      console.error('Erro ao buscar pacientes:', error)
      return []
    }
    // Mapeia do formato do banco para o formato do app
    return data.map((p: any) => ({
      id: p.id.toString(),
      petName: p.pet_name,
      species: p.species,
      breed: p.breed,
      tutor: p.tutor,
      status: p.status,
      date: p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : '',
      age: p.data_json?.age || 'Não informada',
      complaint: p.data_json?.complaint || '',
      evolutions: p.data_json?.evolutions || []
    }))
  },

  async savePatient(patient: any) {
    const payloadToInsert = {
      pet_name: patient.petName,
      species: patient.species,
      breed: patient.breed,
      tutor: patient.tutor,
      status: patient.status,
      data_json: {
        age: patient.age,
        complaint: patient.complaint,
        evolutions: patient.evolutions
      }
    }
    const { data, error } = await supabase.from('patients').insert([payloadToInsert]).select()
    if (error) {
      console.error('Erro ao salvar paciente:', error)
    }
    return data
  },

  // Sincronização geral de estados (Calendário, Tarefas, Finanças, Estudos) via tabela app_data
  async getAppData(key: string) {
    const { data, error } = await supabase.from('app_data').select('payload').eq('key', key).single()
    if (error || !data) return null
    return data.payload
  },

  async saveAppData(key: string, payload: any) {
    const { error } = await supabase.from('app_data').upsert({ key, payload }, { onConflict: 'key' })
    if (error) {
      console.error(`Erro ao salvar ${key}:`, error)
    }
  }
}