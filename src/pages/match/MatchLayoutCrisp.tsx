import { Outlet, useLocation } from 'react-router-dom';
import MatchNavCrisp from '@/components/navigation/MatchNavCrisp';

export default function MatchLayoutCrisp() {
  const location = useLocation();
  
  // Hide bottom nav on onboarding and quiz screens
  const hideNav = ['/match/onboarding', '/match/quiz'].some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
      {!hideNav && <MatchNavCrisp />}
    </div>
  );
}
