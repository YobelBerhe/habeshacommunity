import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';

export default function AuthModal() {
  const { authOpen, closeAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  
  if (!authOpen) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) setErr(error.message);
    else setSent(true);
  };

  const handleClose = () => {
    closeAuth();
    setSent(false);
    setEmail('');
    setErr(null);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sign in to post</h2>
          <button 
            onClick={handleClose} 
            className="px-2 py-1 rounded hover:bg-muted transition-colors"
          >
            ✕
          </button>
        </div>

        {!sent ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary text-primary-foreground py-2 font-medium hover:bg-primary/90 transition-colors"
            >
              Send magic link
            </button>
            <p className="text-xs text-muted-foreground">We'll email you a secure sign-in link.</p>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Check your inbox for a sign-in link. After clicking it, you'll be redirected here automatically.
            </p>
            <button 
              onClick={handleClose} 
              className="rounded-lg border border-border px-3 py-2 hover:bg-muted transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}