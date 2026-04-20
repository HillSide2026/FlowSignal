import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
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

const recommendationOrder = [
  { tag: 'best_for_cost', title: 'Best for cost' },
  { tag: 'best_for_speed', title: 'Best for speed' },
  { tag: 'best_for_simplicity', title: 'Best for simplicity' }
] as const;

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
          <RouteOptions routes={output.routes} />
          <ComparisonLayer routes={output.routes} />
          <Recommendations routes={output.routes} />
          <PartnerMatches routes={output.routes} />
          <ComplianceSummary routes={output.routes} />
          <RiskFlags routes={output.routes} />
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

function RouteOptions({ routes }: { routes: RouteResult[] }) {
  return (
    <div>
      <SectionHeading
        eyebrow="Route options"
        title="Viable paths from the rule engine"
        text="Each card shows the configured range, documentation posture, risk flags, and tradeoff notes for this scenario."
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
                  <CardTitle className="mt-2">{route.routeName}</CardTitle>
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

function Recommendations({ routes }: { routes: RouteResult[] }) {
  const recommendations = recommendationOrder
    .map((item) => ({
      ...item,
      matches: routes.flatMap((route) =>
        route.recommendationTags
          .filter((tag) => tag.tag === item.tag)
          .map((tag) => ({ route, tag }))
      )
    }))
    .filter((item) => item.matches.length > 0);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center bg-[#0584c7] text-white">
          <ListChecks className="h-5 w-5" />
        </div>
        <CardTitle>Contextual recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.tag}
              className="border border-gray-200 p-4"
            >
              <p className="text-sm font-semibold text-gray-950">
                {recommendation.title}
              </p>
              <div className="mt-3 space-y-4">
                {recommendation.matches.map(({ route, tag }) => (
                  <RecommendationNote
                    key={`${route.routeId}-${tag.tag}`}
                    route={route}
                    tag={tag}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-gray-500">
          These are fit categories, not a universal winner or payment execution
          instruction.
        </p>
      </CardContent>
    </Card>
  );
}

function PartnerMatches({ routes }: { routes: RouteResult[] }) {
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

function RecommendationNote({
  route,
  tag
}: {
  route: RouteResult;
  tag: RecommendationTag;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-[#0614b8]">{route.routeName}</p>
      <p className="mt-2 text-sm leading-6 text-gray-600">{tag.reason}</p>
      <p className="mt-2 text-xs leading-5 text-gray-500">
        Tradeoff: {route.tradeoffSummary}
      </p>
    </div>
  );
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
