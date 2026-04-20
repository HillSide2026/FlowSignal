# FlowSignal MVP Build Backlog

## Rules For Working This Backlog

Work in order unless a security issue or validation blocker requires the stop-and-fix rule.
Each task should be a small, reviewable change set with validation.

Do not implement payment execution.
Do not introduce ML, hidden scoring, or partner ranking by incentives.
Do not add new major infrastructure without explicit approval.

## Task 0: Freeze MVP Specs

Status: ready for review.

Deliverables:

* `PRD.md`
* `USER_FLOWS.md`
* `TECH_SPEC.md`
* `TASKS.md`
* `BUILD_INSTRUCTIONS.md`

Validation:

* `git diff --check`

## Task 1: Confirm App Shell And Visual Review Loop

Goal: make sure the existing app can be reviewed locally.

Deliverables:

* run local app with seeded user
* verify homepage, sign-in, dashboard, and current route-review page visually
* document any layout or setup blockers

Validation:

* `pnpm dev`
* browser review on desktop and mobile viewport

## Task 2: Add Scenario Types And Shared Constants

Goal: define the MVP domain language before UI and persistence.

Deliverables:

* TypeScript types for scenario input, route output, recommendation, provider match, and FlowPoints metadata
* shared constants for supported corridors, use cases, priorities, and directions

Suggested files:

* `lib/route-intelligence/types.ts`
* `lib/route-intelligence/constants.ts`

Validation:

* `pnpm typecheck`
* `pnpm test`

## Task 3: Add JSON Route And Partner Config

Goal: create deterministic seed config for first supported corridors.

Deliverables:

* route config for India to US, India to UAE, India to Singapore, India to UK, and India to EU
* partner config with at least one FlowPoints-enabled partner
* config schema validation

Suggested files:

* `lib/route-intelligence/config/routes.json`
* `lib/route-intelligence/config/partners.json`
* `lib/route-intelligence/config/schema.ts`

Validation:

* `pnpm typecheck`
* `pnpm test`

## Task 4: Implement Rule-Based Route Evaluation

Goal: return structured route outputs from scenario input.

Deliverables:

* deterministic evaluator
* unsupported scenario handling
* tests for supported and unsupported scenarios

Suggested files:

* `lib/route-intelligence/evaluate.ts`
* `tests/route-intelligence.test.ts`

Validation:

* `pnpm test`
* `pnpm typecheck`

## Task 5: Implement Recommendation Layer

Goal: transform route outputs into contextual recommendations.

Deliverables:

* best for cost, speed, and simplicity recommendations
* explanation required for each recommendation
* no forced universal winner
* tests that recommendations are explainable and deterministic

Suggested files:

* `lib/route-intelligence/recommend.ts`
* `tests/route-intelligence.test.ts`

Validation:

* `pnpm test`
* `pnpm typecheck`

## Task 6: Implement Partner Matching

Goal: match providers based on route and scenario fit.

Deliverables:

* partner matching function
* "why this partner" output
* tests proving FlowPoints do not affect matching

Suggested files:

* `lib/route-intelligence/match-partners.ts`
* `tests/partner-matching.test.ts`

Validation:

* `pnpm test`
* `pnpm typecheck`

## Task 7: Add FlowPoints Metadata Display Logic

Goal: attach FlowPoints after matching without biasing decisions.

Deliverables:

* FlowPoints metadata type
* disclosure text
* tests proving incentives do not affect route or partner order

Validation:

* `pnpm test`
* `pnpm typecheck`

## Task 8: Add Scenario Persistence Schema

Goal: save scenarios and evaluated results.

Deliverables:

* Drizzle schema additions
* migration
* query helpers with authorization checks

Suggested entities:

* `payment_scenarios`
* `scenario_results`

Validation:

* `pnpm db:generate`
* `pnpm db:migrate`
* `pnpm test`
* `pnpm typecheck`

## Task 9: Build Scenario Questionnaire Page

Goal: let authenticated users submit scenarios.

Deliverables:

* protected questionnaire page
* validation for required fields
* submit action creates scenario, evaluates result, and redirects

Suggested route:

* `/dashboard/scenarios/new`

Validation:

* `pnpm lint`
* `pnpm typecheck`
* manual local form submission

## Task 10: Build Scenario Results Page

Goal: render the structured route output.

Deliverables:

* scenario summary
* route cards
* comparison layer
* contextual recommendations
* unsupported state

Suggested route:

* `/dashboard/scenarios/[id]`

Validation:

* `pnpm lint`
* `pnpm typecheck`
* visual review

## Task 11: Add Partner Cards And Handoff Intent

Goal: show relevant partner matches downstream of route logic.

Deliverables:

* partner cards
* "why this partner" explanation
* optional handoff intent recording

Validation:

* `pnpm test`
* `pnpm typecheck`
* visual review

## Task 12: Add FlowPoints Label And Disclosure

Goal: show incentives safely and secondarily.

Deliverables:

* "+ Earn X FlowPoints" label
* "Incentives do not affect recommendations" disclosure
* placement after fit and tradeoffs

Validation:

* `pnpm lint`
* `pnpm typecheck`
* visual review

## Task 13: Add Saved Scenarios Dashboard

Goal: make the portal useful after the first scenario.

Deliverables:

* saved scenario list
* create new scenario CTA
* empty state
* links to results

Validation:

* `pnpm lint`
* `pnpm typecheck`
* manual local review with seed data

## Task 14: Seed Demo Scenarios

Goal: make product review deterministic.

Deliverables:

* seed user has sample scenarios and results
* at least one FlowPoints example
* README or docs mention demo path

Validation:

* `pnpm db:seed`
* manual sign-in with demo user

## Task 15: Add Admin-Editable Route And Partner Config

Goal: make route and partner assumptions easy to update.

First pass:

* repo-managed JSON config with schema validation
* no full admin UI unless explicitly requested

Later pass:

* database-backed config and protected admin UI

Validation:

* config validation test
* `pnpm test`

## Task 16: Polish Copy, Empty States, And Guardrails

Goal: remove generic SaaS filler and align the product language.

Deliverables:

* no payment execution claims
* no guaranteed savings claims
* no fake precision
* clear unsupported-state copy
* clear FlowPoints disclosure

Validation:

* visual review
* copy review against `AGENT.md`

## Task 17: Add MVP Smoke Coverage

Goal: protect the core user journey.

Deliverables:

* smoke coverage for public homepage
* smoke coverage for protected scenario flow
* smoke coverage for saved results

Validation:

* `pnpm test`
* CI passes
