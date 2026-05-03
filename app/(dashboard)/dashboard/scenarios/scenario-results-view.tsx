import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  Gift,
  GitCompare,
  Handshake,
  ListChecks,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PaymentScenario } from '@/lib/db/schema';
import type {
  ProviderMatch,
  RecommendationTag,
  RouteResult,
  ScenarioOutput
} from '@/lib/route-intelligence';
import type { RiskSeverity } from '@/lib/route-intelligence/types';
import {
  countryLabels,
  directionLabels,
  priorityLabels,
  useCaseLabels
} from './scenario-options';

const routeTypeLabels: Record<string, string> = {
  bank_swift: 'Bank SWIFT',
  fintech_assisted: 'Fintech-assisted',
  local_rails: 'Local rails',
  trade_bank_route: 'Trade bank route'
};

export function ScenarioResultsView({
  scenario,
  output
}: {
  scenario: PaymentScenario;
  output: ScenarioOutput;
}) {
  const isSupported = output.status === 'supported' && output.routes.length > 0;

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#0614b8]">
            Scenario result
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-950">
            {formatCountry(scenario.originCountry)} to{' '}
            {formatCountry(scenario.destinationCountry)} route brief
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Advisory intelligence for comparing possible routes before the
            finance team chooses where to execute.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/dashboard/scenarios">
              <ArrowLeft className="h-4 w-4" />
              Saved scenarios
            </Link>
          </Button>
          <Button
            asChild
            className="bg-[#0614b8] text-white hover:bg-[#07108f]"
          >
            <Link href="/dashboard/scenarios/new">New scenario</Link>
          </Button>
        </div>
      </div>

      <ScenarioSummary scenario={scenario} output={output} />

      {isSupported ? (
        <div className="mt-6 space-y-6">
          <ExecutiveSummary routes={output.routes} scenarioId={scenario.id} />
          <ComparisonLayer routes={output.routes} />
          <DecisionRouteCards routes={output.routes} />
          <PartnerMatches routes={output.routes} scenarioId={scenario.id} />
          <PrepareForExecution scenario={scenario} routes={output.routes} />
          <CollapsibleSection title="Compliance details">
            <ComplianceSummary routes={output.routes} />
          </CollapsibleSection>
          <CollapsibleSection title="Risk flags">
            <RiskFlags routes={output.routes} />
          </CollapsibleSection>
        </div>
      ) : (
        <UnsupportedScenario output={output} />
      )}
    </section>
  );
}

