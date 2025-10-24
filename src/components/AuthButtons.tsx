import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { AccountSheet } from "@/components/nav/AccountSheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDisplayName } from "@/utils/displayName";

export default function AuthButtons() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadUser();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    if (data.user) {
      loadProfile(data.user.id);
    }
  };

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data);
  };

  return (
    <AccountSheet>
      <button className="rounded-full hover:opacity-80 transition-opacity">
        {profile?.avatar_url ? (
          <Avatar className="w-10 h-10">
            <AvatarImage src={profile.avatar_url} alt={getDisplayName(user)} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user ? getDisplayName(user).charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 h-10 rounded-full border bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center">
            {user ? (
              <span className="font-semibold">{getDisplayName(user).charAt(0).toUpperCase()}</span>
            ) : (
              <User size={20} />
            )}
          </div>
        )}
      </button>
    </AccountSheet>
  );
}