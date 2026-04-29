import Link from 'next/link';
import { ArrowRight, FileText, Gauge, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pillars = [
  {
    title: 'Flow context',
    text: 'Capture where money is expected to move, which parties are involved, and what business purpose sits behind the movement.',
    icon: Route
  },
  {
    title: 'Review signals',
    text: 'Flag practical questions around documentation, timing, concentration, and handoff points for professional review.',
    icon: Gauge
  },
  {
    title: 'Decision support',
    text: 'Turn scattered flow details into notes, checklists, and review summaries that advisory teams can use with clients.',
    icon: FileText
  }
];

const clarifyItems = [
  'Which corridors and parties are material to the review.',
  'Which documents are complete, missing, or unclear.',
  'Where timing, reporting, or operational questions need attention.',
  'Which notes should be prepared before a client discussion.'
];

export default function IntelligencePage() {
  return (
    <main>
      {/* SECTION 1 — HERO */}
      <section className="rounded-b-[32px] bg-gradient-to-br from-[#102A6B] to-[#071225]">
        <div className="mx-auto flex min-h-[400px] max-w-7xl items-center px-6 py-24 lg:px-8">
          <div className="max-w-[760px]">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              Intelligence model
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Structure cross-border flow reviews before advice is finalized.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">
              FlowSignal is designed to help teams organize facts, identify
              missing context, and produce consistent review materials for
              cross-border client situations.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PILLARS */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#155EEF]">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#08111F] sm:text-4xl">
              Three pillars of flow intelligence
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[#64748B]">
              A consistent review frame for client flow questions across
              corridors, documents, and handoffs.
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2FF]">
                  <pillar.icon className="h-6 w-6 text-[#155EEF]" />
                </div>
                <h2 className="mt-6 text-lg font-semibold text-[#08111F]">
                  {pillar.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#64748B]">
                  {pillar.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHAT IT CLARIFIES */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#155EEF]">
              Practical scope
            </p>
            <h2 className="mt-4 text-3xl font-bold text-[#08111F]">
              What FlowSignal helps clarify
            </h2>
            <p className="mt-4 text-base leading-7 text-[#64748B]">
              The model is intentionally practical. It gives accountants,
              advisors, and internal operators a common review frame for client
              flow questions.
            </p>
          </div>
          <div className="space-y-4">
            {clarifyItems.map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-xl bg-gray-50 p-5"
              >
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#155EEF]" />
                <p className="text-sm leading-6 text-[#64748B]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — CTA */}
      <section className="bg-[#0B1633]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Member tools are available after login.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Access the diagnostic calculator, route review materials, and
              downloadable resources from the protected dashboard.
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
