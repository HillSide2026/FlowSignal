# FlowSignal MVP Technical Spec

## Stack Decision

Use the existing repo stack for the MVP.
Do not migrate frameworks, auth providers, or database layers unless a separate migration task is explicitly approved.

Locked MVP stack:

* Web app: Next.js App Router
* Language: TypeScript
* UI: React, Tailwind CSS, local shadcn-style components
* Backend: Next.js server actions and route handlers
* Database: Postgres
* ORM: Drizzle
* Auth: existing email/password auth with bcrypt password hashing and JWT session cookies
* Rule engine: deterministic JSON-configured route evaluation
* Runtime/package manager: Node 22 and pnpm 10

Supabase or Firebase are not part of the current implementation.
They remain a future migration option, not an MVP dependency.

## Existing Code Areas

Current public routes:

* `/` at `app/(dashboard)/page.tsx`
* `/intelligence` at `app/(dashboard)/intelligence/page.tsx`
* `/for-accountants` at `app/(dashboard)/for-accountants/page.tsx`
* `/insights` at `app/(dashboard)/insights/page.tsx`

Current auth routes:

* `/sign-in` at `app/(login)/sign-in/page.tsx`
* `/sign-up` at `app/(login)/sign-up/page.tsx`

Current protected routes:

* `/dashboard` at `app/(dashboard)/dashboard/page.tsx`
* `/dashboard/route-review` at `app/(dashboard)/dashboard/route-review/page.tsx`
* `/dashboard/resources` at `app/(dashboard)/dashboard/resources/page.tsx`
* `/dashboard/account` at `app/(dashboard)/dashboard/account/page.tsx`

Current data model:

* `users`
* `teams`
* `team_members`
* `activity_logs`
* `invitations`

The current schema is still SaaS-starter-shaped.
MVP product entities must be introduced narrowly.

## MVP Routes To Add Or Repurpose

Recommended app routes:

* `/dashboard/scenarios/new` for the questionnaire
* `/dashboard/scenarios/[id]` for saved scenario results
* `/dashboard/scenarios` for saved scenario list, if separate from dashboard landing

Existing pages may be repurposed only when the change is small and clear.
Avoid a broad navigation redesign in the same pass as backend model work.

## MVP Entities

### payment_scenarios

Stores the user-entered scenario.

Suggested fields:

* `id`
* `user_id`
* `team_id`, nullable until team ownership is required
* `direction`: send or receive
* `origin_country`
* `destination_country`
* `amount`
* `currency`
* `business_use_case`
* `priority`: cost, speed, or balanced
* `status`
* `created_at`
* `updated_at`

### scenario_results

Stores evaluated output for reproducible review.

Suggested fields:

* `id`
* `scenario_id`
* `rules_version`
* `routes_json`
* `comparison_json`
* `recommendations_json`
* `providers_json`
* `created_at`

### route_config

May start as JSON files in the repo before becoming database-backed.

Suggested shape:

* `id`
* `name`
* `route_type`
* `supported_corridors`
* `supported_use_cases`
* `cost_range`
* `timeline_range`
* `compliance_level`
* `documentation_requirements`
* `risk_flags`
* `tradeoff_notes`

### partner_config

May start as JSON files in the repo before becoming database-backed.

Suggested shape:

* `id`
* `name`
* `supported_routes`
* `supported_corridors`
* `supported_use_cases`
* `cost_profile`
* `speed_profile`
* `regulatory_fit`
* `best_use_case`
* `why_this_partner`
* `flow_points`, nullable
* `flow_points_disclosure`, nullable

### engagement_events

Optional for the first persistence pass.
Use this when tracking partner handoff intent or important scenario events.

Suggested fields:

* `id`
* `user_id`
* `scenario_id`
* `event_type`
* `metadata_json`
* `created_at`

## Rule Engine Approach

Start deterministic and transparent.

Recommended file area:

* `lib/route-intelligence/types.ts`
* `lib/route-intelligence/config/routes.json`
* `lib/route-intelligence/config/partners.json`
* `lib/route-intelligence/evaluate.ts`
* `lib/route-intelligence/match-partners.ts`
* `lib/route-intelligence/recommend.ts`

Evaluation order:

1. Validate scenario input.
2. Filter route config by corridor, direction, use case, amount band, and priority.
3. Produce route outputs with ranges and notes.
4. Produce comparison data.
5. Produce contextual recommendations.
6. Match partners based on route and scenario fit.
7. Attach FlowPoints metadata if applicable.

Important constraints:

* FlowPoints must not affect route filtering.
* FlowPoints must not affect route order.
* FlowPoints must not affect partner matching.
* Recommendations must include explanations.
* Unsupported scenarios must return a clear unsupported state, not fabricated outputs.

## API And Server Actions

Use server actions for form submissions where they fit existing conventions.
Use route handlers for JSON reads or actions that need API-style behavior.

Recommended routes/actions:

* `POST /api/scenarios` creates a scenario and evaluates it
* `GET /api/scenarios` lists current user's scenarios
* `GET /api/scenarios/[id]` loads one authorized scenario and result
* optional `POST /api/scenarios/[id]/handoff` records partner handoff intent

Authorization rules:

* users can only access their own scenarios unless explicit team access is implemented
* team access must be enforced server-side
* responses must whitelist fields
* never expose password hashes, tokens, internal secrets, or raw config fields not intended for users

## Frontend State

Keep state simple:

* questionnaire can use local React state or server action form state
* authenticated user state can continue using the existing `/api/user` and SWR pattern
* scenario results should be loaded server-side when possible
* avoid adding global state management for the MVP

## Testing Strategy

High-value tests first:

* route evaluator returns expected outputs for supported sample corridors
* unsupported scenarios return an unsupported result
* FlowPoints do not affect recommendations or partner matching
* users cannot load another user's scenario
* password hashes and internal fields are not returned from scenario/user APIs

Canonical validation commands:

* `pnpm lint`
* `pnpm typecheck`
* `pnpm test`
* `pnpm build`

## Local Demo Data

Seed data should support review of:

* India to US SaaS or services export
* India to UAE vendor payment
* India to Singapore vendor payment
* India to UK or EU mixed flow
* at least one partner with FlowPoints
* at least one partner without FlowPoints

Demo data must not imply live pricing or guaranteed execution.
