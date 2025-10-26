import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { AnimatedInput } from "@/components/AnimatedInput";
import { AnimatedButton } from "@/components/AnimatedButton";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [magicLinkMode, setMagicLinkMode] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    
    if (magicLinkMode) {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: { 
          emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}` 
        }
      });
      setLoading(false);
      if (error) {
        setErr(error.message);
        toast.error('Failed to send magic link', { description: error.message });
        return;
      }
      setMagicLinkSent(true);
      toast.success('Magic link sent!', { description: 'Check your email inbox' });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setErr(error.message);
        toast.error('Sign in failed', { description: error.message });
        return;
      }
      toast.success('Welcome back!');
      navigate(returnTo);
    }
  };

  // OAuth Sign In
  const handleOAuthSignIn = async (provider: 'google' | 'github' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('OAuth error:', error);
      toast.error(`Failed to sign in with ${provider}`, { description: error.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-md w-full mx-auto p-8 bg-card border rounded-2xl shadow-xl">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img 
              src="/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png" 
              alt="HabeshaCommunity" 
              className="w-12 h-12 rounded-lg"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        
        {magicLinkSent ? (
          <div className="text-center space-y-4">
            <div className="p-6 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-xl border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-lg">Magic Link Sent!</p>
              <p className="text-sm mt-2">Check your email and click the link to sign in securely.</p>
            </div>
            <button 
              onClick={() => { setMagicLinkSent(false); setMagicLinkMode(false); }}
              className="text-primary hover:underline font-medium"
            >
              ← Back to sign in
            </button>
          </div>
        ) : (
          <>
            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn('github')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <AnimatedInput
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              {!magicLinkMode && (
                <div className="relative">
                  <AnimatedInput
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}
              
              {err && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  {err}
                </div>
              )}
              
              <AnimatedButton
                type="submit"
                isLoading={loading}
                className="w-full"
              >
                {magicLinkMode ? "Send Magic Link" : "Sign In"}
              </AnimatedButton>
              
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setMagicLinkMode(!magicLinkMode)}
                  className="text-primary hover:underline"
                >
                  {magicLinkMode ? "Use password" : "Use magic link"}
                </button>
                
                {!magicLinkMode && (
                  <Link
                    to={`/auth/reset${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
            </form>
          </>
        )}
        
        {!magicLinkSent && (
          <div className="text-sm mt-8 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                to={`/auth/register${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} 
                className="text-primary hover:underline font-semibold"
              >
                Create one
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
