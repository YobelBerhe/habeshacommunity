import { Link } from 'react-router-dom';
import { Heart, Settings, LogOut, LogIn, UserPlus, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function AccountSheet({ open, onOpenChange, children }:{ open:boolean; onOpenChange:(v:boolean)=>void; children?: React.ReactNode }) {
  const { user, refresh } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut();
    await refresh();
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        side="bottom" 
        align="end" 
        sideOffset={8}
        className="w-56 p-1"
      >
        <div className="space-y-1">
          {user ? (
            <>
              <Link 
                to="/account/saved" 
                onClick={() => onOpenChange(false)} 
                className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent rounded-sm"
              >
                <Heart className="w-4 h-4 text-red-500" />
                Saved Listings
              </Link>

              <Link 
                to="/account/listings" 
                onClick={() => onOpenChange(false)} 
                className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent rounded-sm"
              >
                <List className="w-4 h-4" />
                My Listings
              </Link>
              
              <Link 
                to="/account/settings" 
                onClick={() => onOpenChange(false)} 
                className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent rounded-sm"
              >
                <Settings className="w-4 h-4" />
                Account Settings
              </Link>
              
              <button 
                onClick={signOut} 
                className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent rounded-sm text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/auth/login" 
                onClick={() => onOpenChange(false)} 
                className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent rounded-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
              
              <Link 
                to="/auth/register" 
                onClick={() => onOpenChange(false)} 
                className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent rounded-sm"
              >
                <UserPlus className="w-4 h-4" />
                Create account
              </Link>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}