import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jzphctzxqqaucbqprpe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cGhjdHp4cXFhdWNicXpwcnBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTgxODcsImV4cCI6MjEwMzE5NDE4N30.Usk9FvW7JpxsL32go_2wTWTP2Rn3dCflzn9rUaHQA9E'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)