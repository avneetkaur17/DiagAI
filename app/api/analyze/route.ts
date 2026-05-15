import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  try {
    const { transcript, patientHistory } = await req.json()
    if (!transcript) return NextResponse.json({ error: 'No transcript provided' }, { status: 400 })

    const prompt = `You are an expert clinical assistant helping a doctor during a patient consultation.
${patientHistory ? `Patient's existing medical history: ${patientHistory}` : ''}
Here is the transcript of the consultation: "${transcript}"

Return ONLY a valid JSON object with exactly this structure, no extra text, no markdown:
{
  "chief_complaint": "main reason for visit in one sentence",
  "symptoms": ["symptom 1", "symptom 2"],
  "diagnosis": "most likely diagnosis",
  "icd_code": "ICD-10 code e.g. J06.9",
  "icd_description": "plain english ICD description",
  "medications": [
    { "name": "medication name", "suggested_dose": "e.g. 500mg", "suggested_frequency": "e.g. twice daily", "reason": "why this medication" }
  ],
  "clinical_note": "Full SOAP format clinical note",
  "patient_summary": "Plain English explanation for the patient"
}`

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const text = result.response.text().trim().replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
