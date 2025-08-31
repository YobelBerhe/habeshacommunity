import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    navigate("/"); // back home
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-sm w-full mx-auto p-6 bg-card border rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <img 
            src="/lovable-uploads/b4a1d9ff-6ada-4004-84e1-e2a43ad47cc5.png" 
            alt="HabeshaNetwork" 
            className="w-12 h-12 mx-auto rounded-lg mb-2"
          />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>
        
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
          
          {err && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded">{err}</div>}
          
          <button 
            className="w-full bg-primary text-primary-foreground rounded-md p-3 font-medium hover:bg-primary/90 transition-colors" 
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        
        <div className="text-sm mt-6 space-y-2 text-center">
          <Link to="/auth/reset" className="text-primary hover:underline block">Forgot your password?</Link>
          <div className="text-muted-foreground">
            Don't have an account? <Link to="/auth/register" className="text-primary hover:underline">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}