import { Link } from 'react-router-dom';
import { Heart, Settings, LogOut, LogIn, UserPlus, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { useLanguage } from '@/store/language';
import { t } from '@/lib/i18n';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function AccountSheet({ children }:{ children?: React.ReactNode }) {
  const { user, refresh } = useAuth();
  const { language } = useLanguage();

  const signOut = async () => {
    await supabase.auth.signOut();
    await refresh();
  };

  return (
    <Popover>
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
                 className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent rounded-sm"
               >
                <Heart className="w-4 h-4 text-red-500" />
                {t(language, "saved_listings")}
              </Link>

               <Link 
                 to="/account/listings" 
                 className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent rounded-sm"
               >
                <List className="w-4 h-4" />
                {t(language, "my_listings")}
              </Link>
              
               <Link 
                 to="/account/settings" 
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
                 className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-accent rounded-sm"
               >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
              
               <Link 
                 to="/auth/register" 
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