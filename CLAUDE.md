# Sumikko Snack Corner

A kawaii Sumikko Gurashi-themed snack expiry tracker. Users add snacks to a vending machine UI, track expiry dates, eat/rate snacks, and get email reminders.

## Tech Stack

- **Client**: React 19 + TypeScript, Vite, React Router v7, TanStack React Query, Framer Motion
- **Server**: Express 5, Prisma (PostgreSQL via Neon), bcrypt, JWT auth, nodemailer, node-cron
- **Monorepo**: Root `package.json` uses `concurrently` to run both

## Getting Started

```bash
npm install
cd client && npm install
cd ../server && npm install
npx prisma generate    # Required before first run
npx prisma db push     # Create/sync the database
cd ..
npm run dev            # Starts both client (5173) and server (3001)
```

## Important: Windows IPv4 Binding

Vite is configured to bind to `127.0.0.1` explicitly in `client/vite.config.ts`. Without this, Node.js may listen on IPv6 only (`[::1]`), causing "connection refused" errors on Windows.

## Deployment (Render + Neon)

- **Hosting**: Render (free tier) — single web service serving both API and React SPA
- **Database**: Neon (free tier) — PostgreSQL, no expiration
- Express serves the built client from `client/dist` in production
- Config: `render.yaml` at repo root
- Build: `npm run build` builds client + generates Prisma client + compiles server
- Start: `npm start` runs `node server/dist/index.js`
- Env vars to set in Render: `DATABASE_URL`, `JWT_SECRET`, `ENCRYPTION_KEY`

## Project Structure

```
client/
  src/
    components/
      Auth/           # LoginForm, SignupForm, AuthLayout
      Characters/     # SumikkoCharacter component
      VendingMachine/ # VendingSlot, SnackBubble
      Animations/     # UndoToast
      Layout/         # Navbar
    context/          # AuthContext (JWT-based auth)
    hooks/            # useSnacks, useArchive
    pages/            # HomePage, LoginPage, SignupPage, ArchiveRoute, SettingsPage
    utils/
      api.ts          # Fetch wrapper with auth headers
      snackIcons.tsx  # Inline SVG icons per snack category
      dateUtils.ts
    types/index.ts
server/
  prisma/
    schema.prisma     # User, Snack, ArchivedSnack models
    # Database is PostgreSQL hosted on Neon
  src/
    routes/           # auth, snacks, archive, settings
    services/         # emailService, cronService
    middleware/       # authMiddleware (JWT)
    lib/prisma.ts
  uploads/            # User-uploaded snack images
```

## Replacing Sumikko Character Images

Character images are loaded from `client/public/characters/`. Place SVG (or PNG) files there:

- `shirokuma.png`
- `penguin.png`
- `tonkatsu.png`
- `neko.png`
- `tokage.png`
- `yamapenguin.png`

The mapping is in `client/src/components/Characters/SumikkoCharacter.tsx`.

Snack icons (chips, chocolate, cookie, etc.) are inline SVGs in `client/src/utils/snackIcons.tsx`.

## Commands

- `npm run dev` — Start both client and server
- `npm run dev:client` — Vite dev server only (port 5173)
- `npm run dev:server` — Express server only (port 3001)
- `npm run db:push` — Sync Prisma schema to database
- `npm run db:studio` — Open Prisma Studio GUI
- `npm run build` — Build client + server for production
- `npm start` — Run production server (serves API + React SPA)

## Environment Variables (server/.env)

- `DATABASE_URL` — PostgreSQL connection string (from Neon)
- `JWT_SECRET` — Secret for signing JWT tokens
- `PORT` — Server port (default: 3001)
- `ENCRYPTION_KEY` — For encrypting stored Gmail app passwords
