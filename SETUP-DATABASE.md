# PostgreSQL setup for ChamaApp (Hazina)

Follow these steps to create and connect PostgreSQL for the backend.

---

## If Docker won’t download

Use **Option B** below and install PostgreSQL directly on Windows (no Docker needed).

---

## Option A: Using Docker (optional)

Your project already has a `docker-compose.yml` that runs PostgreSQL 16.

### 1. Install Docker (if you don’t have it)

- Download: https://www.docker.com/products/docker-desktop/
- Install Docker Desktop for Windows and start it.
- Ensure Docker is running (whale icon in the system tray).

### 2. Start PostgreSQL

From the **ChamaApp** folder (where `docker-compose.yml` is):

```powershell
cd c:\Users\kyalo\ChamaApp
docker compose up -d
```

- `-d` runs the database in the background.
- First run may download the Postgres image; later runs start quickly.

### 3. Check that the database is running

```powershell
docker compose ps
```

You should see `hazina-postgres` with state **running**.

Optional: connect with a SQL client (e.g. pgAdmin, DBeaver) using:

- **Host:** localhost  
- **Port:** 5432  
- **User:** postgres  
- **Password:** postgres  
- **Database:** hazina  

---

## Option B: Install PostgreSQL on Windows (no Docker) — recommended if Docker won’t download

### 1. Install PostgreSQL

**Option B1 – Using winget (no browser download):**

Open **PowerShell** and run:

```powershell
winget install PostgreSQL.PostgreSQL.16 --accept-package-agreements --accept-source-agreements
```

Restart the terminal (or reboot) if the `psql` command isn’t found. During first-time setup, set the **postgres** user password (e.g. `postgres`) when prompted.

**Option B2 – Direct installer download:**

- Windows installers: **https://www.postgresql.org/download/windows/**
- Or EDB installer: **https://www.enterprisedb.com/downloads/postgres-postgresql-downloads**
- Pick **PostgreSQL 16** (or 15), run the `.exe`.
- During setup:
  - Set a **password for the `postgres` user** (e.g. `postgres` — remember it for `.env`).
  - Port: **5432** (default).
- You can skip Stack Builder at the end.

### 2. Create the database

**Using pgAdmin (installed with PostgreSQL):**

1. Open **pgAdmin** from the Start menu.
2. Connect to the server (use the password you set for `postgres`).
3. Right-click **Databases** → **Create** → **Database**.
4. Name: **hazina** → Save.

**Or using PowerShell (if `psql` is in your PATH):**

```powershell
$env:PGPASSWORD = "postgres"
psql -U postgres -h localhost -c "CREATE DATABASE hazina;"
```

If you used a different password, replace `postgres` in `PGPASSWORD` and in your `backend\.env` (see below).

---

## Configure the backend (both options)

### 4. Create the `.env` file

In the **backend** folder, copy the example env file:

```powershell
cd c:\Users\kyalo\ChamaApp\backend
copy .env.example .env
```

Edit `backend\.env` and set at least:

- **DATABASE_URL** – must match your PostgreSQL setup.

**If using Docker (Option A):**

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hazina?schema=public
```

**If using local PostgreSQL (Option B)** and you used a different password:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/hazina?schema=public
```

Also set a long random value for JWT (at least 16 characters):

```env
JWT_SECRET=your-long-random-secret-at-least-16-chars
```

### 5. Generate Prisma Client and create tables

Still in the backend folder:

```powershell
cd c:\Users\kyalo\ChamaApp\backend
npx prisma generate
npx prisma migrate dev
```

- `prisma generate` – generates the client used by the API.
- `prisma migrate dev` – creates the database schema (tables for users, chamas, OTP, etc.).

If prompted for a migration name, you can use something like `init`.

### 6. Verify

Start the API:

```powershell
cd c:\Users\kyalo\ChamaApp
npm run dev
```

You should see: `Hazina API listening on http://localhost:4000`.

Try sign-in in the app; if the database is set up correctly, “Request OTP” should no longer return a database-related error.

---

## Useful commands

| Task              | Command (from ChamaApp folder)   |
|------------------|-----------------------------------|
| Start DB (Docker)| `docker compose up -d`           |
| Stop DB (Docker) | `docker compose down`             |
| View DB logs     | `docker compose logs postgres`    |
| Reset DB (Docker)| `docker compose down -v` then `docker compose up -d`, then run `npx prisma migrate dev` again in `backend` |

---

## Troubleshooting

- **“Connection refused” or “Database unavailable”**  
  - Docker: run `docker compose up -d` and wait a few seconds.  
  - Local install: ensure the PostgreSQL service is running (Services → postgresql-x64).

- **“Authentication failed”**  
  - Check username/password in `DATABASE_URL` in `backend\.env` (e.g. `postgres` / `postgres` for Docker).

- **“Relation does not exist” or missing tables**  
  - Run `npx prisma migrate dev` inside the `backend` folder.

- **Port 5432 already in use**  
  - Another PostgreSQL instance is running. Stop it or change the port in `docker-compose.yml` and in `DATABASE_URL` (e.g. `localhost:5433`).
