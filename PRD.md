# FlowSignal MVP PRD

## Product Summary

FlowSignal is an advisory intelligence platform for Indian finance teams managing cross-border payments.
It helps CFOs, external accountants, and treasury teams understand their route options before they execute a payment.

FlowSignal is not a payments processor.
It does not hold funds, move money, quote exact live pricing, or guarantee outcomes.

## Target Users

Primary users:

* Indian CFOs handling recurring international flows
* External accountants advising clients on cross-border payments
* Treasury and finance operations teams

High-priority business profiles:

* SaaS exporters
* Import/export businesses
* Companies with recurring international vendor, customer, or service flows

## MVP Goal

The MVP should let a signed-in user enter a cross-border payment scenario and receive a structured breakdown of:

* viable routes
* realistic cost ranges
* expected timelines
* compliance and documentation requirements
* route tradeoffs
* contextual recommendations
* relevant partner matches, when applicable
* FlowPoints incentives, when applicable

The user should leave saying:

* "I understand my options, the tradeoffs, and any incentives available."

## MVP Pages

The first release is limited to these pages:

* Homepage
* Sign in and sign up
* Lightweight onboarding, if needed
* Scenario questionnaire
* Results page with route breakdown
* Partner recommendation cards
* FlowPoints display
* Basic user dashboard with saved scenarios

## MVP Capabilities

### Public Acquisition

The homepage should:

* explain clarity before execution
* identify the audience clearly
* communicate that FlowSignal compares routes, costs, timelines, and compliance requirements
* make clear that FlowSignal is not a payments processor
* route users to scenario intake or sign-up

### Authentication

Users can:

* sign up
* sign in
* access protected scenario and dashboard pages
* save scenarios to their account

### Scenario Intake

The questionnaire captures:

* direction: send or receive
* origin country
* destination country
* amount
* currency
* business use case
* priority: cost, speed, or balanced

The form should be short enough to complete quickly.

### Route Evaluation

The system evaluates the scenario through deterministic, rule-based logic.

Outputs include:

* route name and type
* cost range
* expected timeline
* compliance level
* documentation notes
* risk flags
* tradeoff notes

### Decision Layer

The results page should compare routes across:

* cost
* speed
* complexity
* compliance burden

Recommendations should be contextual, not absolute.
Use categories such as:

* best for cost
* best for speed
* best for simplicity

Each recommendation must explain why it fits and what tradeoffs exist.

### Partner Matching

Partner matching appears after route evaluation.
It should:

* map trusted partners to relevant routes
* explain "why this partner" based on use case fit
* avoid marketplace or ranked-listing framing
* never imply incentives influenced the recommendation

### FlowPoints

FlowPoints are optional secondary incentives shown after partner fit and tradeoffs.

FlowPoints must:

* be clearly disclosed
* appear as secondary metadata
* never affect route selection, recommendation logic, or partner matching
* include wording that incentives do not affect recommendations

## What The MVP Does Not Do

The MVP does not:

* execute payments
* hold funds
* connect to bank accounts
* integrate into fintech APIs for live execution
* provide exact live quotes
* guarantee rates, fees, timelines, or approval
* act as a regulated payment provider
* use ML or opaque scoring
* rank partners by incentives or payout
* support every corridor
* provide a full admin back office
* replace legal, tax, RBI, FEMA, or compliance advice

## Initial Corridors And Use Cases

Start with a small curated set:

* India to US: SaaS and services exports
* India to UAE or Singapore: vendor payments and trade flows
* India to UK or EU: mixed mid-market flows

## Success Criteria

The MVP is successful if:

* a user can complete scenario intake in a few minutes
* a user can see at least two route options for supported scenarios
* every recommendation includes an explanation and tradeoff
* FlowPoints are disclosed without influencing recommendation order
* saved scenarios are available from the dashboard
* a reviewer can seed the app and inspect the core flow locally

## Phase 2 Candidates

Keep these out of the first release unless explicitly reprioritized:

* live provider API integrations
* managed auth migration
* quote refresh workflows
* full admin UI
* advanced compliance workflow
* document upload and review
* partner CRM automation
* multi-role enterprise permissions beyond the existing team model
