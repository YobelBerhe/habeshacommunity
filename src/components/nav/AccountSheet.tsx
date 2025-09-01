import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { X, Heart, Settings, LogOut, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';

export function AccountSheet({ open, onClose }:{ open:boolean; onClose:()=>void }) {
  const [email, setEmail] = useState<string|null>(null);
  const { user, refresh } = useAuth();

  useEffect(() => {
    if (!open) return;
    if (user?.email) {
      setEmail(user.email);
    }
  }, [open, user]);

  const signOut = async () => {
    await supabase.auth.signOut();
    await refresh();
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />
      <div 
        className={`absolute left-0 right-0 bottom-0 bg-background rounded-t-2xl shadow-xl transition-transform ${open ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Account</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {user && email ? (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                Signed in as {email}
              </div>
              
              <Link 
                to="/saved" 
                onClick={onClose} 
                className="flex items-center gap-3 w-full px-3 py-3 rounded-md border hover:bg-muted text-left"
              >
                <Heart className="w-4 h-4 text-red-500" />
                Saved listings
              </Link>
              
              <Link 
                to="/account" 
                onClick={onClose} 
                className="flex items-center gap-3 w-full px-3 py-3 rounded-md border hover:bg-muted text-left"
              >
                <Settings className="w-4 h-4" />
                Account settings
              </Link>
              
              <button 
                onClick={signOut} 
                className="flex items-center gap-3 w-full px-3 py-3 rounded-md border hover:bg-muted text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/auth/login" 
                onClick={onClose} 
                className="flex items-center gap-3 w-full px-3 py-3 rounded-md border hover:bg-muted text-left"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
              
              <Link 
                to="/auth/register" 
                onClick={onClose} 
                className="flex items-center gap-3 w-full px-3 py-3 rounded-md border hover:bg-muted text-left"
              >
                <UserPlus className="w-4 h-4" />
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}