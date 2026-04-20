# FlowSignal Build Instructions

## What FlowSignal Is

FlowSignal is an advisory intelligence platform for Indian finance teams managing cross-border payments.
It helps users understand route options, tradeoffs, compliance requirements, and relevant partner fit before execution.

## What FlowSignal Is Not

FlowSignal is not a payments processor.
It does not:

* hold funds
* move money
* connect to bank accounts for execution
* guarantee pricing or timelines
* rank partners by incentives
* make the decision for the user

## Target User

Build for:

* Indian CFOs
* external accountants
* treasury and finance operations teams

Prioritize:

* SaaS exporters
* import/export businesses
* companies with recurring international flows

## MVP Pages

The first release is limited to:

* homepage
* sign in and sign up
* scenario questionnaire
* results page with route breakdown
* partner recommendation cards
* FlowPoints display
* basic user dashboard with saved scenarios

Do not add broad new product areas unless explicitly requested.

## MVP Entities

Use these product concepts consistently:

* Scenario: the user's payment context
* Route: a method of executing payment
* Provider: a bank or fintech enabling a route
* Tradeoff: cost vs. speed vs. complexity vs. compliance
* FlowPoints: secondary incentive metadata

Preferred persistence entities:

* `payment_scenarios`
* `scenario_results`
* optional `engagement_events`

Config may start as JSON:

* route config
* partner config
* FlowPoints metadata attached to partner config

## Locked Technical Architecture

Use the current repo stack:

* Next.js App Router
* TypeScript
* React
* Tailwind CSS
* local UI components
* Postgres
* Drizzle
* existing email/password auth with JWT cookies
* Next.js server actions and route handlers
* deterministic JSON-configured route evaluation

Do not introduce:

* payment execution infrastructure
* ML decisioning
* hidden scoring
* partner marketplace mechanics
* Supabase or Firebase migration
* microservices
* heavy admin infrastructure

## UI Tone

The UI should feel:

* clean
* direct
* trustworthy
* financially literate
* calm under uncertainty

Use:

* route options
* realistic ranges
* tradeoffs
* recommended based on fit
* incentives do not affect recommendations

Avoid:

* guaranteed savings
* exact pricing
* best provider
* top ranked
* highest payout
* black-box score

## Implementation Order

Keep the logic order strict:

1. scenario intake
2. route evaluation
3. comparison and recommendation explanation
4. partner matching
5. FlowPoints metadata display
6. saved scenarios and dashboard review

FlowPoints must never influence route selection, route order, recommendation logic, or partner matching.

## Coding Conventions

Follow existing repo patterns:

* keep changes small and reviewable
* use server-side authorization
* whitelist API response fields
* do not expose password hashes, tokens, secrets, or internal-only fields
* use Drizzle for database access
* use TypeScript types for product-domain structures
* add focused tests for route logic, authorization, and FlowPoints neutrality

## Validation

Run the relevant commands for each task:

* `pnpm lint`
* `pnpm typecheck`
* `pnpm test`
* `pnpm build`

For visual work, run the app and state exactly what was reviewed.
Do not claim visual verification unless it actually happened.

## Current Build Queue

Use `TASKS.md` as the ordered backlog.
Use `PRD.md`, `USER_FLOWS.md`, and `TECH_SPEC.md` as the implementation source of truth.
