import { Outlet } from 'react-router-dom';
import SpiritualNav from '@/components/navigation/SpiritualNav';

export default function SpiritualLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <SpiritualNav />
    </div>
  );
}
