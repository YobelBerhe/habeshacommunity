import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthState = {
  user: User | null;
  loading: boolean;
  // UI flags
  authOpen: boolean;
  postOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  openPost: () => void;
  closePost: () => void;
  // actions
  init: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  authOpen: false,
  postOpen: false,
  openAuth: () => set({ authOpen: true }),
  closeAuth: () => set({ authOpen: false }),
  openPost: () => set({ postOpen: true }),
  closePost: () => set({ postOpen: false }),

  init: async () => {
    const { data } = await supabase.auth.getSession();
    set({ user: data.session?.user ?? null, loading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      const u = (session as Session | null)?.user ?? null;
      set({ user: u, loading: false, authOpen: false });
      // Optional: auto-open Post after successful sign-in
      if (u && get().postOpen === false) set({ postOpen: true });
    });
  },

  refresh: async () => {
    const { data } = await supabase.auth.getSession();
    set({ user: data.session?.user ?? null });
  },
}));