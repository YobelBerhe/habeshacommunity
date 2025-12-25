import { Outlet } from 'react-router-dom';
import CommunityNav from '@/components/navigation/CommunityNav';
import { GlobalHeader } from '@/components/navigation/GlobalHeader';

export default function CommunityLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <GlobalHeader showBack title="Community" />
      <Outlet />
      <CommunityNav />
    </div>
  );
}
