
'use client';

import { users } from './data';
import type { User } from './types';

const MOCK_USER_ID_COOKIE = 'mockUserId';

// In a real app, this would involve sessions, tokens, and database lookups.
export async function getAuthenticatedUser(): Promise<User | null> {
    if (typeof window === 'undefined') {
        return null;
    }
    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${MOCK_USER_ID_COOKIE}=`));
    const userId = cookie ? cookie.split('=')[1] : null;

  if (userId) {
    const user = users.find(u => u.id === userId);
    return user || null;
  }
  
  // Default to a specific superAdmin if no cookie is set for easier development
  const superAdmin = users.find(user => user.role === 'superAdmin');
  return superAdmin || null;
}
