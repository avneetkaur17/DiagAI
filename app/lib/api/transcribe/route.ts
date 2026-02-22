import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio provided' }, { status: 400 })
    }

    // Skip tiny chunks where nothing was said
    if (audioFile.size < 1000) {
      return NextResponse.json({ transcript: '' })
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
      prompt: 'Medical consultation between doctor and patient.' // helps Whisper with medical terms
    })

    return NextResponse.json({ transcript: transcription.text })

  } catch (error: any) {
    console.error('Transcription error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}