function ScenarioSummary({
  scenario,
  output
}: {
  scenario: PaymentScenario;
  output: ScenarioOutput;
}) {
  const summaryItems = [
    {
      label: 'Direction',
      value: directionLabels[scenario.direction] ?? scenario.direction
    },
    {
      label: 'Corridor',
      value: `${formatCountry(scenario.originCountry)} to ${formatCountry(
        scenario.destinationCountry
      )}`
    },
    {
      label: 'Amount',
      value: `${scenario.currency} ${formatAmount(scenario.amount)}`
    },
    {
      label: 'Use case',
      value: useCaseLabels[scenario.businessUseCase] ?? scenario.businessUseCase
    },
    {
      label: 'Priority',
      value: priorityLabels[scenario.priority] ?? scenario.priority
    },
    {
      label: 'Rule set',
      value: output.rulesVersion
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scenario summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {summaryItems.map((item) => (
            <div key={item.label} className="border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase text-gray-500">
                {item.label}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-950">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-gray-500">
          Cost and timeline ranges are directional planning inputs, not live
          quotes, execution instructions, or guaranteed outcomes.
        </p>
      </CardContent>
    </Card>
  );
}

function ExecutiveSummary({
  routes,
  scenarioId
}: {
  routes: RouteResult[];
  scenarioId: number;
}) {
  const summaryRows = buildExecutiveSummary(routes);

  return (
    <Card>
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center bg-[#0614b8] text-white">
          <ListChecks className="h-5 w-5" />
        </div>
        <CardTitle>Executive summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-5 text-sm leading-6 text-gray-600">
          Best route options for this scenario, based on configured cost,
          speed, simplicity, and priority fit. These are decision categories,
          not execution instructions.
        </p>
        <div className="grid gap-3">
          {summaryRows.map((row, index) => (
            <div
              key={`${row.route.routeId}-${row.label}`}
              className="grid gap-3 border border-gray-200 p-4 md:grid-cols-[2rem_1fr_auto]"
            >
              <span className="flex h-8 w-8 items-center justify-center bg-gray-950 text-sm font-semibold text-white">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-950">
                  {row.route.routeName}
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {row.label} · {row.reason}
                </p>
              </div>
              <Button asChild variant="outline">
                <Link
                  href={`/dashboard/scenarios/${scenarioId}/handoff?requestType=review&routeId=${row.route.routeId}`}
                >
                  Ask FlowSignal to review
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DecisionRouteCards({ routes }: { routes: RouteResult[] }) {
  return (
    <div>
      <SectionHeading
        eyebrow="Route options"
        title="Decision-ready route cards"
        text="Each card leads with the decision label, tradeoff, and when the route is a poor fit."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {routes.map((route) => (
          <Card key={route.routeId}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    {routeTypeLabels[route.routeType]}
                  </p>
                  <CardTitle className="mt-2">
                    {getDecisionLabel(route)}
                  </CardTitle>
                  <p className="mt-2 text-sm font-medium text-gray-950">
                    {route.routeName}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {route.recommendationTags.map((tag) => (
                    <span
                      key={tag.tag}
                      className="border border-[#0584c7]/30 bg-[#0584c7]/10 px-2 py-1 text-xs font-medium text-[#045f8f]"
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Metric label="Cost range" value={route.costRange.summary} />
                <Metric
                  label="Expected timeline"
                  value={route.estimatedTimeline.summary}
                />
                <Metric
                  label="Compliance"
                  value={formatLevel(route.complianceLevel)}
                />
                <Metric
                  label="Complexity"
                  value={formatLevel(route.complexityLevel)}
                />
              </div>

              <div className="mt-5 border-l-2 border-[#0584c7] pl-4">
                <p className="text-sm font-semibold text-gray-950">
                  Tradeoff
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {route.tradeoffSummary}
                </p>
              </div>

              <div className="mt-5 border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-gray-950">
                  When NOT to use this
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {getWhenNotToUse(route)}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-gray-950">
                  Documentation requirements
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {route.documentation.summary}
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-gray-600">
                  {route.documentation.requirements.map((requirement) => (
                    <li key={requirement} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0584c7]" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ComparisonLayer({ routes }: { routes: RouteResult[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center bg-[#0614b8] text-white">
          <GitCompare className="h-5 w-5" />
        </div>
        <CardTitle>Comparison layer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <th className="py-3 pr-4 font-semibold">Route</th>
                <th className="px-4 py-3 font-semibold">Cost</th>
                <th className="px-4 py-3 font-semibold">Speed</th>
                <th className="px-4 py-3 font-semibold">Complexity</th>
                <th className="py-3 pl-4 font-semibold">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {routes.map((route) => (
                <tr key={route.routeId}>
                  <td className="py-4 pr-4 font-medium text-gray-950">
                    {route.routeName}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {formatPercentRange(route.costRange)}
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {formatTimelineRange(route)}
                  </td>
                  <td className="px-4 py-4">
                    <LevelBadge value={route.complexityLevel} />
                  </td>
                  <td className="py-4 pl-4">
                    <LevelBadge value={route.complianceLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function PartnerMatches({
  routes,
  scenarioId
}: {
  routes: RouteResult[];
  scenarioId: number;
}) {
  const providerRows = routes.flatMap((route) =>
    (route.providerMatches ?? []).map((match) => ({ route, match }))
  );

  if (providerRows.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Partner fit"
        title="Relevant partners for these routes"
        text="Matches are attached after route results based on route, corridor, and use-case fit. Incentives do not affect recommendations."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        {providerRows.map(({ route, match }) => (
          <Card key={`${match.routeId}-${match.providerId}`}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center bg-gray-950 text-white">
                    <Handshake className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase text-gray-500">
                    Partner match
                  </p>
                  <CardTitle className="mt-2">{match.providerName}</CardTitle>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Route: {match.routeName}
                  </p>
                </div>
                {match.flowPoints ? (
                  <span className="border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    Incentive available
                  </span>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-gray-600">
                {match.description}
              </p>

              <div className="mt-5 border-l-2 border-[#0584c7] pl-4">
                <p className="text-sm font-semibold text-gray-950">
                  Why this partner
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {match.whyThisPartner}
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <PartnerMetric
                  label="Cost profile"
                  value={match.costProfile}
                />
                <PartnerMetric
                  label="Speed profile"
                  value={match.speedProfile}
                />
                <PartnerMetric
                  label="Regulatory fit"
                  value={match.regulatoryFit}
                />
                <PartnerMetric
                  label="Best-fit use case"
                  value={match.bestUseCase}
                />
              </div>

              <div className="mt-5 border border-gray-200 p-4">
                <p className="text-sm font-semibold text-gray-950">
                  Route tradeoff
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {route.tradeoffSummary}
                </p>
              </div>

              {match.flowPoints ? (
                <FlowPointsDisclosure flowPoints={match.flowPoints} />
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button
                  asChild
                  className="bg-[#0614b8] text-white hover:bg-[#07108f]"
                >
                  <Link
                    href={`/dashboard/scenarios/${scenarioId}/handoff?requestType=intro&routeId=${route.routeId}&partnerId=${match.providerId}`}
                  >
                    Request Introduction
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link
                    href={`/dashboard/scenarios/${scenarioId}/handoff?requestType=review&routeId=${route.routeId}&partnerId=${match.providerId}`}
                  >
                    Ask FlowSignal to Review This
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-gray-500">
        Partner matches follow route output order. Incentives do not affect
        recommendations.
      </p>
    </div>
  );
}

function PrepareForExecution({
  scenario,
  routes
}: {
  scenario: PaymentScenario;
  routes: RouteResult[];
}) {
  const requirements = Array.from(
    new Set(routes.flatMap((route) => route.documentation.requirements))
  ).slice(0, 7);
  const primaryRoute = buildExecutiveSummary(routes)[0]?.route ?? routes[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center bg-gray-950 text-white">
          <FileText className="h-5 w-5" />
        </div>
        <CardTitle>Prepare for execution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-gray-950">
              Documents needed
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-gray-600">
              {requirements.map((requirement) => (
                <li key={requirement} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0584c7]" />
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-gray-200 p-4">
            <p className="text-sm font-semibold text-gray-950">
              Partner intro brief
            </p>
            <dl className="mt-3 grid gap-2 text-sm text-gray-600">
              <IntroBriefRow label="Use case" value={formatUseCase(scenario)} />
              <IntroBriefRow
                label="Amount"
                value={`${scenario.currency} ${formatAmount(scenario.amount)}`}
              />
              <IntroBriefRow
                label="Corridor"
                value={`${formatCountry(scenario.originCountry)} to ${formatCountry(
                  scenario.destinationCountry
                )}`}
              />
              <IntroBriefRow
                label="Preferred route"
                value={primaryRoute?.routeName ?? 'To be confirmed'}
              />
              <IntroBriefRow
                label="Constraints"
                value={priorityLabels[scenario.priority] ?? scenario.priority}
              />
            </dl>
            {primaryRoute ? (
              <Button
                asChild
                className="mt-5 bg-[#0614b8] text-white hover:bg-[#07108f]"
              >
                <Link
                  href={`/dashboard/scenarios/${scenario.id}/handoff?requestType=review&routeId=${primaryRoute.routeId}`}
                >
                  Use this brief for review
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IntroBriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
      <dt className="font-medium text-gray-500">{label}</dt>
      <dd className="text-gray-800">{value}</dd>
    </div>
  );
}

function CollapsibleSection({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group border border-gray-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-sm font-semibold text-gray-950">
        {title}
        <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
      </summary>
      <div className="border-t border-gray-200 p-4">{children}</div>
    </details>
  );
}

function ComplianceSummary({ routes }: { routes: RouteResult[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center bg-gray-950 text-white">
          <FileText className="h-5 w-5" />
        </div>
        <CardTitle>Compliance summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          {routes.map((route) => (
            <div key={route.routeId} className="border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-950">
                  {route.routeName}
                </p>
                <LevelBadge value={route.complianceLevel} />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {route.documentation.summary}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RiskFlags({ routes }: { routes: RouteResult[] }) {
  const riskRows = routes.flatMap((route) =>
    route.riskFlags.map((flag) => ({
      routeId: route.routeId,
      routeName: route.routeName,
      flag
    }))
  );

  if (riskRows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk flags</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-gray-600">
            No configured risk flags were returned for this scenario.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center bg-[#0614b8] text-white">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <CardTitle>Risk flags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {riskRows.map(({ routeId, routeName, flag }) => (
            <div
              key={`${routeId}-${flag.code}`}
              className="grid gap-3 border border-gray-200 p-4 md:grid-cols-[12rem_1fr]"
            >
              <div>
                <SeverityBadge severity={flag.severity} />
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {routeName}
                </p>
              </div>
              <p className="text-sm leading-6 text-gray-700">
                {flag.summary}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UnsupportedScenario({ output }: { output: ScenarioOutput }) {
  const messages =
    output.unsupportedReasons.length > 0 || output.inputErrors.length > 0
      ? [...output.unsupportedReasons, ...output.inputErrors]
      : ['This scenario is outside the current MVP route rules.'];

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center bg-amber-100 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <CardTitle>Unsupported scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-gray-600">
          FlowSignal does not have enough configured route intelligence to show
          route options for this scenario yet.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-gray-700">
          {messages.map((message) => (
            <li key={message} className="flex gap-2">
              <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-600" />
              <span>{message}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-l-2 border-amber-400 pl-4">
          <p className="text-sm leading-6 text-gray-600">
            No fake precision has been shown. Try a supported India-linked
            corridor, or save this result as a record for manual advisory
            review.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="mb-5 max-w-3xl">
      <p className="text-sm font-semibold text-[#0614b8]">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold text-gray-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 p-4">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-gray-700">{value}</p>
    </div>
  );
}

function PartnerMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 p-4">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-gray-600">{value}</p>
    </div>
  );
}

function FlowPointsDisclosure({
  flowPoints
}: {
  flowPoints: NonNullable<ProviderMatch['flowPoints']>;
}) {
  return (
    <div className="mt-5 border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Gift className="h-4 w-4 text-emerald-700" />
        <p className="text-xs font-semibold uppercase text-emerald-700">
          Incentive available
        </p>
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-950">
        {flowPoints.label}
      </p>
      <p className="mt-2 text-xs leading-5 text-gray-600">
        {flowPoints.disclosure}
      </p>
    </div>
  );
}

function buildExecutiveSummary(routes: RouteResult[]) {
  const rows: { label: string; reason: string; route: RouteResult }[] = [];
  const usedRouteIds = new Set<string>();
  const tagPriority: RecommendationTag['tag'][] = [
    'best_for_cost',
    'best_for_speed',
    'best_for_simplicity',
    'priority_fit'
  ];

  for (const tag of tagPriority) {
    const match = routes
      .flatMap((route) =>
        route.recommendationTags
          .filter((recommendation) => recommendation.tag === tag)
          .map((recommendation) => ({ route, recommendation }))
      )
      .find(({ route }) => !usedRouteIds.has(route.routeId));

    if (!match) {
      continue;
    }

    usedRouteIds.add(match.route.routeId);
    rows.push({
      label: getDecisionLabel(match.route),
      reason: match.recommendation.reason,
      route: match.route
    });
  }

  for (const route of routes) {
    if (rows.length >= 3) {
      break;
    }

    if (!usedRouteIds.has(route.routeId)) {
      rows.push({
        label: getDecisionLabel(route),
        reason: route.tradeoffSummary,
        route
      });
    }
  }

  return rows.slice(0, 3);
}

function getDecisionLabel(route: RouteResult) {
  if (route.recommendationTags.some((tag) => tag.tag === 'best_for_cost')) {
    return 'Lower Cost';
  }

  if (route.recommendationTags.some((tag) => tag.tag === 'best_for_speed')) {
    return 'Faster';
  }

  if (
    route.recommendationTags.some((tag) => tag.tag === 'best_for_simplicity') ||
    route.complexityLevel === 'low'
  ) {
    return 'Operationally Simpler';
  }

  if (route.routeType === 'bank_swift' || route.routeType === 'trade_bank_route') {
    return 'Bank-Reviewed';
  }

  return 'Balanced Option';
}

function getWhenNotToUse(route: RouteResult) {
  if (route.routeType === 'bank_swift' || route.routeType === 'trade_bank_route') {
    return 'Avoid this when speed, low operational effort, or predictable deductions matter more than bank-reviewed documentation and a conservative audit trail.';
  }

  if (route.routeType === 'local_rails') {
    return 'Avoid this when payer, beneficiary, invoice, or settlement records cannot be reconciled cleanly across systems.';
  }

  if (route.routeType === 'fintech_assisted') {
    return 'Avoid this when the transaction requires a bank-led documentary review, unusual counterparty handling, or a provider limit review would create timing risk.';
  }

  if (route.complianceLevel === 'high') {
    return 'Avoid this when the finance team cannot prepare supporting documents early enough for a manual review cycle.';
  }

  return 'Avoid this when its tradeoffs do not match the scenario priority or when required documentation is incomplete.';
}

function LevelBadge({ value }: { value: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium ${levelClassName(
        value
      )}`}
    >
      {formatLevel(value)}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: RiskSeverity }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium ${severityClassName(
        severity
      )}`}
    >
      {formatLevel(severity)}
    </span>
  );
}

function formatCountry(country: string) {
  return countryLabels[country] ?? country;
}

function formatAmount(amount: string) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return amount;
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2
  }).format(numericAmount);
}

function formatUseCase(scenario: PaymentScenario) {
  return useCaseLabels[scenario.businessUseCase] ?? scenario.businessUseCase;
}

function formatLevel(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatPercentRange(range: RouteResult['costRange']) {
  return `${range.minPercent}% to ${range.maxPercent}%`;
}

function formatTimelineRange(route: RouteResult) {
  const { minBusinessDays, maxBusinessDays } = route.estimatedTimeline;
  return `${minBusinessDays}-${maxBusinessDays} business days`;
}

function levelClassName(value: string) {
  if (value === 'low') {
    return 'bg-emerald-50 text-emerald-700';
  }

  if (value === 'moderate') {
    return 'bg-sky-50 text-sky-700';
  }

  return 'bg-amber-50 text-amber-700';
}

function severityClassName(severity: RiskSeverity) {
  if (severity === 'info') {
    return 'bg-sky-50 text-sky-700';
  }

  if (severity === 'watch') {
    return 'bg-amber-50 text-amber-700';
  }

  return 'bg-red-50 text-red-700';
}
