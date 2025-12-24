import { Outlet } from 'react-router-dom';
import MentorNav from '@/components/navigation/MentorNav';

export default function MentorLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <MentorNav />
    </div>
  );
}
