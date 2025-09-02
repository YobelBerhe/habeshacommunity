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

        <div className="space-y-2 flex flex-col items-center">
          {user && email ? (
            <button 
              onClick={signOut} 
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted text-sm text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          ) : (
            <>
              <Link 
                to="/auth/login" 
                onClick={() => onOpenChange(false)} 
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted text-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
              
              <Link 
                to="/auth/register" 
                onClick={() => onOpenChange(false)} 
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted text-sm"
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