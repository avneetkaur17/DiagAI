'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const steps = [
  'Transcribing conversation...',
  'Extracting symptoms and diagnosis...',
  'Generating visit summary...',
  'Suggesting medications...',
  'Finalizing notes...',
]

export default function ProviderLoading() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => { if (prev < steps.length - 1) return prev + 1; clearInterval(interval); return prev })
    }, 1000)
    const timeout = setTimeout(() => router.push('/provider/summary'), 5500)
    return () => { clearInterval(interval); clearTimeout(timeout) }
  }, [router])

  return (
    <div className="pload">
      <div className="pload__card">
        <div className="pload__spinner" />
        <div className="pload__tag">AI Processing</div>
        <h2 className="pload__title">Generating Summary</h2>
        <p className="pload__sub">Please wait while the AI processes the consultation...</p>
        <div className="pload__steps">
          {steps.map((s, i) => (
            <div key={i} className={`pload__step ${i <= step ? 'is-done' : ''} ${i === step ? 'is-active' : ''}`}>
              <div className="pload__step-dot" />
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
