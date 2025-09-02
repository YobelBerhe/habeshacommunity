import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";

export default function Reset() {
  const [phase, setPhase] = useState<"request"|"update">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // When redirected back from email, exchange for a session then show "update" form
  useEffect(() => {
    (async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href);
      } catch { /* ignore */ }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setPhase("update");
    })();
  }, []);

  const sendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setMsg(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });
    setLoading(false);
    if (error) return setErr(error.message);
    setMsg("Password reset email sent. Check your inbox.");
  };

  const updatePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setMsg(null);
    setLoading(true);
    
    if (password.length < 6) {
      setLoading(false);
      return setErr("Password must be at least 6 characters");
    }
    
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setErr(error.message);
    setMsg("Password updated. Redirecting…");
    setTimeout(() => navigate("/"), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-sm w-full mx-auto p-6 bg-card border rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <img 
            src="/lovable-uploads/b4a1d9ff-6ada-4004-84e1-e2a43ad47cc5.png" 
            alt="HabeshaCommunity" 
            className="w-12 h-12 mx-auto rounded-lg mb-2"
          />
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            {phase === "request" ? "Enter your email to reset your password" : "Enter your new password"}
          </p>
        </div>

        {phase === "request" ? (
          <form onSubmit={sendLink} className="space-y-4">
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
            
            {err && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded">{err}</div>}
            {msg && <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-2 rounded">{msg}</div>}
            
            <button 
              className="w-full bg-primary text-primary-foreground rounded-md p-3 font-medium hover:bg-primary/90 transition-colors" 
              disabled={loading}
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        ) : (
          <form onSubmit={updatePwd} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">New Password</label>
              <input 
                className="w-full border rounded-md p-3 bg-background" 
                type="password" 
                required
                placeholder="Enter your new password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
              />
            </div>
            
            {err && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded">{err}</div>}
            {msg && <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-2 rounded">{msg}</div>}
            
            <button 
              className="w-full bg-primary text-primary-foreground rounded-md p-3 font-medium hover:bg-primary/90 transition-colors" 
              disabled={loading}
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
        
        <div className="text-sm mt-6 text-center text-muted-foreground">
          <Link className="text-primary hover:underline" to="/auth/login">Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}