import { Outlet } from 'react-router-dom';
import MarketplaceNav from '@/components/navigation/MarketplaceNav';
import { GlobalHeader } from '@/components/navigation/GlobalHeader';

export default function MarketplaceLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <GlobalHeader showBack title="Marketplace" />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <MarketplaceNav />
    </div>
  );
}
