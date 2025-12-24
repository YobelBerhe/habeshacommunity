import { Outlet } from 'react-router-dom';
import MatchNav from '@/components/navigation/MatchNav';

export default function MatchLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <MatchNav />
    </div>
  );
}
