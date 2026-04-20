# FlowSignal

FlowSignal is a lead-generation website plus gated advisory portal for Indian
accountants, CFOs, and treasury teams dealing with cross-border payments. The
app has a public acquisition site and a protected member portal for diagnostics,
resources, and advisory preparation.

## Public Pages

- `/` Home
- `/intelligence` Intelligence model
- `/for-accountants` Accountant positioning
- `/insights` Advisory notes
- `/sign-in` Login

## Protected Pages

- `/dashboard` Flow Diagnostics
- `/dashboard/route-review` Route Review
- `/dashboard/resources` Downloadable resources
- `/dashboard/account` Account and workspace access

## Tech Stack

- **Framework**: Next.js
- **Database**: Postgres
- **ORM**: Drizzle
- **Auth**: Email/password with JWT cookies
- **UI**: Tailwind CSS and local shadcn-style components
- **Runtime**: Node 22+ and pnpm 10

## Prerequisites

- Node.js `>=22 <25`
- pnpm `>=10 <11`
- Docker Desktop, if using the local Postgres flow

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create local environment variables:

```bash
cp .env.example .env
```

Generate a fresh `AUTH_SECRET` and replace the placeholder in `.env`:

```bash
openssl rand -hex 32
```

Start local Postgres:

```bash
docker compose up -d
```

Run migrations and seed the demo portal user:

```bash
pnpm db:migrate
pnpm db:seed
```

Start the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

The seed script creates a local portal user:

- User: `test@test.com`
- Password: `admin123`

## Alternate Setup Helper

The interactive setup helper can create `.env` and start local Postgres through
Docker:

```bash
pnpm db:setup
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Environment

Required local variables:

- `POSTGRES_URL`
- `BASE_URL`
- `AUTH_SECRET`

`.env.example` uses the local Docker Postgres URL:
`postgres://postgres:postgres@localhost:54322/postgres`.

## Validation

Currently declared scripts:

- `pnpm build`
- `pnpm dev`
- `pnpm lint`
- `pnpm test`
- `pnpm typecheck`

Database and runtime helpers:

- `pnpm start`
- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm db:setup`
- `pnpm db:studio`

The GitHub Actions workflow in `.github/workflows/ci.yml` runs install, lint,
typecheck, test, and build.
