import assert from 'node:assert/strict';
import { test } from 'node:test';
import { canManageWorkspaceMembers } from '../lib/auth/authorization';
import {
  AUTH_SECRET_PLACEHOLDER,
  getSessionSigningSecret,
  isUsableAuthSecret
} from '../lib/auth/session-secret';
import { toSafeUser } from '../lib/auth/safe-user';

test('safe user serialization excludes sensitive account fields', () => {
  const user = {
    id: 7,
    name: 'FlowSignal User',
    email: 'user@example.com',
    passwordHash: 'hashed-password',
    role: 'owner',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    deletedAt: null
  };

  const safeUser = toSafeUser(user);

  assert.deepEqual(safeUser, {
    id: 7,
    name: 'FlowSignal User',
    email: 'user@example.com'
  });
  assert.equal('passwordHash' in safeUser!, false);
  assert.equal('role' in safeUser!, false);
});

test('session signing secret rejects missing, placeholder, and weak values', () => {
  assert.equal(isUsableAuthSecret(undefined), false);
  assert.equal(isUsableAuthSecret(AUTH_SECRET_PLACEHOLDER), false);
  assert.equal(isUsableAuthSecret('short-secret'), false);
  assert.equal(isUsableAuthSecret('a'.repeat(32)), true);

  assert.throws(() => getSessionSigningSecret({ AUTH_SECRET: AUTH_SECRET_PLACEHOLDER }));
  assert.equal(
    getSessionSigningSecret({ AUTH_SECRET: 'b'.repeat(32) }),
    'b'.repeat(32)
  );
});

test('workspace member management is restricted to privileged roles', () => {
  assert.equal(canManageWorkspaceMembers('owner'), true);
  assert.equal(canManageWorkspaceMembers('admin'), true);
  assert.equal(canManageWorkspaceMembers('member'), false);
  assert.equal(canManageWorkspaceMembers(null), false);
  assert.equal(canManageWorkspaceMembers(undefined), false);
});
