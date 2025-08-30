import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AuthButtons() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (userEmail) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{userEmail}</span>
        <button
          onClick={async () => { await supabase.auth.signOut(); }}
          className="px-3 py-1 rounded border hover:bg-muted transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <a href="/auth/login" className="px-3 py-1 rounded border hover:bg-muted transition-colors">Log in</a>
      <a href="/auth/register" className="px-3 py-1 rounded border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">Create account</a>
    </div>
  );
}