import { Outlet } from 'react-router-dom';
import CommunityNav from '@/components/navigation/CommunityNav';

export default function CommunityLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Outlet />
      <CommunityNav />
    </div>
  );
}
