import { Download, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const resources = [
  {
    title: 'Cross-border flow review checklist',
    description:
      'A practical checklist for gathering route, party, timing, and documentation facts.',
    href: '/resources/cross-border-flow-review-checklist.txt'
  },
  {
    title: 'Accountant client intake questions',
    description:
      'Neutral intake prompts for client conversations about cross-border movement.',
    href: '/resources/accountant-client-intake-questions.txt'
  },
  {
    title: 'Documentation map',
    description:
      'A simple structure for tracking records received, pending, and assigned for review.',
    href: '/resources/documentation-map.txt'
  }
];

export default function ResourcesPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-[#0614b8]">
          Member resources
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-950">
          Resources
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Download reusable information products for client intake, route
          review, and document preparation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.title}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center bg-[#0614b8] text-white">
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle>{resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="min-h-20 text-sm leading-6 text-gray-600">
                {resource.description}
              </p>
              <Button
                asChild
                className="mt-6 bg-[#0614b8] text-white hover:bg-[#07108f]"
              >
                <a href={resource.href} download>
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
