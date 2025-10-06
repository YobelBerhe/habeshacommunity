export function preloadRoute(routePath: string) {
  // Map routes to their lazy components
  const routeMap: Record<string, () => Promise<any>> = {
    '/': () => import('../pages/Index'),
    '/browse': () => import('../pages/Browse'),
    '/chat': () => import('../pages/Chat'),
    '/mentor': () => import('../pages/mentor/MentorList'),
    '/mentor/dashboard': () => import('../pages/mentor/MentorDashboard'),
    '/inbox': () => import('../pages/inbox/Inbox'),
    '/notifications': () => import('../pages/Notifications'),
    '/account/settings': () => import('../pages/account/Settings'),
    '/account/saved': () => import('../pages/account/Saved'),
    '/match': () => import('../pages/match/MatchDiscover'),
    '/forums': () => import('../pages/forums/Boards'),
  };

  const loader = routeMap[routePath];
  if (loader) {
    loader();
  }
}
