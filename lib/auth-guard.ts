import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Ensures the current user is authenticated and has the ADMIN role.
 * Throws an Error if unauthorized.
 * Use this at the very beginning of secure Server Actions and API routes.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }

  return session;
}
