# FlowSignal

FlowSignal is a cross-border flow intelligence workspace for professional
advisory teams. The app keeps the existing authentication and protected routes,
then shapes the public experience and member dashboard around FlowSignal
positioning, tools, and resources.

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

## Getting Started

```bash
pnpm install
pnpm db:setup
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

The seed script creates a local test user:

- User: `test@test.com`
- Password: `admin123`

## Environment

`pnpm db:setup` creates `.env` with:

- `POSTGRES_URL`
- `BASE_URL`
- `AUTH_SECRET`
