import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const insights = [
  {
    title: 'Why cross-border flow reviews need a shared fact base',
    category: 'Review practice',
    summary:
      'Teams often begin with scattered statements, invoices, and email notes. A common fact base reduces rework before specialist review.'
  },
  {
    title: 'Questions accountants can ask before a route review',
    category: 'Client intake',
    summary:
      'Corridor, counterparty, purpose, documentation, and timing questions can be gathered early without moving beyond the advisory role.'
  },
  {
    title: 'Turning document gaps into review priorities',
    category: 'Documentation',
    summary:
      'Missing records do not all carry the same operational weight. FlowSignal separates incomplete facts from higher-priority review items.'
  }
];

export default function InsightsPage() {
  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#0614b8]">Insights</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-gray-950 sm:text-5xl">
              Notes on cross-border flow review and advisory preparation.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Short, practical perspectives for accounting and advisory teams
              working with client funds movement questions.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          {insights.map((insight) => (
            <article key={insight.title} className="bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase text-[#0614b8]">
                {insight.category}
              </p>
              <h2 className="mt-4 text-xl font-semibold leading-7 text-gray-950">
                {insight.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {insight.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-gray-950">
              Member resources include downloadable review materials.
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Sign in to access the diagnostic calculator, route review brief,
              and client intake downloads.
            </p>
          </div>
          <Button
            asChild
            className="bg-[#0614b8] text-white hover:bg-[#07108f]"
          >
            <Link href="/sign-in">
              Login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
