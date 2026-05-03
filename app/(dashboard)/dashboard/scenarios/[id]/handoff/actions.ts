'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUser } from '@/lib/db/queries';
import {
  getScenarioForUser,
  scenarioInputFromRecord,
  scenarioOutputFromStoredResult
} from '@/lib/db/scenarios';
import { createHandoffRequest } from '@/lib/db/handoffs';
import { evaluateScenario } from '@/lib/route-intelligence';

const handoffRequestSchema = z.object({
  scenarioId: z.coerce.number().int().positive(),
  routeId: z.string().min(1),
  partnerId: z.string().optional(),
  requestType: z.enum(['intro', 'review']),
  urgency: z.enum(['asap', 'this_week', 'exploring']),
  notes: z.string().max(1000).optional(),
  invoiceAvailable: z.coerce.boolean().default(false),
  purposeCodeKnown: z.coerce.boolean().default(false),
  entityDetailsReady: z.coerce.boolean().default(false)
});

export async function submitHandoffRequest(formData: FormData) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const parsed = handoffRequestSchema.safeParse({
    scenarioId: formData.get('scenarioId'),
    routeId: formData.get('routeId'),
    partnerId: formData.get('partnerId') || undefined,
    requestType: formData.get('requestType'),
    urgency: formData.get('urgency'),
    notes: formData.get('notes') || undefined,
    invoiceAvailable: formData.has('invoiceAvailable'),
    purposeCodeKnown: formData.has('purposeCodeKnown'),
    entityDetailsReady: formData.has('entityDetailsReady')
  });

  if (!parsed.success) {
    throw new Error('Invalid handoff request details');
  }

  const row = await getScenarioForUser(user.id, parsed.data.scenarioId);
  if (!row) {
    throw new Error('Scenario not found');
  }

  const output =
    scenarioOutputFromStoredResult(row.result) ??
    evaluateScenario(scenarioInputFromRecord(row.scenario));
  const route = output.routes.find(
    (candidate) => candidate.routeId === parsed.data.routeId
  );

  if (!route) {
    throw new Error('Selected route is not available for this scenario');
  }

  const partner = parsed.data.partnerId
    ? route.providerMatches.find(
        (match) => match.providerId === parsed.data.partnerId
      )
    : null;

  if (parsed.data.partnerId && !partner) {
    throw new Error('Selected partner is not available for this route');
  }

  await createHandoffRequest({
    userId: user.id,
    scenarioId: row.scenario.id,
    preferredRoute: route.routeName,
    partnerId: partner?.providerId,
    requestType: parsed.data.requestType,
    urgency: parsed.data.urgency,
    notes: parsed.data.notes,
    missingInfo: {
      invoiceAvailable: parsed.data.invoiceAvailable,
      purposeCodeKnown: parsed.data.purposeCodeKnown,
      entityDetailsReady: parsed.data.entityDetailsReady
    }
  });

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/scenarios/${row.scenario.id}`);
  redirect(
    `/dashboard/scenarios/${row.scenario.id}/handoff?submitted=1&requestType=${parsed.data.requestType}`
  );
}
