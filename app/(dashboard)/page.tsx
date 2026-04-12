import Link from 'next/link';
import { ArrowRight, ClipboardCheck, FileSearch, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowSignalLogo } from '@/components/brand/flowsignal-logo';

const reviewAreas = [
  {
    title: 'Flow Diagnostics',
    text: 'Organize cross-border inflows, outflows, timing patterns, and document coverage in one review frame.'
  },
  {
    title: 'Route Review',
    text: 'Compare corridors, counterparties, intermediaries, and operational steps without recommending a transaction path.'
  },
  {
    title: 'Client-Ready Resources',
    text: 'Prepare intake notes, route summaries, and documentation checklists for internal and advisory use.'
  }
];

const signals = [
  'Corridor concentration',
  'Timing sensitivity',
  'Document readiness',
  'Counterparty clarity'
];

export default function HomePage() {
  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#0614b8]">
              Cross-border flow intelligence
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-gray-950 sm:text-5xl">
              Practical visibility for cross-border financial movement.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              FlowSignal helps professional teams review cross-border flows,
              identify friction points, and prepare clear client-facing
              materials before advisory decisions are made.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-[#0614b8] text-white hover:bg-[#07108f]"
              >
                <Link href="/intelligence">
                  Review the model
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sign-in">Member login</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex justify-center border-b border-gray-200 pb-6">
                <FlowSignalLogo lockup imageClassName="w-52" />
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Review frame
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-gray-950">
                    Monthly corridor brief
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {signals.map((signal) => (
                    <div key={signal} className="border border-gray-200 p-3">
                      <p className="text-sm font-medium text-gray-900">
                        {signal}
                      </p>
                      <p className="mt-2 h-2 w-full bg-gray-100">
                        <span className="block h-2 w-2/3 bg-[#0584c7]" />
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-6 text-gray-600">
                  Built for documentation, route awareness, and advisory
                  preparation before a team decides what needs deeper review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          {reviewAreas.map((area, index) => {
            const Icon =
              index === 0 ? FileSearch : index === 1 ? Network : ClipboardCheck;

            return (
              <article key={area.title} className="bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center bg-[#0614b8] text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-gray-950">
                  {area.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {area.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[#0614b8]">
              Built for advisory workflows
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-gray-950">
              A shared language for cross-border review.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Document client flows before recommending next steps.',
              'Separate operational friction from policy or tax questions.',
              'Create a review trail that colleagues can understand.',
              'Give accountants a structured starting point for client calls.'
            ].map((item) => (
              <div key={item} className="border-l-2 border-[#0584c7] pl-4">
                <p className="text-sm leading-6 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
