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

export default function ForAccountantsPage() {
  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#0614b8]">
              For accountants
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-gray-950 sm:text-5xl">
              A cleaner way to prepare cross-border client conversations.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              FlowSignal gives accounting teams a neutral review layer for
              client funds movement questions, with emphasis on facts,
              documentation, and clear handoffs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-[#0614b8] text-white hover:bg-[#07108f]"
              >
                <Link href="/sign-in">
                  Open member dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/insights">Read insights</Link>
              </Button>
            </div>
          </div>
          <div className="border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Accountant workflow
            </p>
            <div className="mt-6 space-y-5">
              {[
                'Start with client flow facts',
                'Identify document and route questions',
                'Prepare notes for specialist review',
                'Download checklists for repeat use'
              ].map((step, index) => (
                <div key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#0584c7] text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm font-medium text-gray-800">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          {useCases.map((useCase) => (
            <article key={useCase.title} className="bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center bg-[#0614b8] text-white">
                <useCase.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-gray-950">
                {useCase.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {useCase.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-gray-950">
              Built to sit beside existing professional judgment.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              FlowSignal does not replace tax, legal, or compliance review. It
              helps accountants prepare clearer inputs so those reviews can be
              more focused.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
