import Link from 'next/link';
import { ArrowLeft, FileCheck2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScenarioQuestionnaireForm } from '../scenario-questionnaire-form';

export default function NewScenarioPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-[#0614b8]">
            Scenario intake
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-950">
            Build a route intelligence brief
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Enter the payment context once. FlowSignal will return route
            options, tradeoffs, documentation needs, and risk flags before any
            execution step.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/scenarios">
            <ArrowLeft className="h-4 w-4" />
            Saved scenarios
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <ScenarioQuestionnaireForm />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center bg-[#0584c7] text-white">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <CardTitle>What the MVP evaluates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-6 text-gray-600">
                <li>Route type and indicative cost range</li>
                <li>Expected business-day timeline</li>
                <li>Documentation and compliance burden</li>
                <li>Risk flags for early preparation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center bg-gray-950 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle>Unsupported is honest</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-gray-600">
                If the route rules do not cover a scenario yet, the result page
                will say so clearly instead of fabricating provider options or
                live quotes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

