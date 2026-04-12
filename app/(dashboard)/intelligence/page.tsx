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

export default function IntelligencePage() {
  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#0614b8]">
              Intelligence model
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-gray-950 sm:text-5xl">
              Structure cross-border flow reviews before advice is finalized.
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              FlowSignal is designed to help teams organize facts, identify
              missing context, and produce consistent review materials for
              cross-border client situations.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center bg-[#0614b8] text-white">
                <pillar.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-gray-950">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {pillar.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold text-gray-950">
              What FlowSignal helps clarify
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              The model is intentionally practical. It gives accountants,
              advisors, and internal operators a common review frame for client
              flow questions.
            </p>
          </div>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {[
              'Which corridors and parties are material to the review.',
              'Which documents are complete, missing, or unclear.',
              'Where timing, reporting, or operational questions need attention.',
              'Which notes should be prepared before a client discussion.'
            ].map((item) => (
              <p key={item} className="py-4 text-sm leading-6 text-gray-700">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Member tools are available after login.
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Access the diagnostic calculator, route review materials, and
              downloadable resources from the protected dashboard.
            </p>
          </div>
          <Button asChild className="bg-white text-gray-950 hover:bg-gray-100">
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
