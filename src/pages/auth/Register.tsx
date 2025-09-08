import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import CitySearchBar from "@/components/CitySearchBar";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    
    if (password.length < 6) {
      setLoading(false);
      return setErr("Password must be at least 6 characters");
    }
    
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { display_name: name, city },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      },
    });
    
    setLoading(false);
    if (error) return setErr(error.message);
    
    // Create profile entry
    if (authData.user) {
      await supabase.from('profiles').insert({
        id: authData.user.id,
        display_name: name,
        city: city
      });
    }
    
    setDone(true);
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
          <h1 className="text-2xl font-bold">Join HabeshaCommunity</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>
        
        {done ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg">
              <p className="font-medium">Account created!</p>
              <p className="text-sm mt-1">Check your email to confirm your account, then sign in.</p>
            </div>
            <Link 
              to="/auth/login" 
              className="block w-full bg-primary text-primary-foreground rounded-md p-3 font-medium text-center hover:bg-primary/90 transition-colors"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Display Name</label>
              <input 
                className="w-full border rounded-md p-3 bg-background" 
                placeholder="Your name"
                value={name} 
                onChange={e=>setName(e.target.value)} 
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">City you live in</label>
              <CitySearchBar 
                value={city}
                onCitySelect={(cityName) => setCity(cityName)}
                placeholder="e.g. Asmara, Oakland, Frankfurt"
                className="[&_input]:w-full [&_input]:border [&_input]:rounded-md [&_input]:p-3 [&_input]:bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will appear on our live activity map
              </p>
            </div>
            
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
                placeholder="Create a password (min 6 characters)" 
                value={password}
                onChange={e=>setPassword(e.target.value)} 
              />
            </div>
            
            {err && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded">{err}</div>}
            
            <button 
              className="w-full bg-primary text-primary-foreground rounded-md p-3 font-medium hover:bg-primary/90 transition-colors" 
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}
        
        {!done && (
          <div className="text-sm mt-6 text-center text-muted-foreground">
            Already have an account? <Link className="text-primary hover:underline" to="/auth/login">Sign in</Link>
          </div>
        )}
      </div>
    </div>
  );
}