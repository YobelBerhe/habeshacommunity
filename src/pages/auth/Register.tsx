import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import CitySearchBar from "@/components/CitySearchBar";
import { AnimatedInput } from "@/components/AnimatedInput";
import { AnimatedButton } from "@/components/AnimatedButton";

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
    
    console.log('🔐 Registration attempt:', { email, redirectTo: `${window.location.origin}/auth/callback` });
    
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { display_name: name, city },
        emailRedirectTo: "https://habeshacommunity.com/auth/callback"
      },
    });
    
    console.log('🔐 Registration result:', { authData, error });
    
    setLoading(false);
    if (error) {
      console.error('Registration error:', error);
      return setErr(error.message);
    }
    
    // Create profile entry only if user was created and not already exists
    if (authData.user && !authData.user.email_confirmed_at) {
      try {
        await supabase.from('profiles').insert({
          id: authData.user.id,
          display_name: name,
          city: city
        });
        console.log('✅ Profile created successfully');
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't show error to user as the account was still created
      }
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
            <AnimatedInput
              type="text"
              label="Display Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="text-sm font-medium block mb-2">City you live in</label>
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
            
            <AnimatedInput
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <AnimatedInput
              type="password"
              label="Password"
              placeholder="Create a password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={password.length > 0 && password.length < 6 ? "Password must be at least 6 characters" : undefined}
            />
            
            {err && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-2 rounded">{err}</div>}
            
            <AnimatedButton
              type="submit"
              isLoading={loading}
              className="w-full"
            >
              Create account
            </AnimatedButton>
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