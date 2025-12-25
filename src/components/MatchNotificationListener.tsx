import { useMatchNotifications } from '@/hooks/useMatchNotifications';

/**
 * Component that listens for match notifications.
 * Must be mounted inside BrowserRouter since it uses useNavigate.
 */
export function MatchNotificationListener() {
  useMatchNotifications();
  return null;
}
