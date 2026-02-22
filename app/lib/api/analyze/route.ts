import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { transcript, patientHistory } = await req.json()

    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 })
    }

    const prompt = `
You are an expert clinical assistant helping a doctor during a patient consultation.

${patientHistory ? `Patient's existing medical history: ${patientHistory}` : ''}

Here is the transcript of the consultation:
"${transcript}"

Analyze this and return ONLY a valid JSON object with exactly this structure, no extra text:
{
  "chief_complaint": "main reason for visit in one sentence",
  "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
  "diagnosis": "most likely diagnosis based on symptoms",
  "icd_code": "relevant ICD-10 code e.g. J06.9",
  "icd_description": "plain english description of the ICD code",
  "medications": [
    {
      "name": "medication name",
      "suggested_dose": "e.g. 500mg",
      "suggested_frequency": "e.g. twice daily for 7 days",
      "reason": "why this medication"
    }
  ],
  "clinical_note": "Full SOAP format clinical note for the doctor's records",
  "patient_summary": "Plain English explanation of the visit for the patient, what they have, what to do, what to watch for"
}
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }, // forces JSON output
      temperature: 0.3 // lower = more consistent medical outputs
    })

    const result = JSON.parse(response.choices[0].message.content || '{}')
    return NextResponse.json(result)

  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}