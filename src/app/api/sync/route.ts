import { NextResponse } from 'next/server'

const SUPABASE_URL = 'https://jzphctzxqqaucbqprpe.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cGhjdHp4cXFhdWNicXpwcnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTgxODcsImV4cCI6MjEwMzE5NDE4N30.Usk9FvW7JpxsL32go_2wTWTP2Rn3dCflzn9rUaHQA9E'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id') || 'beatriz_workspace_v26'
    
    const res = await fetch(`${SUPABASE_URL}/rest/v1/app_data?id=eq.${id}&select=data`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    })

    if (!res.ok) {
      return NextResponse.json({ data: null })
    }

    const rows = await res.json()
    const data = rows && rows.length > 0 ? rows[0].data : null
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ data: null })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, data } = body
    const recordId = id || 'beatriz_workspace_v26'

    const res = await fetch(`${SUPABASE_URL}/rest/v1/app_data`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: recordId,
        data: data,
        updated_at: new Date().toISOString()
      })
    })

    if (!res.ok) {
      const errText = await res.text()
      return NextResponse.json({ error: errText }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}