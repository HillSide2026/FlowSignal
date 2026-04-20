# AGENT.md

## What this repo is

FlowSignal is an advisory intelligence platform for Indian finance teams managing cross-border payments.
It helps accountants, CFOs, and treasury teams:

* understand how money moves across borders
* evaluate routes, costs, timelines, and compliance requirements
* compare tradeoffs across options
* connect with relevant fintech partners when ready to execute

FlowSignal is not a payments processor.
It is an intelligence and decision-support layer before execution.

FlowSignal may reward users with FlowPoints, which are small incentives available when users choose to execute through certain recommended and trusted partners.
FlowPoints do not change FlowSignal's role as an advisory intelligence layer.

The product has two primary surfaces:

1. Public acquisition site

   * clear positioning for Indian finance teams handling cross-border payments
   * trust-building and lead capture
   * CTA paths into scenario intake, consultation, signup, or portal access
   * core message: "Understand your routes before you move money."

2. Logged-in portal

   * lightweight scenario intake
   * user-specific route, cost, timeline, compliance, and risk breakdowns
   * contextual recommendations that explain tradeoffs instead of making decisions
   * relevant partner matching when the user is ready to execute

This repo is not a full payments execution platform.
Prefer product decisions that improve:

* confidence
* transparency
* trust
* audience relevance
* lead capture and qualification
* portal engagement

## Product experience

The intended product flow is:

1. Pre-sign-in homepage

   * communicate value clearly
   * anchor the positioning around clarity before execution
   * keep the public experience lean, clean, and dashboard-like where appropriate

2. Scenario intake after sign-in

   Capture a minimal structured scenario:

   * direction: send or receive
   * corridor: origin country to destination country
   * amount and currency
   * business use case, such as SaaS exports or vendor payments
   * priority: cost, speed, or balanced

3. Scenario-based route breakdown

   For each viable route, show:

   * route type, such as SWIFT, fintech-assisted, or local rails
   * cost range, not exact pricing
   * expected timeline
   * compliance and documentation requirements
   * risk flags

4. Comparison layer

   * compare cost vs. speed vs. complexity
   * show relative positioning across routes
   * avoid declaring a single universal winner

5. Contextual recommendations

   Recommendations should be contextual, not absolute:

   * best for cost
   * best for speed
   * best for simplicity

   Each recommendation must explain:

   * why it fits the scenario
   * what tradeoffs exist

6. Partner matching layer

   Show partner matches only when relevant.
   Providers should be mapped to routes with a "why this partner" explanation covering:

   * cost profile
   * speed
   * regulatory fit
   * best use case

   Partner matching is not a marketplace, not ranked listings, and should not imply hidden bias.

7. Incentive layer: FlowPoints

   FlowPoints sit after partner matching.
   They:

   * display incentive availability for specific partners
   * reward users after successful partner usage
   * operate independently of route and recommendation logic

   FlowPoints must not influence:

   * route selection
   * route ranking
   * partner matching
   * recommendations

## Core product principle

FlowSignal does not make decisions.
It structures the decision so finance teams can make it confidently.

Avoid:

* black-box outputs
* "best route" claims without context
* opaque scoring
* guaranteed savings or timelines

Prioritize:

* transparency
* structured outputs
* explainability
* realistic ranges
* clear tradeoffs

## Current architectural reality

This repo currently looks like a compact Next.js monolith with auth, teams, dashboard pages, and some domain-specific UI/content.
The durable backend model is still closer to a SaaS starter than a full FlowSignal domain model.

When making changes, do not assume complex domain infrastructure already exists.
Be explicit about what is:

* existing
* missing
* newly introduced

## MVP build source of truth

For implementation work, read these root docs before changing code:

* `PRD.md`: what the MVP does and does not do
* `USER_FLOWS.md`: pre-sign-in, sign-in, questionnaire, results, partner handoff, FlowPoints, and saved scenario flows
* `TECH_SPEC.md`: locked stack, entities, API shape, route engine, persistence, and testing approach
* `TASKS.md`: ordered implementation backlog
* `BUILD_INSTRUCTIONS.md`: short repo brief for Codex build tasks

Do not treat this file alone as the implementation plan.
`AGENT.md` sets product and working guardrails; the MVP docs translate those guardrails into buildable artifacts.

## Product architecture direction

Align product work to this experience:

1. Scenario intake layer

   * lightweight structured form
   * minimal friction
   * defines context and need

2. Route intelligence engine

   Determines:

   * viable routes
   * cost ranges
   * timelines
   * compliance requirements
   * risk signals

   Start rule-based, corridor-aware, use-case-aware, and deterministic.

3. Decision layer

   Transforms route data into:

   * comparisons
   * tradeoffs
   * contextual recommendations

   Do not introduce hard scoring or forced ranking unless explicitly asked.

4. Partner matching layer

   * map providers to routes
   * explain fit instead of ranking providers
   * support qualified lead handoff
   * base matching on use-case fit, not monetization visibility
   * never factor FlowPoints or other incentives into partner selection

5. Incentive layer: FlowPoints

   * display incentives as secondary metadata after route and partner fit
   * reward users after successful partner usage where applicable
   * keep incentive logic independent from route intelligence, recommendations, and matching
   * disclose clearly that incentives do not affect recommendations

## Key product concepts

Use this language consistently:

* Scenario: the user's payment context
* Route: the method of executing payment
* Provider: the bank or fintech enabling a route
* Tradeoff: cost vs. speed vs. complexity vs. compliance
* FlowPoints: secondary incentive metadata that never biases recommendations or matching

## Output schema direction

Each scenario should eventually return:

1. Routes

   * name
   * cost range
   * timeline
   * compliance level
   * risk flags

2. Comparison

   * cost vs. speed vs. complexity
   * relative positioning without a forced single winner

3. Recommendations

   * contextual, not absolute
   * explanation required

4. Providers, optional

   * mapped to routes
   * "why this provider" explanation
   * FlowPoints, if applicable, clearly shown as secondary metadata
   * explanation that incentives do not affect recommendations

Display order for partner-related outputs:

1. route and partner fit
2. tradeoffs
3. incentive, if any

## Product guardrails

Neutrality:

Use:

* curated
* recommended based on fit
* network of partners
* when you're ready to execute
* earn FlowPoints
* incentive available
* does not affect recommendation

Minimize:

* best provider
* top ranked
* guaranteed savings
* best reward
* highest payout

No false precision:

Use:

* ranges, such as 0.6% to 1.2%
* relative comparisons

Avoid:

* exact pricing
* guaranteed timelines

No execution layer:

FlowSignal does not:

* hold funds
* move money
* integrate into bank accounts or fintechs in the MVP

Incentives must not bias decisions:

FlowPoints:

* must never influence recommendations
* must never override better-fit options
* must never influence route ranking or partner matching
* must always be disclosed when present

When FlowPoints are present, show them as a secondary label, such as "+ Earn X FlowPoints", paired with language like "Incentives do not affect recommendations."

The product works if a user says:

* "I understand my options, the tradeoffs, and any incentives available."

Not:

* "This option was pushed because of rewards."

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
