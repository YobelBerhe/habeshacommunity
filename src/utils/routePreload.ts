export function preloadRoute(routePath: string) {
  // Map routes to their lazy components
  const routeMap: Record<string, () => Promise<any>> = {
    '/': () => import('../pages/Index'),
    '/spiritual': () => import('../pages/spiritual/SpiritualHome'),
    '/spiritual/reader': () => import('../pages/spiritual/BibleReader'),
    '/spiritual/plans': () => import('../pages/spiritual/ReadingPlans'),
    '/spiritual/progress': () => import('../pages/spiritual/Progress'),
    '/browse': () => import('../pages/Browse'),
    '/chat': () => import('../pages/Chat'),
    '/mentor': () => import('../pages/mentor/MentorList'),
    '/mentor/dashboard': () => import('../pages/mentor/MentorDashboard'),
    '/inbox': () => import('../pages/inbox/Inbox'),
    '/notifications': () => import('../pages/Notifications'),
    '/account/settings': () => import('../pages/account/Settings'),
    '/account/saved': () => import('../pages/account/Saved'),
    '/match': () => import('../pages/match/MatchHome'),
    '/forums': () => import('../pages/forums/Boards'),
  };

  const loader = routeMap[routePath];
  if (loader) {
    loader();
  }
}
