import type { User } from '@/lib/db/schema';

export type SafeUser = Pick<User, 'id' | 'name' | 'email'>;

export function toSafeUser(user: User | null | undefined): SafeUser | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}
