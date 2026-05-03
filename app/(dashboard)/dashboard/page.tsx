import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  PlusCircle,
  Route,
  Send
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUser } from '@/lib/db/queries';
import {
  listScenariosForUser,
  type ScenarioListItem
} from '@/lib/db/scenarios';
import {
  countryLabels,
  directionLabels,
  priorityLabels,
  useCaseLabels
} from './scenarios/scenario-options';
import { RolePicker } from './role-picker';

const productRoles = ['cfo', 'accountant', 'treasury'] as const;

const roleContent = {
  cfo: {
    label: 'CFO / Founder Finance',
    title: 'Turn route options into finance decisions.',
    text: 'Prioritize cost, speed, audit confidence, and escalation triggers before the team executes a cross-border payment.'
  },
  accountant: {
    label: 'Accountant',
    title: 'Prepare client-ready route reviews.',
    text: 'Use saved scenarios to frame client questions, document requests, and advisory follow-up.'
  },
  treasury: {
    label: 'Treasury / Finance Ops',
    title: 'Keep payment operations repeatable.',
    text: 'Track route fit, beneficiary setup, documentation, and reconciliation readiness across recurring flows.'
  }
} as const;

export default async function ScenarioCommandCenterPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const scenarios = await listScenariosForUser(user.id);
  const productRole = isProductRole(user.role) ? user.role : null;
  const needsAttention = scenarios.filter(isNeedsAttention);
  const readyForAction = scenarios.filter(isReadyForAction);
  const inProgress = scenarios.filter(
    (scenario) => !isNeedsAttention(scenario) && !isReadyForAction(scenario)
  );
  const recentScenarios = scenarios.slice(0, 3);
  const roleCopy = productRole ? roleContent[productRole] : null;

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#0614b8]">
            Scenario command center
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-950">
            {roleCopy?.title ?? 'Start with the payment scenario.'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {roleCopy?.text ??
              'FlowSignal organizes route briefs, unsupported scenarios, and partner-ready opportunities from one workspace.'}
          </p>
        </div>
        <Button
          asChild
          className="bg-[#0614b8] text-white hover:bg-[#07108f]"
        >
          <Link href="/dashboard/scenarios/new">
            <PlusCircle className="h-4 w-4" />
            Start a Route Brief
          </Link>
        </Button>
      </div>

      {!productRole ? (
        <div className="mb-6">
          <RolePicker />
        </div>
      ) : (
        <div className="mb-6 border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Current view
          </p>
          <p className="mt-2 text-sm font-medium text-gray-950">
            {roleCopy?.label}
          </p>
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex h-11 w-11 items-center justify-center bg-[#0614b8] text-white">
                <Route className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-950">
                Build the next route brief
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Enter corridor, amount, use case, and priority. FlowSignal will
                return route options, tradeoffs, documentation needs, partner
                fit, and next-step signals.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#0614b8] text-white hover:bg-[#07108f]"
            >
              <Link href="/dashboard/scenarios/new">
                Start a Route Brief
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-3">
        <ScenarioBucket
          title="In Progress"
          description="Saved route briefs that are evaluated but not partner-ready yet."
          icon={ClipboardList}
          emptyText={
            scenarios.length === 0
              ? 'No saved scenarios yet.'
              : 'No in-progress briefs right now.'
          }
          scenarios={inProgress}
        />
        <ScenarioBucket
          title="Needs Attention"
          description="Unsupported scenarios and briefs without usable route output."
          icon={AlertTriangle}
          emptyText="No scenarios need attention."
          scenarios={needsAttention}
          tone="attention"
        />
        <ScenarioBucket
          title="Ready for Action"
          description="Evaluated scenarios with partner fit that can lead into introduction."
          icon={Send}
          emptyText="No partner-ready scenarios yet."
          scenarios={readyForAction}
          tone="ready"
          actionLabel="Review intro path"
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          {recentScenarios.length > 0 ? (
            <div className="grid gap-3">
              {recentScenarios.map((scenario) => (
                <ScenarioRow key={scenario.id} scenario={scenario} />
              ))}
            </div>
          ) : (
            <EmptyState
              text="Create your first route brief to compare routes, tradeoffs, partner fit, and preparation steps."
              action
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function ScenarioBucket({
  title,
  description,
  icon: Icon,
  emptyText,
  scenarios,
  tone = 'default',
  actionLabel = 'View result'
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  emptyText: string;
  scenarios: ScenarioListItem[];
  tone?: 'default' | 'attention' | 'ready';
  actionLabel?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div
          className={`flex h-10 w-10 items-center justify-center text-white ${bucketIconClassName(
            tone
          )}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-5 text-sm leading-6 text-gray-600">{description}</p>
        {scenarios.length > 0 ? (
          <div className="space-y-3">
            {scenarios.slice(0, 3).map((scenario) => (
              <ScenarioSummaryCard
                key={scenario.id}
                scenario={scenario}
                actionLabel={actionLabel}
              />
            ))}
          </div>
        ) : (
          <EmptyState text={emptyText} />
        )}
      </CardContent>
    </Card>
  );
}

function ScenarioSummaryCard({
  scenario,
  actionLabel
}: {
  scenario: ScenarioListItem;
  actionLabel: string;
}) {
  return (
    <div className="border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-950">
            {formatCountry(scenario.originCountry)} to{' '}
            {formatCountry(scenario.destinationCountry)}
          </p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            {scenario.currency} {formatAmount(scenario.amount)} ·{' '}
            {useCaseLabels[scenario.businessUseCase] ??
              scenario.businessUseCase}
          </p>
        </div>
        <StatusBadge scenario={scenario} />
      </div>
      <Button asChild variant="outline" className="mt-4 w-full">
        <Link href={`/dashboard/scenarios/${scenario.id}`}>
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function ScenarioRow({ scenario }: { scenario: ScenarioListItem }) {
  return (
    <div className="flex flex-col gap-4 border border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-gray-950 text-white">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-gray-950">
              {formatCountry(scenario.originCountry)} to{' '}
              {formatCountry(scenario.destinationCountry)}
            </p>
            <StatusBadge scenario={scenario} />
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {directionLabels[scenario.direction] ?? scenario.direction} ·{' '}
            {scenario.currency} {formatAmount(scenario.amount)} ·{' '}
            {priorityLabels[scenario.priority] ?? scenario.priority}
          </p>
        </div>
      </div>
      <Button asChild variant="outline">
        <Link href={`/dashboard/scenarios/${scenario.id}`}>
          View result
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function EmptyState({ text, action = false }: { text: string; action?: boolean }) {
  return (
    <div className="border border-dashed border-gray-300 p-4">
      <p className="text-sm leading-6 text-gray-600">{text}</p>
      {action ? (
        <Button
          asChild
          className="mt-4 bg-[#0614b8] text-white hover:bg-[#07108f]"
        >
          <Link href="/dashboard/scenarios/new">
            <PlusCircle className="h-4 w-4" />
            Start a Route Brief
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

function StatusBadge({ scenario }: { scenario: ScenarioListItem }) {
  if (isReadyForAction(scenario)) {
    return (
      <span className="bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
        Ready for intro
      </span>
    );
  }

  if (isNeedsAttention(scenario)) {
    return (
      <span className="bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
        Needs attention
      </span>
    );
  }

  return (
    <span className="bg-sky-50 px-2 py-1 text-xs font-medium text-sky-700">
      Completed
    </span>
  );
}

function isProductRole(value: string): value is (typeof productRoles)[number] {
  return productRoles.includes(value as (typeof productRoles)[number]);
}

function isNeedsAttention(scenario: ScenarioListItem) {
  return scenario.status !== 'evaluated' || scenario.routeCount === 0;
}

function isReadyForAction(scenario: ScenarioListItem) {
  return scenario.status === 'evaluated' && scenario.providerMatchCount > 0;
}

function bucketIconClassName(tone: 'default' | 'attention' | 'ready') {
  if (tone === 'attention') {
    return 'bg-amber-600';
  }

  if (tone === 'ready') {
    return 'bg-emerald-700';
  }

  return 'bg-[#0614b8]';
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
