
'use server';

import { users } from './data';
import type { User } from './types';
import { cookies } from 'next/headers';

const MOCK_USER_ID_COOKIE = 'mockUserId';

// In a real app, this would involve sessions, tokens, and database lookups.
export async function getAuthenticatedUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(MOCK_USER_ID_COOKIE)?.value;

  if (userId) {
    const user = users.find(u => u.id === userId);
    return user || null;
  }
  
  // Default to a specific superAdmin if no cookie is set for easier development
  const superAdmin = users.find(user => user.role === 'superAdmin');
  return superAdmin || null;
}

export async function login(userId: string) {
    const cookieStore = await cookies();
    cookieStore.set(MOCK_USER_ID_COOKIE, userId, { path: '/', maxAge: 60 * 60 * 24 * 7 });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(MOCK_USER_ID_COOKIE);
}
