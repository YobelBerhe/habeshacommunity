import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import { DrawerMenu } from '@/components/nav/DrawerMenu';
import { AccountSheet } from '@/components/nav/AccountSheet';
import { useAuth } from '@/store/auth';

export default function MobileHeader() {
  const [openDrawer, setOpenDrawer] = useState(false);
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
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" title="Go to Homepage">
          <img 
            src="/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png" 
            alt="HabeshaCommunity" 
            className="w-6 h-6 rounded"
          />
          <span className="font-semibold tracking-tight text-sm hover:text-primary transition-colors">HabeshaCommunity</span>
        </Link>

        {/* Account dropdown */}
        <AccountSheet>
          <button
            aria-label="Account"
            className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold text-sm"
          >
            {user ? getUserInitial() : <User className="w-4 h-4" />}
          </button>
        </AccountSheet>
      </div>

      <DrawerMenu open={openDrawer} onOpenChange={setOpenDrawer} />
    </header>
  );
}