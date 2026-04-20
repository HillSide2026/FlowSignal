# FlowSignal MVP User Flows

## Flow 1: Pre-Sign-In Homepage

Goal: explain FlowSignal quickly and route qualified users into scenario intake.

Steps:

1. User lands on `/`.
2. Page states the audience: Indian CFOs, external accountants, and treasury teams.
3. Page explains the core value: understand routes, cost ranges, timelines, compliance requirements, and partner fit before execution.
4. Page clearly says FlowSignal is not a payments processor.
5. User chooses:
   * primary CTA: See your best payment options
   * secondary CTA: Explore how it works
6. Primary CTA sends the user to sign up or directly to scenario intake if authenticated.

Required UX:

* clarity before execution
* no exaggerated savings claims
* no exact pricing claims
* no partner ranking language

## Flow 2: Sign Up And Sign In

Goal: let a user access protected scenario and dashboard pages.

Steps:

1. User opens `/sign-up` or `/sign-in`.
2. User submits email and password.
3. Server authenticates or creates the account.
4. Server issues a secure session cookie.
5. User lands in the protected dashboard or scenario questionnaire.

Rules:

* never return password values to the UI after validation errors
* never expose password hashes or internal-only user fields
* enforce authorization on the server

## Flow 3: Scenario Questionnaire

Goal: collect enough context to generate useful route intelligence with minimal friction.

Entry points:

* homepage primary CTA
* dashboard empty state
* dashboard "new scenario" action

Fields:

* direction: send or receive
* origin country
* destination country
* amount
* currency
* business use case
* priority: cost, speed, or balanced

Preferred first-release options:

* corridors:
  * India to US
  * India to UAE
  * India to Singapore
  * India to UK
  * India to EU
* use cases:
  * SaaS exports
  * services exports
  * vendor payments
  * import/export trade flow
  * recurring international flow

Submission behavior:

1. Validate required fields.
2. Save the scenario to the current user.
3. Evaluate routes using deterministic rules.
4. Store enough output to reproduce the result later.
5. Redirect to the results page.

## Flow 4: Results Page

Goal: show a structured scenario-based route breakdown.

Sections:

1. Scenario summary
   * direction
   * corridor
   * amount and currency
   * use case
   * priority

2. Route options
   * route type
   * cost range
   * expected timeline
   * compliance level
   * documentation requirements
   * risk flags

3. Comparison layer
   * cost
   * speed
   * complexity
   * compliance burden

4. Contextual recommendations
   * best for cost
   * best for speed
   * best for simplicity

Each recommendation must include:

* why it fits the scenario
* what tradeoffs exist

The page should avoid:

* one universal winner
* black-box scores
* guaranteed pricing
* guaranteed timelines

## Flow 5: Partner Handoff

Goal: connect the user with relevant partners only after route logic and tradeoffs are visible.

Steps:

1. Results page determines relevant partner matches for each route.
2. Partner cards appear below route fit and tradeoff context.
3. Each card explains:
   * supported route
   * best-fit use case
   * cost profile
   * speed profile
   * regulatory or documentation fit
   * why this partner fits the scenario
4. User can request an introduction or partner handoff.

Rules:

* matching is based on scenario and use-case fit
* incentives must not influence matching
* cards must not look like ranked marketplace listings
* partner order must not imply hidden monetization preference

## Flow 6: FlowPoints Display

Goal: disclose incentives without biasing the decision.

Display rules:

1. Show route and partner fit first.
2. Show tradeoffs second.
3. Show FlowPoints third, only when applicable.

Allowed label:

* "+ Earn X FlowPoints"

Required explanation:

* "Incentives do not affect recommendations."

Avoid:

* best reward
* highest payout
* top partner because of rewards

FlowPoints should be treated as secondary metadata attached to a partner option.

## Flow 7: Basic User Dashboard

Goal: let users resume or review saved scenarios.

Dashboard should show:

* saved scenarios
* corridor
* use case
* priority
* last evaluated date
* status or next step

Primary actions:

* create new scenario
* view previous result
* request partner handoff, if a match exists

Empty state:

* explain that the user can create their first scenario in a few minutes
* avoid generic SaaS dashboard filler

## Flow 8: Unsupported Scenario

Goal: handle out-of-scope scenarios honestly.

Behavior:

1. User submits a corridor or use case outside the MVP config.
2. System explains that the scenario is not fully supported yet.
3. System may show general advisory context if available.
4. System invites the user to request review or join a waitlist.

Do not:

* fabricate route details
* show fake precision
* pretend partner matches exist
