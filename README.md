# ChatWithPDF - Production-Ready SaaS Application

ChatWithPDF is an AI-powered document intelligence SaaS platform built with Next.js (App Router), React, TypeScript, Tailwind CSS, and Supabase. Users can upload PDF documents, extract text automatically, and hold interactive, fact-checked conversations with their PDFs.

---

## 🚀 Key Features

- **Modern SaaS Landing Page**: High-converting hero section, interactive demo mockup, features grid, 3-step workflow, comparison table, FAQ accordion, and call-to-action.
- **Supabase Authentication**:
  - Secure Email/Password sign-up & sign-in
  - Google OAuth integration support
  - Password recovery (Forgot Password) & Reset Password
  - Session persistence with `@supabase/ssr` cookies
  - Next.js Edge Middleware route guards for protected pages
  - Complete session sign-out terminating the Supabase session
- **Document Management**:
  - Drag-and-drop PDF upload with client-side validation (PDF format only, 20MB limit)
  - Animated upload progress and server processing status
  - User-isolated Supabase Storage (`documents` bucket)
  - Full document deletion (removes file from storage and cascades through database records)
- **PDF Text Extraction & Grounded AI Chat**:
  - Server-side text parsing and page counting via Node.js PDF extraction
  - Split-screen PDF viewer with zoom controls (50% - 200%), reset, text mode toggle, and new tab view
  - AI chat interface with suggested question chips, Markdown formatted replies, and copy-to-clipboard
  - Strict grounding: Answers are drawn **exclusively** from document content. If not found, the model explicitly states it is not present.
  - Modular AI architecture: Connects to **OpenAI** (`gpt-4o-mini`), **Google Gemini**, or operates in local semantic retrieval mode.
- **Chat History & User Settings**:
  - Searchable document library and persistent chat sessions
  - Account profile updates (name, avatar URL)
  - Password updates and danger zone account deletion with safety confirmation modal
- **Enterprise Security**:
  - Supabase PostgreSQL Row Level Security (RLS) on all tables (`profiles`, `documents`, `chat_sessions`, `chat_messages`)
  - Storage bucket RLS policies ensuring users can only read and write their own files
  - No secret keys exposed on the client.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **UI & Styling** | Tailwind CSS & Lucide Icons |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth (`@supabase/ssr`) |
| **File Storage** | Supabase Storage (`documents` bucket) |
| **PDF Extraction** | `pdf-parse` (Node.js Server Runtime) |
| **AI Integration** | OpenAI API SDK (Modular adapter with grounded context retrieval) |
| **Deployment** | Vercel Ready |

---

## 📋 Step-by-Step Setup Guide

### 1. Clone & Install Dependencies

```bash
cd "chat with pdf"
npm install
```

---

### 2. Set Up Your Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Once created, navigate to **Project Settings** -> **API**:
   - Copy the **Project URL** (`https://xyzcompany.supabase.co`)
   - Copy the **anon public key** (`eyJ...`)
   - *(Optional for admin routines)* Copy the **service_role secret key**

---

### 3. Run the Database Schema & Storage Migration

1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the file [`supabase/schema.sql`](file:///supabase/schema.sql) in this repository and paste the entire script into the SQL editor.
4. Click **Run**.
5. This script automatically:
   - Creates the `profiles`, `documents`, `chat_sessions`, and `chat_messages` tables.
   - Sets up indexes and automatic `updated_at` triggers.
   - Configures the `on_auth_user_created` trigger that automatically provisions a user profile upon registration.
   - Enables Row Level Security (RLS) on all tables with strict user-isolation policies (`auth.uid() = user_id`).
   - Creates the private `documents` Storage Bucket with user-scoped RLS policies.

---

### 4. Configure Environment Variables

Create a file named `.env.local` in the project root (copied from `.env.example`):

```bash
cp .env.example .env.local
```

Fill in your actual keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Provider (OpenAI)
OPENAI_API_KEY=sk-proj-your-openai-api-key
OPENAI_MODEL=gpt-4o-mini

# App URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note on AI API Key**: If you run without an `OPENAI_API_KEY`, the application automatically uses its built-in semantic context extraction engine so you can test document uploads and question matching immediately.

---

### 5. Run Locally

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com](https://vercel.com) and click **Add New** -> **Project**.
3. Select your repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your Vercel URL, e.g. `https://chatwithpdf.vercel.app`)
5. Click **Deploy**. Your SaaS application will be live in under 2 minutes!

---

## 🔒 Security & Privacy

- **Row Level Security**: Every SQL query is filtered by PostgreSQL policies directly inside the database engine. Even if someone inspects the network, they cannot read another user's documents or chats.
- **Isolated Storage**: Storage objects are partitioned by `documents/{user_id}/{document_id}.pdf` and protected by Supabase Storage RLS.
- **Signed URLs**: Documents are served via short-lived signed URLs generated server-side for the authenticated user only.
- **No Client Secrets**: Service role keys and AI API keys are used strictly in Next.js Server Components and Route Handlers.
