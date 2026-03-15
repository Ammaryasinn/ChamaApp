# Hazina

Hazina is a mobile fintech platform for Kenyan savings groups (chamas). This monorepo contains:

- `backend/` — Express + TypeScript + Prisma REST & WebSocket API
- `mobile/` — Expo React Native app

---

## Architecture

```
┌─────────────────────────────────────┐
│           Docker Network            │
│                                     │
│  ┌─────────────┐  ┌──────────────┐  │
│  │   backend   │  │   postgres   │  │
│  │  :4000      │──│  :5432       │  │
│  └─────────────┘  └──────────────┘  │
└─────────────────────────────────────┘
         │
  host machine
         │
┌─────────────────┐
│  mobile (Expo)  │
│  runs on device │
│  or emulator    │
└─────────────────┘
```

The backend and database run together in Docker. The mobile app runs locally via Expo and connects to the backend on `localhost:4000`.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (running)
- [Node.js 20+](https://nodejs.org/) (for mobile development)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`

---

## Quick Start

### 1. Clone and install root dependencies

```bash
git clone <repo-url>
cd ChamaApp
npm install
```

### 2. Set up backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in the required values (see [Environment Variables](#environment-variables) below).

### 3. Start the full stack with Docker

```bash
npm run docker:up:build
```

This starts both **Postgres** and the **backend API** in Docker with hot-reload enabled.

### 4. Apply database migrations

On first run (or after pulling new migrations):

```bash
npm run docker:migrate
```

### 5. Start the mobile app

In a separate terminal:

```bash
npm run dev:mobile
```

Scan the QR code with the Expo Go app, or press `w` for web / `a` for Android emulator.

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Auto-overridden by Docker Compose — set to `postgresql://postgres:postgres@localhost:5432/hazina` for running outside Docker |
| `JWT_SECRET` | Yes | Random string, minimum 16 characters |
| `JWT_ACCESS_EXPIRES_IN` | No | Default: `7d` |
| `JWT_REFRESH_EXPIRES_IN` | No | Default: `30d` |
| `MPESA_CONSUMER_KEY` | No | M-Pesa Daraja API consumer key |
| `MPESA_CONSUMER_SECRET` | No | M-Pesa Daraja API consumer secret |
| `MPESA_PASSKEY` | No | M-Pesa STK Push passkey |
| `MPESA_SHORTCODE` | No | M-Pesa business shortcode |
| `MPESA_CALLBACK_URL` | No | Public URL for M-Pesa payment callbacks |
| `AT_API_KEY` | No | Africa's Talking API key (SMS / OTP) |
| `AT_USERNAME` | No | Africa's Talking username (default: `sandbox`) |
| `FRONTEND_URL` | No | Mobile app origin for CORS (default: `http://localhost:8081`) |

> **Docker Compose automatically overrides `DATABASE_URL`** to point to the `postgres` container — you never need to change this for Docker usage.

---

## Scripts

### Docker (full stack)

| Script | Description |
|---|---|
| `npm run docker:up` | Start all services in background |
| `npm run docker:up:build` | Rebuild images and start all services |
| `npm run docker:down` | Stop all services |
| `npm run docker:reset` | Wipe volumes and restart from scratch |
| `npm run docker:logs` | Tail logs for all services |
| `npm run docker:logs:backend` | Tail backend logs only |
| `npm run docker:migrate` | Apply pending migrations (production-safe) |
| `npm run docker:migrate:dev` | Create + apply a new migration interactively |
| `npm run docker:shell` | Open a shell inside the backend container |

### Database only (Postgres without backend)

| Script | Description |
|---|---|
| `npm run db:up` | Start only the Postgres container |
| `npm run db:down` | Stop only the Postgres container |
| `npm run db:reset` | Wipe DB volume and restart Postgres |

### Development (local, outside Docker)

| Script | Description |
|---|---|
| `npm run dev:backend` | Start backend locally with `ts-node-dev` |
| `npm run dev:mobile` | Start Expo mobile app |
| `npm run build` | Compile backend TypeScript to `dist/` |
| `npm run lint` | TypeScript type-check (no emit) |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:migrate` | Run `prisma migrate dev` locally |

---

## Development Workflow

### Making backend changes

The `backend/src` directory is volume-mounted into the Docker container. `ts-node-dev` watches for changes and restarts automatically — **no rebuild required** for source changes.

If you change `package.json` or `prisma/schema.prisma`, rebuild the image:

```bash
npm run docker:up:build
```

### Adding a new migration

```bash
npm run docker:migrate:dev
# Enter a migration name when prompted, e.g. "add_notifications_table"
```

### Inspecting the database

```bash
# Prisma Studio (GUI) — opens on http://localhost:5555
npm run docker:studio

# Or connect directly with any SQL client:
# Host: localhost | Port: 5432 | User: postgres | Password: postgres | DB: hazina
```

### Production build

Set `BACKEND_TARGET=production` in a root-level `.env` file, then rebuild:

```bash
echo "BACKEND_TARGET=production" > .env
npm run docker:up:build
```

The production image compiles TypeScript, runs `prisma migrate deploy` on startup, and serves the compiled `dist/` with no dev dependencies.

---

## Project Structure

```
ChamaApp/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Full data model
│   │   └── migrations/         # SQL migration history
│   ├── src/
│   │   ├── config/env.ts       # Validated environment config (Zod)
│   │   ├── routes/             # Express route handlers
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Auth, error handling
│   │   ├── cron/               # Scheduled jobs (penalties, reminders, payouts)
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # HTTP + Socket.io server entry point
│   ├── Dockerfile              # Multi-stage build (dev / builder / production)
│   ├── .dockerignore
│   └── .env                    # Local secrets — NOT committed
├── mobile/
│   ├── src/
│   │   ├── api/client.ts       # Axios client with auth interceptor
│   │   ├── screens/            # All app screens
│   │   └── AppNavigator.tsx    # Navigation structure
│   └── App.tsx
├── docker-compose.yml          # Postgres + backend services
├── package.json                # Monorepo scripts
└── README.md
```

---

## API Overview

Base URL: `http://localhost:4000/api`

| Prefix | Description |
|---|---|
| `GET /` | Health check |
| `/api/auth` | OTP request, OTP verify, token refresh |
| `/api/chamas` | Create, list, and manage chamas |
| `/api/chamas/:id/members` | Member management |
| `/api/chamas/:id/cycles` | Contribution cycle management |
| `/api/chamas/:id/loans` | Loan applications and voting |
| `/api/chamas/:id/mgr` | Merry-go-round schedule |
| `/api/mpesa` | M-Pesa STK Push and callbacks |
| `/api/credit-score` | Member credit score lookup |

---

## Background Jobs (Cron)

| Schedule | Job |
|---|---|
| Every 10 minutes | Reconcile pending M-Pesa transactions |
| Hourly | Expire stale swap requests |
| Daily 06:00 | Process MGR payouts |
| Daily 07:00 | Auto-create contribution cycles |
| Daily 08:00 | Apply late contribution penalties |
| Daily 09:00 | Send SMS contribution reminders |
| 1st of month 01:00 | Recalculate all member credit scores |

---

## Troubleshooting

**Backend exits immediately after starting**
Check logs: `npm run docker:logs:backend`. Most likely a missing or invalid `.env` value (e.g. `JWT_SECRET` too short or `DATABASE_URL` malformed).

**"Relation does not exist" errors**
Migrations haven't been applied: `npm run docker:migrate`

**Port 5432 or 4000 already in use**
Another process is using that port. Stop it, or change the host-side port mapping in `docker-compose.yml` (e.g. `"5433:5432"`).

**Mobile app can't reach the API on a physical device**
The device can't resolve `localhost` — it needs your machine's LAN IP. In `mobile/src/api/client.ts` or via the in-app backend URL override, set the base URL to `http://<your-lan-ip>:4000/api`.

**Changes to `package.json` not picked up in container**
Run `npm run docker:up:build` to rebuild the image.