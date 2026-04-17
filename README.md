# Averlyn Vaccine Tracker — Frontend

Baby vaccine tracking app for Averlyn (born 2025-12-03), built with React + TypeScript.
Tracks Taiwan's public and self-paid vaccine schedules, with login restricted to family members only.

> Live: [averlyn-vaccine-fe.vercel.app](https://averlyn-vaccine-fe.vercel.app)

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
