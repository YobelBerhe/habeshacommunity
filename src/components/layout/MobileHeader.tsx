import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import { DrawerMenu } from '@/components/nav/DrawerMenu';
import { AccountSheet } from '@/components/nav/AccountSheet';
import { useAuth } from '@/store/auth';

export default function MobileHeader() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const { user } = useAuth();

  const getUserInitial = () => {
    if (!user?.email) return 'A';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-background/70 backdrop-blur border-b md:hidden">
      <div className="flex items-center justify-between h-14 px-3">
        {/* Hamburger */}
        <button
          aria-label="Menu"
          onClick={() => setOpenDrawer(true)}
          className="p-2 rounded-md hover:bg-muted"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center logo + name */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/b4a1d9ff-6ada-4004-84e1-e2a43ad47cc5.png" 
            alt="HabeshaCommunity" 
            className="w-6 h-6 rounded"
          />
          <span className="font-semibold tracking-tight text-sm">HabeshaCommunity</span>
        </Link>

        {/* Account bubble */}
        <button
          onClick={() => setOpenAccount(true)}
          aria-label="Account"
          className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-sm"
        >
          {user ? getUserInitial() : <User className="w-4 h-4" />}
        </button>
      </div>

      <DrawerMenu open={openDrawer} onOpenChange={setOpenDrawer} />
      <AccountSheet open={openAccount} onOpenChange={setOpenAccount} />
    </header>
  );
}