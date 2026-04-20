'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getUser, getUserWithTeam } from '@/lib/db/queries';
import { createScenarioWithResult } from '@/lib/db/scenarios';
import { evaluateScenario } from '@/lib/route-intelligence';
import { defaultScenarioFormValues } from './scenario-options';

const countrySchema = z.enum(['IN', 'US', 'AE', 'SG', 'GB', 'EU']);

const scenarioFormSchema = z
  .object({
    direction: z.enum(['send', 'receive']),
    originCountry: countrySchema,
    destinationCountry: countrySchema,
    amount: z.coerce
      .number({ invalid_type_error: 'Enter a positive payment amount.' })
      .positive('Enter a positive payment amount.'),
    currency: z.enum(['INR', 'USD', 'AED', 'SGD', 'GBP', 'EUR']),
    businessUseCase: z.enum([
      'saas_exports',
      'services_exports',
      'vendor_payments',
      'import_export_trade_flow',
      'recurring_international_flow'
    ]),
    priority: z.enum(['cost', 'speed', 'balanced'])
  })
  .refine((data) => data.originCountry !== data.destinationCountry, {
    path: ['destinationCountry'],
    message: 'Choose a different destination country.'
  });

export type ScenarioFormValues = {
  direction: string;
  originCountry: string;
  destinationCountry: string;
  amount: string;
  currency: string;
  businessUseCase: string;
  priority: string;
};

export type ScenarioFormState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof ScenarioFormValues, string>>;
  values: ScenarioFormValues;
};

export async function createScenarioAction(
  _previousState: ScenarioFormState,
  formData: FormData
): Promise<ScenarioFormState> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const values = readScenarioFormValues(formData);
  const parsed = scenarioFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      error: 'Please check the scenario details and try again.',
      fieldErrors: toFieldErrors(parsed.error),
      values
    };
  }

  const input = {
    direction: parsed.data.direction,
    sourceCountry: parsed.data.originCountry,
    destinationCountry: parsed.data.destinationCountry,
    amount: parsed.data.amount,
    currency: parsed.data.currency,
    businessUseCase: parsed.data.businessUseCase,
    priority: parsed.data.priority
  };
  const output = evaluateScenario(input);

  if (output.status === 'invalid') {
    return {
      error:
        output.inputErrors[0] ??
        'FlowSignal could not evaluate this scenario. Please check the details.',
      values
    };
  }

  const userWithTeam = await getUserWithTeam(user.id);
  const scenarioId = await createScenarioWithResult({
    userId: user.id,
    teamId: userWithTeam?.teamId,
    input: {
      direction: parsed.data.direction,
      originCountry: parsed.data.originCountry,
      destinationCountry: parsed.data.destinationCountry,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      businessUseCase: parsed.data.businessUseCase,
      priority: parsed.data.priority
    },
    output
  });

  revalidatePath('/dashboard/scenarios');
  redirect(`/dashboard/scenarios/${scenarioId}`);
}

function readScenarioFormValues(formData: FormData): ScenarioFormValues {
  return {
    direction: getFormValue(formData, 'direction'),
    originCountry: getFormValue(formData, 'originCountry'),
    destinationCountry: getFormValue(formData, 'destinationCountry'),
    amount: getFormValue(formData, 'amount'),
    currency: getFormValue(formData, 'currency'),
    businessUseCase: getFormValue(formData, 'businessUseCase'),
    priority: getFormValue(formData, 'priority')
  };
}

function getFormValue(formData: FormData, key: keyof ScenarioFormValues) {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function toFieldErrors(error: z.ZodError) {
  const fieldErrors: ScenarioFormState['fieldErrors'] = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && field in defaultScenarioFormValues) {
      fieldErrors[field as keyof ScenarioFormValues] = issue.message;
    }
  }

  return fieldErrors;
}
