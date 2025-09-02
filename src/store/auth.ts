import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Listing } from '@/types';

type AuthState = {
  user: User | null;
  loading: boolean;
  // UI flags
  authOpen: boolean;
  postOpen: boolean;
  editingListing: Listing | null;
  openAuth: () => void;
  closeAuth: () => void;
  openPost: () => void;
  openEditPost: (listing: Listing) => void;
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
  editingListing: null,
  openAuth: () => set({ authOpen: true }),
  closeAuth: () => set({ authOpen: false }),
  openPost: () => set({ postOpen: true, editingListing: null }),
  openEditPost: (listing: Listing) => set({ postOpen: true, editingListing: listing }),
  closePost: () => set({ postOpen: false, editingListing: null }),

  init: async () => {
    console.log('🔄 Auth init starting...');
    
    // First, check for session in URL (magic link redirect)
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('📋 Initial session:', sessionData.session);
    console.log('👤 Initial user:', sessionData.session?.user);
    
    // Set initial state
    set({ user: sessionData.session?.user ?? null, loading: false });

    // Set up auth state listener for future changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state change:', event, session);
      const u = (session as Session | null)?.user ?? null;
      console.log('👤 User after auth change:', u);
      set({ user: u, loading: false, authOpen: false });
    });
  },

  refresh: async () => {
    const { data } = await supabase.auth.getSession();
    set({ user: data.session?.user ?? null });
  },
}));