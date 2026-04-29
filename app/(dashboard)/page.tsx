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
      {/* SECTION 1 — HERO */}
      <section className="rounded-b-[32px] bg-gradient-to-br from-[#102A6B] to-[#071225]">
        <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-[760px]">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              Cross-border payment intelligence
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              See the best payment options now
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              FlowSignal helps CFOs, Accountants, and Treasury compare Routes,
              Costs, &amp; Timelines for cross-border payments.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-white px-7 py-4 font-semibold text-[#0B1633] hover:bg-gray-100"
              >
                <Link href="/sign-up">
                  See your best payment options
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="rounded-xl border border-white/20 bg-transparent px-7 py-4 text-white hover:bg-white/10"
              >
                <Link href="/intelligence">Explore how it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PAIN POINTS */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#155EEF]">
              Where it gets complicated
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#08111F] sm:text-4xl">
              What makes cross-border payments hard
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {painPoints.map((item) => (
              <article
                key={item.title}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF]">
                  <item.icon className="h-6 w-6 text-[#155EEF]" />
                </div>
                <h2 className="mt-6 text-lg font-semibold text-[#08111F]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — CORRIDORS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#155EEF]">
                High-confusion corridors
              </p>
              <h2 className="mt-4 text-3xl font-bold text-[#08111F]">
                Route guidance for flows Indian finance teams handle often.
              </h2>
              <p className="mt-4 text-base leading-7 text-[#64748B]">
                Start with the payment scenario, then compare route options by
                cost, timing, provider fit, and documentation requirements.
              </p>
            </div>
            <div className="grid gap-4">
              {corridors.map((corridor) => (
                <article
                  key={corridor.title}
                  className="rounded-xl bg-gray-50 p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-1.5 w-8 rounded-full bg-[#155EEF]" />
                    <h3 className="text-base font-semibold text-[#08111F]">
                      {corridor.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-6 text-[#64748B]">
                    {corridor.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — SNAPSHOT + STATS */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#155EEF]">
                What FlowSignal evaluates
              </p>
              <h2 className="mt-4 text-3xl font-bold text-[#08111F]">
                Clarity across every dimension of a cross-border payment.
              </h2>
              <div className="mt-10 grid grid-cols-3 gap-8 border-t border-[#E5E7EB] pt-10">
                <div>
                  <p className="text-4xl font-bold text-[#08111F]">3+</p>
                  <p className="mt-2 text-sm text-[#64748B]">
                    Active corridors
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-[#08111F]">5</p>
                  <p className="mt-2 text-sm text-[#64748B]">
                    Route dimensions
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-[#08111F]">100%</p>
                  <p className="mt-2 text-sm text-[#64748B]">
                    Neutral guidance
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="border-b border-[#E5E7EB] pb-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                  Payment options snapshot
                </p>
                <h2 className="mt-2 text-lg font-bold text-[#08111F]">
                  India to US SaaS export receipt
                </h2>
              </div>
              <div className="mt-2 divide-y divide-[#E5E7EB]">
                {comparisonRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid gap-2 py-3.5 sm:grid-cols-[7rem_1fr]"
                  >
                    <p className="text-sm font-semibold text-[#08111F]">
                      {row.label}
                    </p>
                    <p className="text-sm leading-6 text-[#64748B]">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — HOW FLOWSIGNAL WORKS */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#155EEF]">
              How FlowSignal works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#08111F] sm:text-4xl">
              Built for honest, neutral guidance
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#64748B]">
              FlowSignal is not a payment processor. It helps evaluate options
              so your team arrives at the right decision.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {trustSignals.map((signal) => (
              <article
                key={signal.title}
                className="rounded-xl bg-gray-50 p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF]">
                  <signal.icon className="h-6 w-6 text-[#155EEF]" />
                </div>
                <h2 className="mt-6 text-lg font-semibold text-[#08111F]">
                  {signal.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">
                  {signal.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
