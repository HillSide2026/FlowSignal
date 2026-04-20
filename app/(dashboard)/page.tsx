import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  FileCheck2,
  IndianRupee,
  Route,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowSignalLogo } from '@/components/brand/flowsignal-logo';

const comparisonRows = [
  {
    label: 'Route',
    value: 'Bank wire, fintech collection, or specialist payout path'
  },
  {
    label: 'Cost range',
    value: 'FX spread, platform fee, correspondent deductions'
  },
  {
    label: 'Timeline',
    value: 'Same day, 1-2 days, or document-dependent'
  },
  {
    label: 'Compliance',
    value: 'Purpose code, invoice, FEMA/RBI context, bank notes'
  },
  {
    label: 'Provider fit',
    value: 'Why this route suits the payment scenario'
  }
];

const painPoints = [
  {
    title: 'No clear view of options',
    text: 'Compare bank, fintech, and specialist routes without chasing every provider separately.',
    icon: Route
  },
  {
    title: 'Exchange rates and unclear fees',
    text: 'See realistic cost ranges, FX spread drivers, and fees that can change the true landed value.',
    icon: IndianRupee
  },
  {
    title: 'Execution risk and delays',
    text: 'Understand documentation, purpose-code, and compliance questions before a payment gets stuck.',
    icon: Clock3
  }
];

const corridors = [
  {
    title: 'India to US',
    text: 'Recurring SaaS and services export payments where FX sensitivity and documentation quality matter.'
  },
  {
    title: 'India to UAE or Singapore',
    text: 'Vendor and trade payments where speed, route choice, and compliance readiness need a clear tradeoff.'
  },
  {
    title: 'India to UK or EU',
    text: 'Mixed mid-market flows with multiple provider options and different operating constraints.'
  }
];

const trustSignals = [
  {
    title: 'Not a payments processor',
    text: 'FlowSignal helps evaluate options. Execution stays with the provider and finance team you choose.',
    icon: ShieldCheck
  },
  {
    title: 'Recommendations based on fit',
    text: 'The best route depends on direction, amount, urgency, documents, and compliance context.',
    icon: BadgeCheck
  },
  {
    title: 'Transparent breakdowns',
    text: 'Cost ranges, tradeoffs, and provider rationale are shown clearly instead of hidden behind one quote.',
    icon: FileCheck2
  }
];

export default function HomePage() {
  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-[#0614b8]">
                Cross-border payment intelligence for Indian finance teams
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-gray-950 sm:text-5xl">
                See the best payment options before your next international
                transfer.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                FlowSignal helps CFOs, external accountants, and treasury teams
                compare routes, realistic costs, timelines, compliance
                requirements, and provider fit for cross-border payments.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#0614b8] text-white hover:bg-[#07108f]"
                >
                  <Link href="/sign-up">
                    See your best payment options
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/intelligence">Explore how it works</Link>
                </Button>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-gray-500">
                Built for SaaS exporters, import/export businesses, and
                companies with recurring international flows. Not a payment
                processor or a promise of one universal route.
              </p>
            </div>

            <div className="border border-gray-200 bg-gray-50 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Payment options snapshot
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-gray-950">
                    India to US SaaS export receipt
                  </h2>
                </div>
                <FlowSignalLogo lockup imageClassName="w-28" />
              </div>
              <div className="mt-5 divide-y divide-gray-200">
                {comparisonRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-2 py-4 sm:grid-cols-[7rem_1fr]"
                  >
                    <p className="text-sm font-semibold text-gray-950">
                      {row.label}
                    </p>
                    <p className="text-sm leading-6 text-gray-600">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          {painPoints.map((item) => (
            <article key={item.title} className="bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center bg-[#0614b8] text-white">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-gray-950">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-[#0614b8]">
              High-confusion corridors
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-gray-950">
              Route guidance for flows Indian finance teams handle often.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Start with the payment scenario, then compare route options by
              cost, timing, provider fit, and documentation requirements.
            </p>
          </div>
          <div className="grid gap-4">
            {corridors.map((corridor) => (
              <article
                key={corridor.title}
                className="border-l-2 border-[#0584c7] pl-4"
              >
                <h3 className="text-base font-semibold text-gray-950">
                  {corridor.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {corridor.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          {trustSignals.map((signal) => (
            <article key={signal.title} className="bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center bg-[#0584c7] text-white">
                <signal.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-gray-950">
                {signal.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {signal.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#0614b8]">
              For CFOs, external accountants, and treasury teams
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-gray-950">
              Bring a clearer comparison into every payment decision.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Use FlowSignal to review options before choosing a provider,
              preparing documents, or escalating a payment question.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#0614b8] text-white hover:bg-[#07108f]"
            >
              <Link href="/sign-up">
                See your best payment options
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/for-accountants">For accountants</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
