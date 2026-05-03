import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  Handshake,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getUser } from '@/lib/db/queries';
import {
  getScenarioForUser,
  scenarioInputFromRecord,
  scenarioOutputFromStoredResult
} from '@/lib/db/scenarios';
import { evaluateScenario } from '@/lib/route-intelligence';
import type { ProviderMatch, RouteResult } from '@/lib/route-intelligence';
import {
  countryLabels,
  priorityLabels,
  useCaseLabels
} from '../../scenario-options';
import { submitHandoffRequest } from './actions';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HandoffRequestPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: SearchParams;
}) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { id } = await params;
  const scenarioId = Number(id);
  if (!Number.isInteger(scenarioId) || scenarioId <= 0) {
    notFound();
  }

  const row = await getScenarioForUser(user.id, scenarioId);
  if (!row) {
    notFound();
  }

  const query = await searchParams;
  const output =
    scenarioOutputFromStoredResult(row.result) ??
    evaluateScenario(scenarioInputFromRecord(row.scenario));
  const route = selectRoute(output.routes, getQueryValue(query.routeId));

  if (!route) {
    notFound();
  }

  const partner = selectPartner(route, getQueryValue(query.partnerId));
  const requestType = getQueryValue(query.requestType) === 'intro' ? 'intro' : 'review';
  const submitted = getQueryValue(query.submitted) === '1';

  if (submitted) {
    return (
      <section className="flex-1 p-4 lg:p-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold text-[#0614b8]">
            Request submitted
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-950">
            FlowSignal will review and connect you with the right partner.
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            The request is now in review. The scenario result remains saved for
            your team.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center bg-emerald-700 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <CardTitle>
              {requestType === 'intro'
                ? 'Introduction request received'
                : 'Review request received'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-gray-600">
              FlowSignal will use the confirmed route brief and missing-info
              signals to prepare the next step.
            </p>
            <Button asChild className="mt-6 bg-[#0614b8] text-white hover:bg-[#07108f]">
              <Link href={`/dashboard/scenarios/${row.scenario.id}`}>
                Back to scenario result
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#0614b8]">
            {requestType === 'intro'
              ? 'Request introduction'
              : 'Ask FlowSignal to review'}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-950">
            Confirm the route brief
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Confirm the scenario, share what is ready, and tell FlowSignal how
            urgent the next step is.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard/scenarios/${row.scenario.id}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to result
          </Link>
        </Button>
      </div>

      <form action={submitHandoffRequest} className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <input type="hidden" name="scenarioId" value={row.scenario.id} />
        <input type="hidden" name="routeId" value={route.routeId} />
        <input type="hidden" name="partnerId" value={partner?.providerId ?? ''} />
        <input type="hidden" name="requestType" value={requestType} />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center bg-[#0614b8] text-white">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <CardTitle>Step 1 - Confirm scenario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <SummaryMetric
                  label="Corridor"
                  value={`${formatCountry(row.scenario.originCountry)} to ${formatCountry(
                    row.scenario.destinationCountry
                  )}`}
                />
                <SummaryMetric
                  label="Amount"
                  value={`${row.scenario.currency} ${formatAmount(row.scenario.amount)}`}
                />
                <SummaryMetric
                  label="Use case"
                  value={
                    useCaseLabels[row.scenario.businessUseCase] ??
                    row.scenario.businessUseCase
                  }
                />
                <SummaryMetric
                  label="Priority"
                  value={
                    priorityLabels[row.scenario.priority] ??
                    row.scenario.priority
                  }
                />
                <SummaryMetric label="Selected route" value={route.routeName} />
                <SummaryMetric
                  label="Partner"
                  value={partner?.providerName ?? 'FlowSignal review first'}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2 - Missing info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <ChecklistInput
                  name="invoiceAvailable"
                  label="Invoice or commercial document is available"
                />
                <ChecklistInput
                  name="purposeCodeKnown"
                  label="Purpose code or transaction purpose is known"
                />
                <ChecklistInput
                  name="entityDetailsReady"
                  label="Entity and counterparty details are ready"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 3 - Intent</CardTitle>
            </CardHeader>
            <CardContent>
              <fieldset>
                <legend className="text-sm font-medium text-gray-900">
                  Urgency
                </legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {[
                    { value: 'asap', label: 'ASAP' },
                    { value: 'this_week', label: 'This week' },
                    { value: 'exploring', label: 'Exploring' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex cursor-pointer gap-3 border border-gray-200 p-3 text-sm has-[:checked]:border-[#0614b8] has-[:checked]:bg-blue-50"
                    >
                      <input
                        type="radio"
                        name="urgency"
                        value={option.value}
                        defaultChecked={option.value === 'this_week'}
                        className="mt-1 h-4 w-4"
                        required
                      />
                      <span className="font-medium text-gray-950">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="mt-5">
                <Label htmlFor="notes" className="mb-2">
                  Notes
                </Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  placeholder="Share timing constraints, preferred contacts, or open questions."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center bg-gray-950 text-white">
              {requestType === 'intro' ? (
                <Handshake className="h-5 w-5" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </div>
            <CardTitle>
              {requestType === 'intro'
                ? 'Submit introduction request'
                : 'Submit review request'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-gray-600">
              FlowSignal will review this route brief before making any partner
              connection. Incentives do not affect recommendations.
            </p>
            <Button
              type="submit"
              className="mt-6 w-full bg-[#0614b8] text-white hover:bg-[#07108f]"
            >
              Submit request
            </Button>
          </CardContent>
        </Card>
      </form>
    </section>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 p-4">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-2 text-sm font-medium text-gray-950">{value}</p>
    </div>
  );
}

function ChecklistInput({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex cursor-pointer gap-3 border border-gray-200 p-4 text-sm has-[:checked]:border-[#0614b8] has-[:checked]:bg-blue-50">
      <input type="checkbox" name={name} className="mt-1 h-4 w-4" />
      <span className="font-medium text-gray-950">{label}</span>
    </label>
  );
}

function selectRoute(routes: RouteResult[], routeId?: string) {
  if (!routeId) {
    return routes[0] ?? null;
  }

  return routes.find((route) => route.routeId === routeId) ?? null;
}

function selectPartner(route: RouteResult, partnerId?: string): ProviderMatch | null {
  if (!partnerId) {
    return null;
  }

  return (
    route.providerMatches.find((partner) => partner.providerId === partnerId) ??
    null
  );
}

function getQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
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
