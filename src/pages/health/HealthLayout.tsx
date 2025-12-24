import { Outlet } from 'react-router-dom';
import HealthNav from '@/components/navigation/HealthNav';

export default function HealthLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <HealthNav />
    </div>
  );
}
