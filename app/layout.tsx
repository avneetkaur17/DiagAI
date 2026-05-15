import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DiagnosticAI',
  description: 'AI-powered clinical documentation and patient care',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
