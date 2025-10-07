import { supabase } from '@/integrations/supabase/client';

// Password strength validation
export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check for common passwords
  const commonPasswords = ['password', '12345678', 'qwerty', 'admin', 'letmein'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Session validation
export async function validateSession(): Promise<boolean> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return false;
    }

    // Check if session is expired
    const expiresAt = new Date(session.expires_at || 0);
    if (expiresAt < new Date()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

// Logout everywhere (revoke all sessions)
export async function logoutEverywhere() {
  try {
    // Sign out
    await supabase.auth.signOut({ scope: 'global' });
    
    // Clear local storage
    localStorage.clear();
    sessionStorage.clear();
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}
