# PLAN.md

## Goal

Advance FlowSignal from a prototype SaaS shell into:

* a strong public acquisition site for Indian accountants, CFOs, and treasury teams dealing with cross-border payments
* a gated advisory portal with user-specific proprietary content and diagnostics
* a lead-generation and lead-qualification system for fintech payment services

## Operating rule

Work milestone by milestone.
Do not jump ahead.
Do not do broad rewrites.
Do not combine unrelated tasks in one pass.

For each task:

* inspect relevant code
* summarize current behavior
* identify the smallest high-leverage improvement
* implement only that change
* run relevant validation
* report results and next recommended task

If validation fails, stop and fix before moving on.

## Priority order

1. Security and sensitive-data handling
2. Server-side authorization correctness
3. Deterministic local setup
4. Lint, typecheck, test, CI
5. Public-site conversion quality
6. Portal usefulness and personalization
7. Product-domain data model
8. UX polish and iteration

## Product lens

Public site:

* attract Indian accountants, CFOs, and treasury teams
* build trust quickly
* explain cross-border payment pain points clearly
* convert visitors into leads

Portal:

* feel useful within the first minute
* provide proprietary and user-relevant information
* deepen engagement
* surface intent and qualification signals for fintech payment services

## Milestone 0: Baseline repo audit

Objective:

Confirm current setup, commands, missing environment pieces, and major blockers.

Tasks:

* inspect package scripts, README, env usage, DB setup, auth paths, and route structure
* produce a short baseline note in `docs/baseline-audit.md`

Acceptance criteria:

* clear list of run commands
* clear list of missing setup pieces
* clear list of security/auth blockers
* clear map of public vs portal routes

Validation:

* verify commands exist or document what is missing

## Milestone 1: Security and auth hardening

Objective:

Remove confirmed sensitive-data exposure and enforce server-side authorization.

Tasks:

* whitelist safe user fields in API responses
* stop returning password values in server action state
* enforce owner/admin checks on server-side team actions
* review auth/session code for obvious exposure issues

Acceptance criteria:

* password hashes are never returned from API routes
* password fields are never echoed back to the UI
* owner-only actions are enforced on the server
* changes are narrow and documented

Validation:

* run targeted tests if available
* otherwise run typecheck/lint/build where possible
* include file-by-file summary of patched areas

## Milestone 2: Deterministic local setup

Objective:

Make the app runnable and reviewable by humans and Codex.

Tasks:

* add or improve `.env.example`
* document required Node and package-manager versions
* document local Postgres/Docker flow clearly
* ensure seed/demo user flow is documented
* make setup steps deterministic and minimal

Acceptance criteria:

* a new contributor can follow documented setup without guesswork
* package manager and runtime expectations are explicit
* env variables required for local run are listed
* demo or seed path for portal access is documented

Validation:

* run install/build/dev-adjacent commands if environment allows
* document exactly what could and could not be verified

## Milestone 3: Guardrails and CI

Objective:

Create a reliable validation loop for Codex and humans.

Tasks:

* add lint script if missing
* add typecheck script if missing
* add minimal test script if missing
* add a minimal CI workflow that runs the canonical checks
* add at least a few high-value tests around auth/team behavior

Acceptance criteria:

* canonical scripts exist for lint, typecheck, test, build
* CI runs the relevant checks
* at least one auth-sensitive flow and one permission-sensitive flow are covered

Validation:

* run the same scripts locally if possible
* include CI file path and commands in report

## Milestone 4: Public-site positioning and homepage conversion

Objective:

Make the public site clearly valuable to the target audience and better at lead origination.

Tasks:

* review homepage messaging and CTA structure
* improve hero, proof/trust sections, audience specificity, and CTA flow
* align copy to Indian accountants, CFOs, and treasury teams handling cross-border payments
* avoid vague generic fintech language

Acceptance criteria:

* homepage clearly states audience, problem, and value
* primary CTA and secondary CTA are clear
* trust and credibility are improved
* copy is concrete and professional

Validation:

* run build/typecheck
* if app is runnable, verify homepage visually
* report exact sections changed

## Milestone 5: Lead capture and qualification foundations

Objective:

Convert more visitors and capture useful qualification data.

Tasks:

* improve signup/request-access/contact flows
* add role/company/use-case segmentation fields where appropriate
* ensure captured information helps route leads to fintech payment-service follow-up
* keep friction low

Acceptance criteria:

* at least one lead capture path asks for useful qualification signals
* the flow feels targeted to finance professionals
* fields are minimal and intentional

Validation:

* run relevant checks
* document data captured and where it flows

## Milestone 6: Portal usefulness pass

Objective:

Make the portal feel like a real advisory workspace instead of generic SaaS filler.

Tasks:

* review dashboard landing and portal navigation
* prioritize user-specific insight, proprietary content, diagnostics, and next steps
* remove or reduce generic dashboard elements that do not support the product goal

Acceptance criteria:

* portal landing communicates user-specific value
* users can quickly find resources, diagnostics, and recommended next steps
* portal feels tied to cross-border payments advisory

Validation:

* build/typecheck
* visual verification if runnable
* report before/after structure of the landing experience

## Milestone 7: First real product-domain model

Objective:

Add the minimum durable data model needed for real product behavior.

Preferred entities:

* `lead_profile`
* `corridor`
* `payment_scenario`
* `saved_diagnostic`
* `advisory_resource`
* `engagement_event`
* `qualification_status`

Tasks:

* introduce only the minimum subset needed for one real workflow
* connect one existing tool or portal flow to persistence
* avoid overdesign

Acceptance criteria:

* at least one previously ephemeral portal interaction is now persistable
* naming reflects product language
* schema changes are small and well explained

Validation:

* migration/build/typecheck/test as available
* document schema additions and intended use

## Milestone 8: Demoability and frontend review loop

Objective:

Make the app easy to review visually and functionally.

Tasks:

* add stable seed/demo states
* add minimal smoke tests for public and protected paths
* ensure a reviewer can inspect homepage, auth flow, and portal landing quickly

Acceptance criteria:

* there is a documented demo user or seeded review path
* smoke coverage exists for core user journeys
* frontend review no longer depends on guesswork

Validation:

* run smoke tests if configured
* report exact demo path

## Stop-and-fix rule

If a task uncovers a confirmed security issue, broken validation, or setup blocker that prevents safe progress:

* stop
* fix the blocker first
* document why the plan sequence changed

## Default execution format

At the end of each pass, return:

* Milestone
* Current area reviewed
* What I found
* Chosen task
* Changes made
* Validation performed
* Remaining risks
* Recommended next single task
