# Averlyn Vaccine Tracker — Frontend

A private baby vaccine tracking web app for our daughter **Averlyn** (born 2025-12-03).

Tracks Taiwan's public (公費) and self-paid (自費) vaccine schedules. Family members can log in with Google to view the timeline, mark vaccines as done, and record vaccination dates.

> Live: [averlyn-vaccine-fe.vercel.app](https://averlyn-vaccine-fe.vercel.app)

## About

This project was born from a simple need: keeping track of Averlyn's vaccination schedule following Taiwan's recommended timeline. What started as a static HTML page on GitHub Pages evolved into a full-stack application when we wanted to:

1. **Record actual vaccination dates** — mark vaccines as done and input the date
2. **Share securely with family** — only two Google accounts can access (wife + me)
3. **Edit from any device** — mobile-friendly, data persisted in the cloud

### Features

- View all 36 vaccines in a timeline grouped by scheduled date
- Filter by: all / done / upcoming / overdue
- Stats bar showing completion progress and next vaccine countdown
- Mark vaccines as done/undo with date picker
- "Last updated" timestamp on edited records
- Google OAuth login restricted to whitelisted emails only
- Pink/cream theme with Quicksand font

### How It Was Built

This project was developed using **SDD (Spec-Driven Development)** with an [OpenSpec](https://github.com/tankfinal/averlyn-vaccine-be/blob/main/docs/openspec.md) document that defined the full system design before any code was written. The spec covers database schema, API endpoints, component tree, auth flow, and acceptance criteria.

The original static site data (36 vaccine records with actual vaccination dates and notes) was migrated to Supabase PostgreSQL via a one-time migration script.

## Architecture

```
                         Averlyn Vaccine Tracker — System Architecture

  +-----------+        +------------------+        +-------------------+
  |  Browser  | -----> |   Vercel (CDN)   | -----> |   Static Assets   |
  |  (React)  |        |   SPA Hosting    |        |   index.html/JS   |
  +-----------+        +------------------+        +-------------------+
       |
       |  1. Google Login (OAuth implicit flow)
       v
  +--------------------+       +---------------------+       +-----------------+
  | Supabase Auth      | <---> | Google Cloud OAuth  |       | Google Account  |
  | (session + token)  |       | (Client ID/Secret)  | <---> | (user login)    |
  +--------------------+       +---------------------+       +-----------------+
       |
       |  2. Bearer token in Authorization header
       v
  +--------------------+       +---------------------+
  | Render (Backend)   | <---> | Supabase PostgreSQL |
  | FastAPI + Uvicorn  |       | (vaccines, baby)    |
  +--------------------+       +---------------------+
       |
       |  3. auth.get_user(token) to verify
       v
  +--------------------+
  | Supabase Auth API  |
  | (token validation) |
  +--------------------+
```

## Auth Flow

```
  User                Browser              Supabase Auth         Google            Backend API
   |                    |                      |                    |                   |
   |  Click Login       |                      |                    |                   |
   |------------------->|                      |                    |                   |
   |                    |  signInWithOAuth()   |                    |                   |
   |                    |--------------------->|                    |                   |
   |                    |                      |  OAuth redirect    |                   |
   |                    |                      |------------------->|                   |
   |                    |                      |                    |                   |
   |                    |        Google consent screen              |                   |
   |                    |<-----------------------------------------|                   |
   |  Enter credentials |                      |                    |                   |
   |------------------------------------------->                    |                   |
   |                    |                      |  Auth code         |                   |
   |                    |                      |<-------------------|                   |
   |                    |  Redirect with       |                    |                   |
   |                    |  #access_token       |                    |                   |
   |                    |<---------------------|                    |                   |
   |                    |                      |                    |                   |
   |                    |  detectSessionInUrl  |                    |                   |
   |                    |  (auto parse token)  |                    |                   |
   |                    |                      |                    |                   |
   |                    |  GET /api/vaccines (Bearer token)         |                   |
   |                    |---------------------------------------------------------->    |
   |                    |                      |                    |  get_user(token)  |
   |                    |                      |<----------------------------------- ---|
   |                    |                      |  user verified     |                   |
   |                    |                      |----------------------------------->    |
   |                    |                      |                    |  email whitelist  |
   |                    |                      |                    |  check + respond  |
   |                    |  Vaccine data        |                    |                   |
   |                    |<----------------------------------------------------------|   |
   |  Show vaccines     |                      |                    |                   |
   |<-------------------|                      |                    |                   |
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 19 + TypeScript | UI |
| Build | Vite 8 | Dev server + bundler |
| Routing | React Router 7 | SPA routing |
| Server State | TanStack Query 5 | API data fetching + cache |
| HTTP | Axios | API client with auth interceptor |
| Auth | Supabase JS (implicit flow) | Google OAuth + session |
| Deploy | Vercel | Static hosting + CDN |

## Project Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Provider setup (QueryClient, AuthProvider)
├── MainPage.tsx              # Route orchestrator (login/denied/main view)
├── api/
│   └── client.ts             # Axios instance + Bearer token interceptor
├── auth/
│   ├── supabaseClient.ts     # Supabase client (implicit flow + detectSessionInUrl)
│   ├── AuthProvider.tsx       # Auth context (session, signIn, signOut)
│   └── AuthCallback.tsx       # OAuth callback handler (legacy, unused)
├── components/
│   ├── LoginPage.tsx          # Google login button
│   ├── AccessDenied.tsx       # 403 page for unauthorized emails
│   ├── Header.tsx             # App header with baby name + age
│   ├── StatsBar.tsx           # Vaccine completion stats
│   ├── FilterBar.tsx          # Filter: all / done / upcoming / overdue
│   ├── Timeline.tsx           # Grouped vaccine timeline
│   ├── VaccineCard.tsx        # Individual vaccine card
│   ├── VaccineEditModal.tsx   # Edit modal (mark done, set date)
│   └── Footer.tsx             # App footer
├── hooks/
│   ├── useAuth.ts             # Auth context hook
│   ├── useBaby.ts             # GET /api/baby (enabled: !!session)
│   └── useVaccines.ts         # GET/PATCH /api/vaccines (enabled: !!session)
├── styles/
│   └── index.css              # Full CSS (pink/cream theme, Quicksand font)
├── types/
│   └── index.ts               # Vaccine, Baby, VaccineUpdatePayload types
└── utils/
    ├── date.ts                # Age calculation, date formatting
    └── vaccine.ts             # Status logic, filtering, next vaccine finder
```

## Local Development

```bash
# Install
npm install

# Set env vars
cp .env.example .env
# Fill in VITE_API_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

# Dev server
npm run dev        # http://localhost:5173

# Type check + Build
npm run build
```

### Environment Variables

| Variable | Example | Note |
|----------|---------|------|
| `VITE_API_URL` | `http://localhost:8000/api` | Backend API base URL |
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbG...` | **Must use Legacy format** |

## Deploy to Vercel

1. Connect GitHub repo `tankfinal/averlyn-vaccine-fe`
2. Set environment variables in Vercel Dashboard
3. Auto-deploys on push to `main`

`vercel.json` handles SPA routing:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## Related

- Backend: [averlyn-vaccine-be](https://github.com/tankfinal/averlyn-vaccine-be)
