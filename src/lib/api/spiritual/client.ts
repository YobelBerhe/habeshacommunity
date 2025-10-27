/**
 * Spiritual Section API Client Helper
 * Uses the existing Supabase client from the project
 */

import { supabase } from "@/integrations/supabase/client";

// Re-export the supabase client
export { supabase };

// Helper to get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

// Helper to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

// Export types
export type SupabaseClient = typeof supabase;
