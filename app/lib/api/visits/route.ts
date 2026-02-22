import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST — save a completed visit
export async function POST(req: NextRequest) {
  const body = await req.json()

  const { data, error } = await supabase
    .from('visits')
    .insert({
      patient_id: body.patient_id,
      transcript: body.transcript,
      chief_complaint: body.chief_complaint,
      symptoms: body.symptoms,
      diagnosis: body.diagnosis,
      icd_code: body.icd_code,
      medications: body.medications,
      validated_items: body.validated_items,
      clinical_note: body.clinical_note,
      patient_summary: body.patient_summary,
      follow_up_date: body.follow_up_date,
      status: 'completed'
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// GET — get visits for a patient
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const patientId = searchParams.get('patientId')

  const query = supabase.from('visits').select('*').order('created_at', { ascending: false })
  if (patientId) query.eq('patient_id', patientId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}