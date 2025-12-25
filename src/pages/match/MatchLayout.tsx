import { Outlet } from 'react-router-dom';
import MatchNav from '@/components/navigation/MatchNav';
import { GlobalHeader } from '@/components/navigation/GlobalHeader';

export default function MatchLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <GlobalHeader showBack title="Match" />
      <Outlet />
      <MatchNav />
    </div>
  );
}
