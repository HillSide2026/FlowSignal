'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { eq } from 'drizzle-orm';

const portalRoleSchema = z.enum(['cfo', 'accountant', 'treasury']);

export type PortalRoleState = {
  error?: string;
};

export async function updatePortalRoleAction(
  _previousState: PortalRoleState,
  formData: FormData
): Promise<PortalRoleState> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const parsed = portalRoleSchema.safeParse(formData.get('role'));
  if (!parsed.success) {
    return {
      error: 'Choose the role that best matches how you use FlowSignal.'
    };
  }

  await db
    .update(users)
    .set({
      role: parsed.data,
      updatedAt: new Date()
    })
    .where(eq(users.id, user.id));

  revalidatePath('/dashboard');

  return {};
}
