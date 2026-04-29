import Link from 'next/link';
import { ArrowRight, ClipboardList, FileCheck2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const useCases = [
  {
    title: 'Client intake',
    text: 'Collect the flow facts accountants need before a cross-border discussion moves into specialist review.',
    icon: ClipboardList
  },
  {
    title: 'Advisory handoff',
    text: 'Summarize route assumptions, document gaps, and open questions for legal, tax, or treasury colleagues.',
    icon: Users
  },
  {
    title: 'Review records',
    text: 'Keep a consistent account of what was reviewed, what remains unresolved, and what should be revisited.',
    icon: FileCheck2
  }
];

const workflowSteps = [
  'Start with client flow facts',
  'Identify document and route questions',
  'Prepare notes for specialist review',
  'Download checklists for repeat use'
];

export default function ForAccountantsPage() {
  return (
    <main>
      {/* SECTION 1 — HERO */}
      <section className="rounded-b-[32px] bg-gradient-to-br from-[#102A6B] to-[#071225]">
        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center px-6 py-24 lg:px-8">
          <div className="max-w-[760px]">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              For accountants
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              A cleaner way to prepare cross-border client conversations.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              FlowSignal gives accounting teams a neutral review layer for
              client funds movement questions, with emphasis on facts,
              documentation, and clear handoffs.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-white px-7 py-4 font-semibold text-[#0B1633] hover:bg-gray-100"
              >
                <Link href="/sign-in">
                  Open member dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-xl border border-white/20 bg-transparent px-7 py-4 text-white hover:bg-white/10"
              >
                <Link href="/insights">Read insights</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — USE CASES */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#155EEF]">
              Where it helps
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#08111F] sm:text-4xl">
              Three ways accountants use FlowSignal
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <article
                key={useCase.title}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF]">
                  <useCase.icon className="h-6 w-6 text-[#155EEF]" />
                </div>
                <h2 className="mt-6 text-lg font-semibold text-[#08111F]">
                  {useCase.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">
                  {useCase.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — WORKFLOW + SUPPORTING MESSAGE */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-start lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#155EEF]">
              Built to sit beside professional judgment
            </p>
            <h2 className="mt-4 text-3xl font-bold text-[#08111F]">
              Cleaner inputs for more focused reviews.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#64748B]">
              FlowSignal does not replace tax, legal, or compliance review. It
              helps accountants prepare clearer inputs so those reviews can be
              more focused.
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#155EEF]">
              Accountant workflow
            </p>
            <div className="mt-8 space-y-6">
              {workflowSteps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-sm font-bold text-[#155EEF]">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm font-medium text-[#08111F]">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
