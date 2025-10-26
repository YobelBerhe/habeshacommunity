import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { AnimatedInput } from "@/components/AnimatedInput";
import { AnimatedButton } from "@/components/AnimatedButton";
import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone' | 'magic'>('email');
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
    
    try {
      if (loginMode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({ 
          email,
          options: { 
            emailRedirectTo: `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}` 
          }
        });
        
        if (error) throw error;
        
        setMagicLinkSent(true);
        toast.success('Magic link sent!', { description: 'Check your email inbox' });
      } else if (loginMode === 'phone') {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            channel: 'sms'
          }
        });
        
        if (error) throw error;
        
        toast.success('OTP sent!', { description: 'Check your phone for the code' });
        navigate(`/auth/verify-phone?phone=${encodeURIComponent(phone)}&returnTo=${encodeURIComponent(returnTo)}`);
      } else {
        // Email + Password
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        toast.success('Welcome back!');
        navigate(returnTo);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErr(error.message);
      toast.error('Sign in failed', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // OAuth Sign In
  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
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
      toast.error(`Failed to sign in with ${provider}`, { 
        description: error.message 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-md w-full mx-auto p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">H</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>
        
        {magicLinkSent ? (
          <div className="text-center space-y-4">
            <div className="p-6 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-2xl border border-green-200 dark:border-green-800">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <p className="font-semibold text-lg mb-2">Magic Link Sent!</p>
              <p className="text-sm">Check your email and click the link to sign in securely.</p>
            </div>
            <button 
              onClick={() => { 
                setMagicLinkSent(false); 
                setLoginMode('email'); 
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              ← Back to sign in
            </button>
          </div>
        ) : (
          <>
            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => handleOAuthSignIn('facebook')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Login Mode Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setLoginMode('email')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                  loginMode === 'email'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMode('phone')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-all ${
                  loginMode === 'phone'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </button>
            </div>

            {/* Email/Password/Phone Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              {loginMode === 'phone' ? (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    We'll send you a one-time code via SMS
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all outline-none"
                    />
                  </div>
                  
                  {loginMode === 'email' && (
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {err && (
                <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-3.5 rounded-xl border border-red-200 dark:border-red-800">
                  {err}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
              
              <div className="flex items-center justify-between text-sm">
                {loginMode === 'email' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setLoginMode('magic')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Use magic link
                    </button>
                    
                    <Link
                      to={`/auth/reset${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </>
                )}
                
                {loginMode === 'magic' && (
                  <button
                    type="button"
                    onClick={() => setLoginMode('email')}
                    className="text-blue-600 hover:underline font-medium mx-auto"
                  >
                    Use password instead
                  </button>
                )}
              </div>
            </form>
          </>
        )}
        
        {!magicLinkSent && (
          <div className="text-sm mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link 
                to={`/auth/register${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`} 
                className="text-blue-600 hover:underline font-semibold"
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
