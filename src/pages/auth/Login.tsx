import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicLinkMode, setMagicLinkMode] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    
    if (magicLinkMode) {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      });
      setLoading(false);
      if (error) return setErr(error.message);
      setMagicLinkSent(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setErr(error.message);
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-sm w-full mx-auto p-6 bg-card border rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <img 
            src="/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png" 
            alt="HabeshaCommunity" 
            className="w-12 h-12 mx-auto rounded-lg mb-2"
          />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        
        {magicLinkSent ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg">
              <p className="font-medium">Magic link sent!</p>
              <p className="text-sm mt-1">Check your email and click the link to sign in.</p>
            </div>
            <button 
              onClick={() => { setMagicLinkSent(false); setMagicLinkMode(false); }}
              className="text-primary hover:underline"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input 
                className="w-full border rounded-md p-3 bg-background" 
                type="email" 
                required
                placeholder="Enter your email" 
                value={email} 
                onChange={e=>setEmail(e.target.value)} 
              />
            </div>
            
            {!magicLinkMode && (
              <div>
                <label className="text-sm font-medium block mb-1">Password</label>
                <input 
                  className="w-full border rounded-md p-3 bg-background" 
                  type="password" 
                  required
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={e=>setPassword(e.target.value)} 
                />
              </div>
            )}
            
            {err && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded">{err}</div>}
            
            <button 
              className="w-full bg-primary text-primary-foreground rounded-md p-3 font-medium hover:bg-primary/90 transition-colors" 
              disabled={loading}
            >
              {loading ? "Signing in…" : magicLinkMode ? "Send magic link" : "Sign in"}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMagicLinkMode(!magicLinkMode)}
                className="text-sm text-primary hover:underline"
              >
                {magicLinkMode ? "Use password instead" : "Use magic link instead"}
              </button>
            </div>
          </form>
        )}
        
        {!magicLinkSent && (
          <div className="text-sm mt-6 space-y-2 text-center">
            <div className="text-muted-foreground">
              Don't have an account? <Link to="/auth/register" className="text-primary hover:underline">Create one</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}