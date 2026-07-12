# Sumikko Snack Corner

A kawaii Sumikko Gurashi-themed snack expiry tracker. Users add snacks to a vending machine UI, track expiry dates, eat/rate snacks, and get email reminders.

## Tech Stack

- **Client**: React 19 + TypeScript, Vite, React Router v7, TanStack React Query, Framer Motion
- **Server**: Express 5, Prisma (PostgreSQL via Neon), bcrypt, JWT auth, nodemailer, node-cron
- **Monorepo**: Root `package.json` uses `concurrently` to run both

## Known Issues

- **Local dev server may not hot-reload server changes**: `tsx watch` sometimes misses file changes on Windows. If the server behaves differently locally vs deployed, stop `npm run dev` (Ctrl+C) and restart it. The live Render build always uses fresh code.
- **Express 5 route syntax**: Express 5 uses `/{*splat}` instead of `*` for catch-all routes. Do not use bare `*` in `app.get()` — it will crash the server.
- **Prisma client output**: Uses default `@prisma/client` output (in `node_modules`), NOT a custom output path. A custom `output` in `schema.prisma` causes missing module errors after `tsc` compilation because non-TS runtime files don't get copied to `dist/`.
- **Client build skips tsc**: The client build runs `vite build` only (no `tsc -b`) because React 19's `@types/react` JSX types don't resolve consistently on Render's Node environment.
- **Prisma generator**: Uses `prisma-client-js` (not `prisma-client`) since the newer generator requires a custom output path which breaks on deployment.

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
- **Database**: Neon (free tier, `ap-southeast-1` Singapore region) — PostgreSQL, no expiration
- Express serves the built client from `client/dist` in production
- Config: `render.yaml` at repo root
- Build: `npm run build` builds client + generates Prisma client + compiles server
- Start: `npm start` runs `node server/dist/index.js`
- Env vars set in Render dashboard: `DATABASE_URL`, `JWT_SECRET`, `ENCRYPTION_KEY`
- **Build command** in Render dashboard must match `render.yaml`: `npm install && npm --prefix client install && npm --prefix server install && npm run build && cd server && npx prisma db push`
- **Live URL**: deployed on Render (check dashboard for URL)
- **GitHub repo**: https://github.com/tobiasyap/sumikko-snack-corner

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

## API Endpoints

- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Log in
- `GET /api/auth/me` — Current user (protected)
- `GET /api/snacks` — List snacks (protected)
- `POST /api/snacks` — Add snack with optional image upload (protected)
- `DELETE /api/snacks/:id` — Delete snack (protected)
- `POST /api/snacks/:id/eat` — Archive snack, rating is optional (protected)
- `GET /api/archive` — List archived (eaten) snacks (protected)
- `DELETE /api/archive/:id` — Delete archived snack (protected)
- `PATCH /api/archive/:id/rating` — Update rating on archived snack (protected)
- `POST /api/archive/:id/undo` — Restore archived snack back to vending machine (protected)

## Eat Flow

1. User clicks snack → info modal shows
2. "Eat Now" → modal closes, eat animation plays
3. After animation → snack archived to server with no rating
4. UndoToast appears with Undo / Rate buttons + 10s countdown
5. "Undo" → calls undo endpoint, snack restored to vending machine
6. "Rate" → inline rating circles in toast, PATCH updates the rating
7. Timer expires → toast dismisses, snack stays archived unrated
8. Users can also rate/re-rate from the Snack Diary page

## Environment Variables (server/.env)

- `DATABASE_URL` — PostgreSQL connection string (from Neon)
- `JWT_SECRET` — Secret for signing JWT tokens
- `PORT` — Server port (default: 3001)
- `ENCRYPTION_KEY` — For encrypting stored Gmail app passwords
