'use client';

import { useActionState } from 'react';
import { BriefcaseBusiness, Calculator, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  updatePortalRoleAction,
  type PortalRoleState
} from './actions';

const roleOptions = [
  {
    value: 'cfo',
    title: 'CFO / Founder Finance',
    description: 'I care about cost, speed, audit confidence, and escalation triggers.',
    icon: BriefcaseBusiness
  },
  {
    value: 'accountant',
    title: 'Accountant',
    description: 'I need client questions, document requests, and advisory prep.',
    icon: Calculator
  },
  {
    value: 'treasury',
    title: 'Treasury / Finance Ops',
    description: 'I need repeatable payment ops, reconciliation, and setup detail.',
    icon: BriefcaseBusiness
  }
] as const;

const initialState: PortalRoleState = {};

export function RolePicker() {
  const [state, formAction, pending] = useActionState<
    PortalRoleState,
    FormData
  >(updatePortalRoleAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who are you?</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="grid gap-3 lg:grid-cols-3">
            {roleOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer gap-3 border border-gray-200 p-4 text-sm has-[:checked]:border-[#0614b8] has-[:checked]:bg-blue-50"
              >
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  className="mt-1 h-4 w-4"
                  required
                />
                <span>
                  <span className="flex items-center gap-2 font-medium text-gray-950">
                    <option.icon className="h-4 w-4 text-[#0614b8]" />
                    {option.title}
                  </span>
                  <span className="mt-2 block leading-5 text-gray-600">
                    {option.description}
                  </span>
                </span>
              </label>
            ))}
          </div>

          {state.error && <p className="text-sm text-red-600">{state.error}</p>}

          <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-gray-500">
              FlowSignal will use this to tailor copy, checklists, and next
              steps. Route logic stays independent of role.
            </p>
            <Button
              type="submit"
              className="bg-[#0614b8] text-white hover:bg-[#07108f]"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save role'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
