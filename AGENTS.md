# AGENTS.md

## What this repo is

FlowSignal is a lead-generation website plus gated advisory portal for Indian accountants, CFOs, and treasury teams dealing with cross-border payments.

The product has two primary surfaces:

1. Public acquisition site

   * attractive marketing site
   * clear positioning for Indian finance teams handling cross-border payments
   * lead capture and trust-building
   * CTA paths into consultation, signup, or portal access

2. Logged-in portal

   * user-specific workspace
   * proprietary resources, corridor guidance, payment diagnostics, and advisory content
   * intended to qualify and nurture leads for fintech payment services

This repo is not a full payments execution platform.
Prefer product decisions that improve:

* audience relevance
* trust and credibility
* lead capture
* lead qualification
* portal engagement

## Current architectural reality

This repo currently looks like a compact Next.js monolith with auth, teams, dashboard pages, and some domain-specific UI/content.
The durable backend model is still closer to a SaaS starter than a full FlowSignal domain model.

When making changes, do not assume complex domain infrastructure already exists.
Be explicit about what is:

* existing
* missing
* newly introduced

## Core product principles

When proposing or implementing changes, optimize for:

* Clarity for Indian finance users
* Trust and credibility over hype
* Fast understanding of cross-border payment scenarios
* Useful proprietary insight in the portal
* Conversion into qualified fintech payment-service leads

## Working style

For non-trivial tasks:

1. inspect relevant files first
2. summarize current behavior briefly
3. propose a short plan
4. then implement

Do not make broad refactors unless explicitly asked.
Prefer small, reviewable changes.
Prefer concrete file references in explanations.
Label uncertainty clearly.

## Safety and data handling

Treat auth, sessions, personal data, and account permissions as sensitive.
Never expose password hashes, secrets, tokens, or internal-only fields in API responses.
Do not return password values back to the UI in action state.
Enforce authorization on the server, not only in the UI.

If you find security issues:

* call them out explicitly
* patch narrowly
* avoid unrelated refactors in the same change

## Priority order for decision-making

When tradeoffs exist, prioritize in this order:

1. security and correctness
2. deterministic local setup
3. clear architecture
4. conversion and UX
5. speed of implementation
6. polish

## Commands

Use the repo's canonical commands when available.

Expected commands:

* install: pnpm install
* dev: pnpm dev
* build: pnpm build
* test: pnpm test
* lint: pnpm lint
* typecheck: pnpm typecheck

If a command is missing, note it clearly and do not invent fake scripts.
Prefer adding missing lint/typecheck/test scripts only when asked.

## Frontend guidance

Public frontend goals:

* polished, credible, conversion-oriented
* strong headline and CTA hierarchy
* audience-specific messaging for Indian accountants, CFOs, and treasury teams
* trust signals and clear use cases

Portal frontend goals:

* useful, focused, personalized
* make it obvious what is relevant to this user
* highlight proprietary resources, diagnostics, corridor guidance, and next steps
* reduce generic dashboard filler

When reviewing frontend work, assess:

* value proposition clarity
* conversion flow
* route and page structure
* component reuse
* state/data-fetching patterns
* ability to review visually with seeded/demo data

## Domain model direction

When introducing new product entities, prefer a simple first-pass model around:

* lead_profile
* corridor
* payment_scenario
* saved_diagnostic
* advisory_resource
* engagement_event
* qualification_status

Do not overdesign.
Start with the minimum schema that supports:

* segmentation
* personalization
* saved user progress
* lead qualification

## Change boundaries

Unless explicitly asked, do not:

* migrate the repo to a different framework
* introduce microservices
* replace major libraries
* add billing
* add heavy infra
* perform large visual redesigns across the whole app in one pass

## What good output looks like

A good Codex task result should include:

* what changed
* why it changed
* file list
* risks or follow-ups
* commands run
* any blockers or assumptions

## Preferred task shapes

Best tasks are:

* add or improve one page or flow
* patch one security issue
* add one domain model and its CRUD path
* improve one onboarding or portal experience
* add one set of tests
* review one area of the frontend

Avoid vague tasks like:

* "improve the whole app"
* "refactor everything"
* "make this production-ready"

## If setup is incomplete

If dependencies, env vars, or services are missing:

* say exactly what is missing
* do not pretend the app was verified visually
* continue with static code review where possible
* propose the minimum steps needed to make review possible

## Reusable Codex prompts

Use these as standard operating prompts.

### 1. Repo review

Review this repository at a high level.

Please:

* summarize what the product is
* distinguish the public acquisition site from the logged-in portal
* map the major code areas
* identify the current architecture style
* identify strengths, gaps, and technical risks
* propose immediate next steps and near-term roadmap

Constraints:

* keep it concise
* cite concrete files and directories
* do not speculate without labeling uncertainty
* do not make code changes

End with:

* What I think this repo is
* Top risks
* Recommended next 5 actions

### 2. Frontend review

Review the frontend of this repository.

Please identify:

* framework and entry points
* public-site routes/pages/layouts
* portal routes/pages/layouts
* reusable components and design patterns
* state management and data-fetching patterns
* styling system
* blockers to visual review

Then provide:

* Frontend architecture summary
* Public-site UX gaps
* Portal UX gaps
* Conversion risks
* Recommended next frontend actions

Constraints:

* reference concrete files
* do not refactor yet
* do not claim visual verification unless the app was actually run

### 3. Plan-first feature work

First inspect the relevant code and produce a short implementation plan only.

Please include:

* current behavior
* files likely to change
* risks
* edge cases
* recommended implementation sequence

Do not modify code yet.
Keep the plan brief and practical.

### 4. Safe implementation

Implement the approved plan with the smallest reviewable change set.

Requirements:

* preserve existing conventions
* avoid unrelated refactors
* keep server-side authorization explicit
* do not expose sensitive fields
* explain what changed and why
* list commands run and results
* list any follow-up items separately

### 5. Homepage work

Review the current public homepage and improve it for conversion.

Audience:
Indian accountants, CFOs, and treasury teams dealing with cross-border payments.

Goals:

* clearer value proposition
* stronger trust and credibility
* better CTA structure
* better lead origination

Please:

* inspect current homepage structure
* identify messaging gaps
* propose a concise section-by-section improvement plan
* then implement only the first high-impact pass

Do not redesign the entire app.
Do not introduce new dependencies unless necessary.

### 6. Portal work

Review the logged-in portal and improve it so users get more user-specific value.

Goals:

* make the portal feel personalized
* surface proprietary content and diagnostics clearly
* make next steps obvious
* support lead qualification

Please:

* inspect current dashboard/account/workspace areas
* identify generic SaaS filler vs real product value
* propose a focused improvement plan
* implement one small high-impact improvement

### 7. Security patching

Review the auth and account-related code for sensitive-data exposure and authorization gaps.

Focus on:

* API response field whitelisting
* password handling
* session/auth flows
* server-side RBAC enforcement

Please:

* identify issues with concrete file references
* patch only the confirmed issues
* avoid unrelated cleanup
* summarize risks and any remaining follow-ups
