'use client';

import { Suspense, useActionState } from 'react';
import useSWR from 'swr';
import { Loader2, Lock, PlusCircle, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  inviteTeamMember,
  updateAccount,
  updatePassword
} from '@/app/(login)/actions';
import { TeamDataWithMembers, User } from '@/lib/db/schema';

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
};

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function AccountFields({ state }: { state: ActionState }) {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  return (
    <>
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your name"
          defaultValue={state.name || user?.name || ''}
          required
        />
      </div>
      <div>
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@company.com"
          defaultValue={user?.email || ''}
          required
        />
      </div>
    </>
  );
}

function TeamAccess() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(inviteTeamMember, {});
  const isOwner = user?.role === 'owner';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {teamData?.name || 'FlowSignal Workspace'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Current members and invited colleagues use the same protected
              dashboard.
            </p>
          </div>
          <div className="divide-y divide-gray-200 border-y border-gray-200">
            {teamData?.teamMembers?.length ? (
              teamData.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center bg-gray-100 text-gray-600">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.user.name || member.user.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium uppercase text-gray-500">
                    {member.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-4 text-sm text-gray-500">
                No workspace members found.
              </p>
            )}
          </div>
          <form action={inviteAction} className="space-y-4">
            <input type="hidden" name="role" value="member" />
            <div>
              <Label htmlFor="invite-email" className="mb-2">
                Invite colleague
              </Label>
              <Input
                id="invite-email"
                name="email"
                type="email"
                placeholder="colleague@company.com"
                required
                disabled={!isOwner}
              />
            </div>
            {inviteState?.error && (
              <p className="text-sm text-red-500">{inviteState.error}</p>
            )}
            {inviteState?.success && (
              <p className="text-sm text-green-600">{inviteState.success}</p>
            )}
            <Button
              type="submit"
              className="bg-[#0614b8] text-white hover:bg-[#07108f]"
              disabled={isInvitePending || !isOwner}
            >
              {isInvitePending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Send invite
                </>
              )}
            </Button>
          </form>
        </div>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-gray-500">
            Workspace invitations are limited to owners.
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

export default function AccountPage() {
  const [accountState, accountAction, isAccountPending] = useActionState<
    ActionState,
    FormData
  >(updateAccount, {});
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    PasswordState,
    FormData
  >(updatePassword, {});

  return (
    <section className="flex-1 p-4 lg:p-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-[#0614b8]">
          Member settings
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-gray-950">Account</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          Manage profile details, password settings, and workspace access.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" action={accountAction}>
              <Suspense fallback={null}>
                <AccountFields state={accountState} />
              </Suspense>
              {accountState.error && (
                <p className="text-sm text-red-500">{accountState.error}</p>
              )}
              {accountState.success && (
                <p className="text-sm text-green-600">
                  {accountState.success}
                </p>
              )}
              <Button
                type="submit"
                className="bg-[#0614b8] text-white hover:bg-[#07108f]"
                disabled={isAccountPending}
              >
                {isAccountPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save account'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" action={passwordAction}>
              <div>
                <Label htmlFor="current-password" className="mb-2">
                  Current password
                </Label>
                <Input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  minLength={8}
                  maxLength={100}
                  defaultValue={passwordState.currentPassword}
                />
              </div>
              <div>
                <Label htmlFor="new-password" className="mb-2">
                  New password
                </Label>
                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={100}
                  defaultValue={passwordState.newPassword}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password" className="mb-2">
                  Confirm new password
                </Label>
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  maxLength={100}
                  defaultValue={passwordState.confirmPassword}
                />
              </div>
              {passwordState.error && (
                <p className="text-sm text-red-500">{passwordState.error}</p>
              )}
              {passwordState.success && (
                <p className="text-sm text-green-600">
                  {passwordState.success}
                </p>
              )}
              <Button
                type="submit"
                className="bg-[#0614b8] text-white hover:bg-[#07108f]"
                disabled={isPasswordPending}
              >
                {isPasswordPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Update password
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Suspense fallback={null}>
          <TeamAccess />
        </Suspense>
      </div>
    </section>
  );
}
