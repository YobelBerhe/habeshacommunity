import { rateLimiter, rateLimits } from './rateLimiter';
import { validateSession } from './authSecurity';
import { toast } from 'sonner';

export async function secureAction(
  action: () => Promise<any>,
  options: {
    requireAuth?: boolean;
    rateLimitKey?: string;
    rateLimitConfig?: { maxRequests: number; windowMs: number };
  } = {}
): Promise<any> {
  const { requireAuth = true, rateLimitKey, rateLimitConfig } = options;

  try {
    // Check authentication
    if (requireAuth) {
      const isValid = await validateSession();
      if (!isValid) {
        toast.error('Please sign in to continue');
        window.location.href = '/auth/login';
        return;
      }
    }

    // Check rate limit
    if (rateLimitKey && rateLimitConfig) {
      const allowed = rateLimiter.isAllowed(rateLimitKey, rateLimitConfig);
      if (!allowed) {
        toast.error('Too many requests. Please try again later.');
        return;
      }
    }

    // Execute action
    return await action();
  } catch (error) {
    console.error('Secure action failed:', error);
    throw error;
  }
}
