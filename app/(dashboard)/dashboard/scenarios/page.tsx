import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, FileQuestion, PlusCircle, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUser } from '@/lib/db/queries';
import { listScenariosForUser } from '@/lib/db/scenarios';
import {
  countryLabels,
  directionLabels,
  priorityLabels,
  useCaseLabels
} from './scenario-options';

export default async function SavedScenariosPage() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const scenarios = await listScenariosForUser(user.id);

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#0614b8]">
            Saved scenarios
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-950">
            Review route intelligence briefs
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Revisit previous payment scenarios, compare route assumptions, and
            start a new advisory review when the payment context changes.
          </p>
        </div>
        <Button
          asChild
          className="bg-[#0614b8] text-white hover:bg-[#07108f]"
        >
          <Link href="/dashboard/scenarios/new">
            <PlusCircle className="h-4 w-4" />
            New scenario
          </Link>
        </Button>
      </div>

      {scenarios.length > 0 ? (
        <div className="grid gap-4">
          {scenarios.map((scenario) => (
            <Card key={scenario.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#0614b8] text-white">
                      <Route className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold text-gray-950">
                          {formatCountry(scenario.originCountry)} to{' '}
                          {formatCountry(scenario.destinationCountry)}
                        </h2>
                        <StatusBadge status={scenario.status} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {scenario.currency} {formatAmount(scenario.amount)} ·{' '}
                        {useCaseLabels[scenario.businessUseCase] ??
                          scenario.businessUseCase}{' '}
                        · {priorityLabels[scenario.priority] ?? scenario.priority}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {directionLabels[scenario.direction] ??
                          scenario.direction}{' '}
                        · Last evaluated {formatDate(scenario.resultCreatedAt)}
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex h-10 w-10 items-center justify-center bg-[#0584c7] text-white">
              <FileQuestion className="h-5 w-5" />
            </div>
            <CardTitle>Create your first scenario</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="max-w-2xl text-sm leading-6 text-gray-600">
              Add a corridor, amount, use case, and priority. FlowSignal will
              save the result so your team can return to the route brief later.
            </p>
            <Button
              asChild
              className="mt-6 bg-[#0614b8] text-white hover:bg-[#07108f]"
            >
              <Link href="/dashboard/scenarios/new">
                <PlusCircle className="h-4 w-4" />
                Start scenario
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === 'evaluated'
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-amber-50 text-amber-700';

  return (
    <span className={`px-2 py-1 text-xs font-medium ${className}`}>
      {status === 'evaluated' ? 'Evaluated' : 'Unsupported'}
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

function formatDate(date: Date | null) {
  if (!date) {
    return 'not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

