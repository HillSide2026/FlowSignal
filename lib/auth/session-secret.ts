export const AUTH_SECRET_PLACEHOLDER =
  'replace-with-a-64-character-random-hex-secret';

export function isUsableAuthSecret(secret: string | undefined) {
  return Boolean(secret && secret !== AUTH_SECRET_PLACEHOLDER && secret.length >= 32);
}

type AuthSecretEnv = {
  AUTH_SECRET?: string;
};

export function getSessionSigningSecret(env?: AuthSecretEnv) {
  const secret = (env ?? { AUTH_SECRET: process.env.AUTH_SECRET }).AUTH_SECRET;
  if (!isUsableAuthSecret(secret)) {
    throw new Error('AUTH_SECRET must be set to a non-placeholder secret');
  }

  return secret;
}
