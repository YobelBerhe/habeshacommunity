import { usePresence } from '@/hooks/usePresence';
import { useAuth } from '@/store/auth';

// Mounts a global presence tracker so the user appears online app-wide
export function PresenceTracker() {
  const { user } = useAuth();
  usePresence('global', user?.id || '');
  return null;
}
