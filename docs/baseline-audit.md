# Baseline Audit

Date: 2026-04-19

## Scope

Milestone 0 audit of setup, commands, environment usage, database setup, auth paths, and route structure. No visual verification was performed.

## Current Product Shape

FlowSignal is currently a compact Next.js monolith with:

* a public acquisition surface under `app/(dashboard)` for `/`, `/intelligence`, `/for-accountants`, and `/insights`
* a login surface under `app/(login)` for `/sign-in` and `/sign-up`
* a protected portal under `app/(dashboard)/dashboard` for diagnostics, route review, resources, and account/workspace access
* local UI primitives in `components/ui`
* Postgres persistence through Drizzle in `lib/db`

The durable model is still the SaaS-starter model in `lib/db/schema.ts`: `users`, `teams`, `team_members`, `activity_logs`, and `invitations`.

## Command Surface

Declared in `package.json`:

* `pnpm dev`
* `pnpm build`
* `pnpm start`
* `pnpm db:setup`
* `pnpm db:seed`
* `pnpm db:generate`
* `pnpm db:migrate`
* `pnpm db:studio`

Expected but missing:

* None for Milestone 3 after this pass.

## Setup State

Present:

* `README.md` documents install, DB setup, migration, seed, and dev commands.
* `.env.example` lists `POSTGRES_URL`, `BASE_URL`, and `AUTH_SECRET`.
* `package.json` pins `pnpm@10.33.0` and documents Node/pnpm engine ranges.
* `.nvmrc` documents Node 22 as the default local runtime.
* `docker-compose.yml` provides a committed local Postgres service on port `54322`.
* `lib/db/setup.ts` can generate `.env` and start local Docker Compose Postgres interactively.
* `lib/db/seed.ts` creates a demo owner user: `test@test.com` / `admin123`.

Missing or incomplete:

* `node_modules` was not installed at audit start; dependencies were installed during validation and remain ignored by git.
* `.env` is not present in the current checkout.
* No CI workflow is present.
* No dedicated database-backed integration test suite is present.

## Environment Usage

* `lib/db/drizzle.ts` requires `POSTGRES_URL`.
* `lib/auth/session.ts` uses `AUTH_SECRET` for JWT signing.
* `lib/db/setup.ts` writes `POSTGRES_URL`, `BASE_URL`, and `AUTH_SECRET` to `.env`.

## Route Map

Public acquisition routes:

* `/` -> `app/(dashboard)/page.tsx`
* `/intelligence` -> `app/(dashboard)/intelligence/page.tsx`
* `/for-accountants` -> `app/(dashboard)/for-accountants/page.tsx`
* `/insights` -> `app/(dashboard)/insights/page.tsx`

Auth routes:

* `/sign-in` -> `app/(login)/sign-in/page.tsx`
* `/sign-up` -> `app/(login)/sign-up/page.tsx`

Portal routes protected by `middleware.ts`:

* `/dashboard` -> `app/(dashboard)/dashboard/page.tsx`
* `/dashboard/route-review` -> `app/(dashboard)/dashboard/route-review/page.tsx`
* `/dashboard/resources` -> `app/(dashboard)/dashboard/resources/page.tsx`
* `/dashboard/account` -> `app/(dashboard)/dashboard/account/page.tsx`

API routes:

* `/api/user` -> `app/api/user/route.ts`
* `/api/team` -> `app/api/team/route.ts`

## Security And Auth Blockers Confirmed

These were confirmed during the audit and triggered the stop-and-fix rule:

* `app/api/user/route.ts` returned `getUser()` directly, which could include sensitive fields from `users`, including `passwordHash`.
* `app/layout.tsx` used `getUser()` as the SWR fallback for `/api/user`, which could also expose the full user row to the client.
* `app/(login)/actions.ts` returned submitted password values in several error states.
* `inviteTeamMember` and `removeTeamMember` were owner-gated in the UI, but server-side action code did not enforce owner membership.
* `lib/auth/session.ts` did not explicitly reject a missing or placeholder `AUTH_SECRET`.

Status after this pass:

* `/api/user` and the SWR fallback now use a safe user serializer.
* Password values are no longer returned in server action error states.
* Team invite/remove actions now enforce owner membership on the server.
* `AUTH_SECRET` now fails closed when absent, too short, or left as the `.env.example` placeholder.

## Milestone 2 Setup Improvements Completed

This pass also completed the highest-leverage deterministic setup improvements:

* `package.json` now declares `packageManager` and `engines`.
* `.nvmrc` now declares Node 22 for local contributors using nvm-compatible tooling.
* `.env.example` now contains concrete local defaults and `AUTH_SECRET` generation guidance.
* `docker-compose.yml` now provides a committed local Postgres service.
* `README.md` now documents the direct local setup path and the alternate interactive `pnpm db:setup` helper.
* `next.config.ts` now sets the Turbopack root explicitly so local builds do not infer the root from a parent lockfile.

## Milestone 3 Guardrails Completed

This pass added the first reliable validation loop:

* `package.json` now defines `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
* `eslint.config.mjs` configures ESLint with Next.js rules.
* `tests/auth.test.ts` covers safe user serialization, session secret validation, and workspace-management role checks.
* `.github/workflows/ci.yml` runs install, lint, typecheck, tests, and build.

## Highest-Priority Next Work

The audit confirmed sensitive-data exposure and authorization gaps, so this pass applied a narrow Milestone 1 stop-and-fix patch before moving on. Milestones 2 and 3 are now covered at a first practical level; the next planned milestone is Milestone 4: public-site positioning and homepage conversion.
