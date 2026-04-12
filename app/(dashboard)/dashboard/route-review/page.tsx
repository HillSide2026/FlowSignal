import { CheckCircle2, FileQuestion, GitCompare, ListChecks } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const stages = [
  {
    title: 'Define the route',
    text: 'Document source and destination jurisdictions, parties, business purpose, and expected timing.',
    icon: GitCompare
  },
  {
    title: 'Identify open questions',
    text: 'Separate missing facts from questions that require tax, legal, banking, or compliance input.',
    icon: FileQuestion
  },
  {
    title: 'Prepare a review brief',
    text: 'Summarize route assumptions, documents reviewed, unresolved items, and next review owner.',
    icon: ListChecks
  }
];

export default function RouteReviewPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-[#0614b8]">
          Protected workspace
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-950">
          Route Review
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Use this workspace to prepare route context before a client question
          moves into deeper professional review.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {stages.map((stage) => (
          <Card key={stage.title}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center bg-[#0614b8] text-white">
                <stage.icon className="h-5 w-5" />
              </div>
              <CardTitle>{stage.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-gray-600">{stage.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Route review brief</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              'Countries and currencies involved',
              'Known counterparties and relationship to client',
              'Business purpose and supporting records',
              'Timing constraints and reporting dates',
              'Documents received and documents still missing',
              'Questions assigned to specialist review'
            ].map((item) => (
              <div key={item} className="flex gap-3 border border-gray-200 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0584c7]" />
                <p className="text-sm leading-6 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
