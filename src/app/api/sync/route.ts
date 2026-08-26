import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jzphctzxqqaucbqprpe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cGhjdHp4cXFhdWNicXpwcnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTgxODcsImV4cCI6MjEwMzE5NDE4N30.Usk9FvW7JpxsL32go_2wTWTP2Rn3dCflzn9rUaHQA9E'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id') || 'beatriz_workspace_v26'
    
    const { data, error } = await supabase
      .from('app_data')
      .select('data')
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data: data?.data || null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, data } = body

    const { error } = await supabase
      .from('app_data')
      .upsert({
        id: id || 'beatriz_workspace_v26',
        data: data,
        updated_at: new Date().toISOString()
      })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}