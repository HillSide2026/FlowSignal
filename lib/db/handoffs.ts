import 'server-only';

import { db } from './drizzle';
import { handoffRequests, type NewHandoffRequest } from './schema';

export type HandoffRequestInput = {
  userId: number;
  scenarioId: number;
  preferredRoute: string;
  partnerId?: string | null;
  requestType: 'intro' | 'review';
  urgency: 'asap' | 'this_week' | 'exploring';
  notes?: string | null;
  missingInfo: {
    invoiceAvailable: boolean;
    purposeCodeKnown: boolean;
    entityDetailsReady: boolean;
  };
};

export async function createHandoffRequest(input: HandoffRequestInput) {
  const values: NewHandoffRequest = {
    userId: input.userId,
    scenarioId: input.scenarioId,
    preferredRoute: input.preferredRoute,
    partnerId: input.partnerId ?? null,
    requestType: input.requestType,
    status: 'submitted',
    urgency: input.urgency,
    notes: input.notes?.trim() || null,
    missingInfoJson: input.missingInfo
  };

  const [createdRequest] = await db
    .insert(handoffRequests)
    .values(values)
    .returning({ id: handoffRequests.id });

  if (!createdRequest) {
    throw new Error('Handoff request could not be created');
  }

  return createdRequest.id;
}
