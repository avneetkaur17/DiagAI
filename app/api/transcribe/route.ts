import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    if (!audioFile) return NextResponse.json({ error: 'No audio provided' }, { status: 400 })
    if (audioFile.size < 1000) return NextResponse.json({ transcript: '' })

    const audioBytes = await audioFile.arrayBuffer()
    const base64Audio = Buffer.from(audioBytes).toString('base64')
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent([
      { inlineData: { mimeType: 'audio/webm', data: base64Audio } },
      'Transcribe this medical consultation audio exactly as spoken. Return only the transcription text, nothing else.'
    ])
    const transcript = result.response.text().trim()
    return NextResponse.json({ transcript })
  } catch (error: any) {
    console.error('Transcription error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
