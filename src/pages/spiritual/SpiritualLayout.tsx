import { Outlet } from 'react-router-dom';
import SpiritualNav from '@/components/navigation/SpiritualNav';
import { GlobalHeader } from '@/components/navigation/GlobalHeader';

export default function SpiritualLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalHeader showBack title="Spiritual" />
      <Outlet />
      <SpiritualNav />
    </div>
  );
}
