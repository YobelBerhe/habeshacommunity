import { Outlet } from 'react-router-dom';
import HealthNav from '@/components/navigation/HealthNav';
import { GlobalHeader } from '@/components/navigation/GlobalHeader';

export default function HealthLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalHeader showBack title="Health" />
      <Outlet />
      <HealthNav />
    </div>
  );
}
