# DiagnosticAI

An AI-powered medical scribe and patient portal built at HackUTD.

## What it does

**Provider Portal** — A doctor starts a consultation, hits record, and the app streams audio to OpenAI Whisper every 8 seconds for live transcription. When the session ends, GPT-4o analyzes the full transcript and generates a SOAP clinical note, ICD-10 code, diagnosis, and medication suggestions. The doctor reviews and publishes to the patient.

**Patient Portal** — Patients log in to view their visit summary in plain language, test results, prescribed medications, and manage appointments.

## Tech Stack

- **Frontend/Backend:** Next.js 16 (App Router), TypeScript, Tailwind CSS
- **AI:** OpenAI Whisper (transcription) + GPT-4o (clinical analysis)
- **Database:** Supabase (PostgreSQL)

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy the env example and fill in your keys:
   ```bash
   cp .env.local.example .env.local
   ```

3. Set up Supabase tables (run in Supabase SQL editor):
   ```sql
   create table patients (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     date_of_birth date,
     created_at timestamptz default now()
   );

   create table visits (
     id uuid primary key default gen_random_uuid(),
     patient_id uuid references patients(id),
     transcript text,
     chief_complaint text,
     symptoms jsonb,
     diagnosis text,
     icd_code text,
     medications jsonb,
     clinical_note text,
     patient_summary text,
     follow_up_date date,
     status text default 'completed',
     created_at timestamptz default now()
   );
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Team

- Backend (API routes, Whisper/GPT-4o integration, Supabase): Aman
- Frontend (Provider & Patient portals, UI/UX): Avneet
