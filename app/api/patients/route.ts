import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/app/lib/supabase'

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase.from('patients').select('*').order('name')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  const body = await req.json()
  const { data, error } = await supabase
    .from('patients')
    .insert({ name: body.name, date_of_birth: body.date_of_birth })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
