import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import { DrawerMenu } from '@/components/nav/DrawerMenu';
import { AccountSheet } from '@/components/nav/AccountSheet';
import { useAuth } from '@/store/auth';
import NotifyBell from '@/components/NotifyBell';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

export default function MobileHeader() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    };
    
    loadProfile();
  }, [user]);

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

        {/* Notifications and Account */}
        <div className="flex items-center gap-2">
          <NotifyBell />
          <AccountSheet>
            <button aria-label="Account">
              <Avatar className="w-8 h-8">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                  {user ? getUserInitial() : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
            </button>
          </AccountSheet>
        </div>
      </div>

      <DrawerMenu open={openDrawer} onOpenChange={setOpenDrawer} />
    </header>
  );
}