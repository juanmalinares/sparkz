# Sparkz

An AI-powered interactive learning app for kids (ages 6–10). Each topic is a
self-contained **learning module** delivered in three phases — **Theory →
Flashcards → Quiz** — with instant, persona-driven AI feedback ("Marc", the
high-energy tutor, or "Jordi", the calm Bauhaus-precise one). Content is in
Spanish (`es-AR`).

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (custom "Bauhaus-meets-manga" design system)
- **Google Genkit** for AI orchestration (`gemini-flash-latest`)
- **Firebase** — Authentication (email/password) + Firestore

## Getting started

1. Copy your Firebase web config and admin settings into `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_ADMIN_EMAIL=...   # gates the /admin UI
   GEMINI_API_KEY=...            # server-side, used by Genkit
   ```
2. Install and run the dev server (port **9002**):
   ```bash
   npm install
   npm run dev
   ```
3. Run the Genkit dev UI (optional, for inspecting AI flows):
   ```bash
   npm run genkit:dev
   ```

## Key routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/tutorial` | Login / sign-up / password reset |
| `/quiz` | Module catalog |
| `/quiz/[id]` | The 3-phase learning experience |
| `/dashboard` | Per-user stats |
| `/admin` | AI module creator + content/report management (admin only) |
| `/admin-stats` | All-user stats (admin only) |

## Security

Admin access is enforced **both** client-side (`NEXT_PUBLIC_ADMIN_EMAIL`) and in
`firestore.rules` (`isAdmin()`). After changing the admin email, update it in
`firestore.rules` and redeploy:

```bash
firebase deploy --only firestore:rules
```

## Scripts

- `npm run dev` — Next.js dev server (Turbopack, port 9002)
- `npm run build` / `npm run start` — production build / serve
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — Next.js lint
