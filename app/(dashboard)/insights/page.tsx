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
      {/* SECTION 1 — HERO */}
      <section className="rounded-b-[32px] bg-gradient-to-br from-[#102A6B] to-[#071225]">
        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center px-6 py-24 lg:px-8">
          <div className="max-w-[760px]">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              Insights
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Notes on cross-border flow review and advisory preparation.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              Short, practical perspectives for accounting and advisory teams
              working with client funds movement questions.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — INSIGHT CARDS */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#155EEF]">
              Latest perspectives
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#08111F] sm:text-4xl">
              Practical reading for advisory teams
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {insights.map((insight) => (
              <article
                key={insight.title}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-[#155EEF]">
                  {insight.category}
                </p>
                <h2 className="mt-5 text-xl font-bold leading-7 text-[#08111F]">
                  {insight.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-[#64748B]">
                  {insight.summary}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — CTA */}
      <section className="bg-[#0B1633]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Member resources include downloadable review materials.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Sign in to access the diagnostic calculator, route review brief,
              and client intake downloads.
            </p>
          </div>
          <Button
            asChild
            className="shrink-0 rounded-xl bg-white px-7 py-4 font-semibold text-[#0B1633] hover:bg-gray-100"
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
