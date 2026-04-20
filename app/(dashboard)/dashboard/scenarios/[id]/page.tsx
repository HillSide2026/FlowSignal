import { notFound, redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';
import {
  getScenarioForUser,
  scenarioInputFromRecord,
  scenarioOutputFromStoredResult
} from '@/lib/db/scenarios';
import { evaluateScenario } from '@/lib/route-intelligence';
import { ScenarioResultsView } from '../scenario-results-view';

export default async function ScenarioResultPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { id } = await params;
  const scenarioId = Number(id);
  if (!Number.isInteger(scenarioId) || scenarioId <= 0) {
    notFound();
  }

  const row = await getScenarioForUser(user.id, scenarioId);
  if (!row) {
    notFound();
  }

  const output =
    scenarioOutputFromStoredResult(row.result) ??
    evaluateScenario(scenarioInputFromRecord(row.scenario));

  return <ScenarioResultsView scenario={row.scenario} output={output} />;
}

