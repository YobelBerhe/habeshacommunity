import { Outlet, useLocation } from 'react-router-dom';
import HealthNavCrisp from '@/components/navigation/HealthNavCrisp';
import { GlobalHeader } from '@/components/navigation/GlobalHeader';

export default function HealthLayoutCrisp() {
  const location = useLocation();
  const isHomePage = location.pathname === '/health';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Only show header on sub-pages, not on health home */}
      {!isHomePage && <GlobalHeader showBack title="Health" />}
      <Outlet />
      <HealthNavCrisp />
    </div>
  );
}
