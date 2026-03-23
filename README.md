# Sankalp Shiksha Salahkar — Website

A premium education consultancy website for **Sankalp Shiksha Salahkar**, Raxaul, Bihar.

Built with React + Vite + Tailwind CSS + Supabase + Gemini AI.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:8080**

---

## ⚙️ Environment Setup

Rename `.env.example` to `.env` and fill in your keys:

```env
# Supabase — https://supabase.com (free)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Gemini AI — https://aistudio.google.com (free)
VITE_GEMINI_API_KEY=AIza...
```

---

## 🗄️ Supabase Database Setup

1. Create free account at **supabase.com**
2. Create a new project
3. Go to **SQL Editor**
4. Open `supabase/schema.sql` from this project
5. Paste the entire SQL and click **Run**
6. Go to **Project Settings → API** → copy URL and anon key → paste into `.env`

---

## 🤖 Gemini AI Chatbot Setup

1. Go to **aistudio.google.com**
2. Click **Get API Key** → Create API key (free, no credit card)
3. Copy the key → paste as `VITE_GEMINI_API_KEY` in `.env`
4. The chatbot will automatically switch to full AI mode

> Without the key, the chatbot falls back to smart rule-based responses.

---

## 📄 Pages

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, Stats, About, Services, Colleges, Gallery, Testimonials |
| Colleges | `/colleges` | 24 colleges with search, filter, fee details |
| Services | `/services` | 4 services with full detail sections |
| Contact | `/contact` | Form (saves to Supabase), office locations, map |
| Admin | `/admin` | View all form submissions (Supabase required) |

---

## 🏗️ Tech Stack

- **React 18** + TypeScript
- **Vite** — build tool
- **Tailwind CSS** — styling
- **Framer Motion** — animations
- **React Router** — routing
- **Supabase** — database + backend
- **Gemini 1.5 Flash** — AI chatbot
- **Lucide React** — icons

---

## 📞 Contact

**Sankalp Shiksha Salahkar**
Block Road, Near Hotel President Inn, Raxaul, Bihar (845305)
+91 9142082026 | md.sankalpshikshasalahkar@gmail.com
www.sankalpshikshasalahkar.org.in

---

## 🔐 Admin Portal Setup (Gmail Login)

### Step 1 — Enable Google OAuth in Supabase
1. Go to **Supabase Dashboard → Authentication → Providers**
2. Click **Google** → Toggle **Enable**
3. You need a Google OAuth Client ID and Secret:
   - Go to **console.cloud.google.com**
   - Create a project → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID (Web application)
   - Add Authorized redirect URI: `https://yourproject.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret → paste into Supabase Google provider

### Step 2 — Set Owner Gmail
Open `supabase/schema.sql` and change this line before running:
```sql
VALUES ('amitupadhyay@gmail.com', 'Amit Kumar Upadhyay', 'owner')
```
Replace with the real owner Gmail address.

### Step 3 — Access Admin
Visit `/admin` on your website → Click "Sign in with Google" → Only authorized emails can enter.

### Admin Features
- **Submissions** — View all contact form submissions, update status (New/Contacted/Enrolled/Closed)
- **Gallery** — Upload real photos, delete photos, see what's live on website
- **Team** — Owner can add/remove staff Gmail accounts
