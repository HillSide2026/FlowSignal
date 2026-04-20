'use client';

import { useActionState } from 'react';
import { Loader2, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  countryOptions,
  currencyOptions,
  defaultScenarioFormValues,
  directionOptions,
  priorityOptions,
  useCaseOptions
} from './scenario-options';
import {
  createScenarioAction,
  type ScenarioFormState,
  type ScenarioFormValues
} from './actions';

const initialState: ScenarioFormState = {
  values: defaultScenarioFormValues
};

export function ScenarioQuestionnaireForm() {
  const [state, formAction, pending] = useActionState<
    ScenarioFormState,
    FormData
  >(createScenarioAction, initialState);
  const values = state.values;

  return (
    <Card>
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center bg-[#0614b8] text-white">
          <Route className="h-5 w-5" />
        </div>
        <CardTitle>Scenario details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <fieldset>
            <legend className="text-sm font-medium text-gray-900">
              Direction
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {directionOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer gap-3 border border-gray-200 p-4 text-sm has-[:checked]:border-[#0614b8] has-[:checked]:bg-blue-50"
                >
                  <input
                    type="radio"
                    name="direction"
                    value={option.value}
                    defaultChecked={values.direction === option.value}
                    className="mt-1 h-4 w-4"
                    required
                  />
                  <span>
                    <span className="block font-medium text-gray-950">
                      {option.label}
                    </span>
                    <span className="mt-1 block leading-5 text-gray-600">
                      {option.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
            <FieldError message={state.fieldErrors?.direction} />
          </fieldset>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              id="originCountry"
              label="Origin country"
              name="originCountry"
              options={countryOptions}
              defaultValue={values.originCountry}
              error={state.fieldErrors?.originCountry}
            />
            <SelectField
              id="destinationCountry"
              label="Destination country"
              name="destinationCountry"
              options={countryOptions}
              defaultValue={values.destinationCountry}
              error={state.fieldErrors?.destinationCountry}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_10rem]">
            <div>
              <Label htmlFor="amount" className="mb-2">
                Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                inputMode="decimal"
                min="1"
                step="0.01"
                defaultValue={values.amount}
                required
              />
              <FieldError message={state.fieldErrors?.amount} />
            </div>
            <SelectField
              id="currency"
              label="Currency"
              name="currency"
              options={currencyOptions}
              defaultValue={values.currency}
              error={state.fieldErrors?.currency}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              id="businessUseCase"
              label="Business use case"
              name="businessUseCase"
              options={useCaseOptions}
              defaultValue={values.businessUseCase}
              error={state.fieldErrors?.businessUseCase}
            />
            <fieldset>
              <legend className="text-sm font-medium text-gray-900">
                Priority
              </legend>
              <div className="mt-2 grid gap-2">
                {priorityOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer gap-3 border border-gray-200 p-3 text-sm has-[:checked]:border-[#0614b8] has-[:checked]:bg-blue-50"
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={option.value}
                      defaultChecked={values.priority === option.value}
                      className="mt-1 h-4 w-4"
                      required
                    />
                    <span>
                      <span className="block font-medium text-gray-950">
                        {option.label}
                      </span>
                      <span className="mt-1 block leading-5 text-gray-600">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <FieldError message={state.fieldErrors?.priority} />
            </fieldset>
          </div>

          {state.error && (
            <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-gray-500">
              Outputs are advisory planning ranges. FlowSignal does not move
              money, hold funds, or guarantee pricing or timelines.
            </p>
            <Button
              type="submit"
              className="bg-[#0614b8] text-white hover:bg-[#07108f]"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                'Evaluate routes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SelectField({
  id,
  label,
  name,
  options,
  defaultValue,
  error
}: {
  id: keyof ScenarioFormValues;
  label: string;
  name: keyof ScenarioFormValues;
  options: readonly { value: string; label: string }[];
  defaultValue: string;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-2">
        {label}
      </Label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
        required
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}
