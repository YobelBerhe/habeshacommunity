import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { X, Heart, Settings, LogOut, LogIn, UserPlus, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';

export function AccountSheet({ open, onOpenChange }:{ open:boolean; onOpenChange:(v:boolean)=>void }) {
  const [email, setEmail] = useState<string|null>(null);
  const { user, refresh } = useAuth();

  useEffect(() => {
    if (!open) return;
    if (user?.email) {
      setEmail(user.email);
    }
  }, [open, user]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  const signOut = async () => {
    await supabase.auth.signOut();
    await refresh();
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/40" 
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed left-0 right-0 bottom-0 z-50 bg-background rounded-t-2xl shadow-xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Account</h3>
          <button onClick={() => onOpenChange(false)} className="p-2 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 flex flex-col items-center">
          {user && email ? (
            <>
              <div className="text-sm text-muted-foreground mb-4 text-center">
                Signed in as {email}
              </div>
              
              <Link 
                to="/account/saved" 
                onClick={() => onOpenChange(false)} 
                className="flex items-center gap-3 w-1/2 min-w-[200px] px-3 py-3 rounded-md border hover:bg-muted text-left"
              >
                <Heart className="w-4 h-4 text-red-500" />
                Saved listings
              </Link>

              <Link 
                to="/account/listings" 
                onClick={() => onOpenChange(false)} 
                className="flex items-center gap-3 w-1/2 min-w-[200px] px-3 py-3 rounded-md border hover:bg-muted text-left"
              >
                <List className="w-4 h-4" />
                My listings
              </Link>
              
              <Link 
                to="/account/settings" 
                onClick={() => onOpenChange(false)} 
                className="flex items-center gap-3 w-1/2 min-w-[200px] px-3 py-3 rounded-md border hover:bg-muted text-left"
              >
                <Settings className="w-4 h-4" />
                Account settings
              </Link>
              
              <button 
                onClick={signOut} 
                className="flex items-center gap-3 w-1/2 min-w-[200px] px-3 py-3 rounded-md border hover:bg-muted text-left text-red-600 hover:text-red-700 mt-4"
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
                className="flex items-center gap-3 w-1/2 min-w-[200px] px-3 py-3 rounded-md border hover:bg-muted text-left"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
              
              <Link 
                to="/auth/register" 
                onClick={() => onOpenChange(false)} 
                className="flex items-center gap-3 w-1/2 min-w-[200px] px-3 py-3 rounded-md border hover:bg-muted text-left"
              >
                <UserPlus className="w-4 h-4" />
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}