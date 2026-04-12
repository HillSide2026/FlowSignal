'use client';

import { useMemo, useState } from 'react';
import { Calculator, FileText, Route, ShieldCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const diagnosticNotes = [
  {
    title: 'Documentation',
    text: 'Prepare invoices, agreements, banking records, and purpose notes before review.',
    icon: FileText
  },
  {
    title: 'Route context',
    text: 'Separate countries, counterparties, intermediaries, and timing into a clear route map.',
    icon: Route
  },
  {
    title: 'Review posture',
    text: 'Use the output as a planning prompt for professional analysis, not as a recommendation.',
    icon: ShieldCheck
  }
];

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export default function FlowDiagnosticsPage() {
  const [monthlyOutbound, setMonthlyOutbound] = useState('125000');
  const [monthlyInbound, setMonthlyInbound] = useState('45000');
  const [corridors, setCorridors] = useState('3');
  const [urgentShare, setUrgentShare] = useState('20');
  const [manualHours, setManualHours] = useState('6');

  const diagnostic = useMemo(() => {
    const outbound = toNumber(monthlyOutbound);
    const inbound = toNumber(monthlyInbound);
    const corridorCount = Math.max(1, Math.round(toNumber(corridors)));
    const urgent = Math.min(100, toNumber(urgentShare));
    const hours = toNumber(manualHours);
    const volume = outbound + inbound;

    const volumeScore = Math.min(34, volume / 15000);
    const corridorScore = Math.min(24, corridorCount * 6);
    const timingScore = Math.min(22, urgent * 0.22);
    const manualScore = Math.min(20, hours * 2.5);
    const index = Math.min(
      100,
      Math.round(volumeScore + corridorScore + timingScore + manualScore)
    );

    const priority =
      index >= 70 ? 'High' : index >= 40 ? 'Moderate' : 'Baseline';
    const estimatedReviewHours = Math.round(
      (hours * 4.3 + corridorCount * 2.5 + urgent / 12) * 10
    ) / 10;

    return {
      index,
      priority,
      estimatedReviewHours,
      volume
    };
  }, [corridors, manualHours, monthlyInbound, monthlyOutbound, urgentShare]);

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-[#0614b8]">
          Member dashboard
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-950">
          Flow Diagnostics
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Use this gated calculator to frame a cross-border flow review before
          preparing notes, route questions, or client-facing materials.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#0614b8]" />
              Diagnostic calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="monthly-outbound" className="mb-2">
                  Monthly outbound flow
                </Label>
                <Input
                  id="monthly-outbound"
                  inputMode="decimal"
                  value={monthlyOutbound}
                  onChange={(event) => setMonthlyOutbound(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monthly-inbound" className="mb-2">
                  Monthly inbound flow
                </Label>
                <Input
                  id="monthly-inbound"
                  inputMode="decimal"
                  value={monthlyInbound}
                  onChange={(event) => setMonthlyInbound(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="corridors" className="mb-2">
                  Active corridors
                </Label>
                <Input
                  id="corridors"
                  inputMode="numeric"
                  value={corridors}
                  onChange={(event) => setCorridors(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="urgent-share" className="mb-2">
                  Time-sensitive share
                </Label>
                <Input
                  id="urgent-share"
                  inputMode="decimal"
                  value={urgentShare}
                  onChange={(event) => setUrgentShare(event.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="manual-hours" className="mb-2">
                  Manual review hours per week
                </Label>
                <Input
                  id="manual-hours"
                  inputMode="decimal"
                  value={manualHours}
                  onChange={(event) => setManualHours(event.target.value)}
                />
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-gray-500">
              Directional planning estimate only. Review outputs should be
              validated by the appropriate professional team.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnostic output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Flow exposure index</p>
                <p className="mt-2 text-4xl font-semibold text-gray-950">
                  {diagnostic.index}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Review priority</p>
                  <p className="mt-2 text-lg font-semibold text-[#0614b8]">
                    {diagnostic.priority}
                  </p>
                </div>
                <div className="border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Monthly volume</p>
                  <p className="mt-2 text-lg font-semibold text-gray-950">
                    {diagnostic.volume.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="border-l-2 border-[#0584c7] pl-4">
                <p className="text-sm leading-6 text-gray-700">
                  Estimated documentation and preparation load:{' '}
                  <span className="font-semibold">
                    {diagnostic.estimatedReviewHours} hours per month
                  </span>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {diagnosticNotes.map((note) => (
          <Card key={note.title}>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center bg-[#0614b8] text-white">
                <note.icon className="h-5 w-5" />
              </div>
              <CardTitle>{note.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-gray-600">{note.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
