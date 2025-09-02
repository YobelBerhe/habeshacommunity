import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { AccountSheet } from "@/components/nav/AccountSheet";

export default function AuthButtons() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AccountSheet open={accountOpen} onOpenChange={setAccountOpen}>
      <button className="p-2 rounded-full border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center">
        <User size={20} />
      </button>
    </AccountSheet>
  );
}