import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET all patients
export async function GET() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST create new patient
export async function POST(req: NextRequest) {
  const body = await req.json()

  const { data, error } = await supabase
    .from('patients')
    .insert({ name: body.name, date_of_birth: body.date_of_birth })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}