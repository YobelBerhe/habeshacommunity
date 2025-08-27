import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

export default function AccountModal({
  open, onOpenChange
}: { open: boolean; onOpenChange: (v: boolean) => void; }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const demoSignIn = () => {
    if (!email.trim()) return;
    const u = { name: name || "Friend", email, id: crypto.randomUUID() };
    localStorage.setItem("hn.user", JSON.stringify(u));
    onOpenChange(false);
  };

  const handleCreateAccount = () => {
    if (!email.trim() || !name.trim()) return;
    const u = { name, email, id: crypto.randomUUID() };
    localStorage.setItem("hn.user", JSON.stringify(u));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {isLogin ? "Log in" : "Create an account"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {isLogin ? (
            // Login Section
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email / Handle</Label>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <button className="text-sm text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => alert("Email login link feature coming soon!")}
                  className="flex-1"
                >
                  E-mail a login link
                </Button>
                <Button onClick={demoSignIn} className="flex-1">
                  Log in
                </Button>
              </div>
            </div>
          ) : (
            // Create Account Section
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleCreateAccount}
                  className="w-full"
                  disabled={!email.trim() || !name.trim()}
                >
                  Create account
                </Button>
                
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>By creating an account, you agree to our:</p>
                  <div className="flex flex-wrap gap-1">
                    <button className="text-primary hover:underline">Terms of Service</button>
                    <span>•</span>
                    <button className="text-primary hover:underline">Privacy Policy</button>
                    <span>•</span>
                    <button className="text-primary hover:underline">Community Guidelines</button>
                  </div>
                </div>
                
                <button className="text-sm text-primary hover:underline">
                  Account help
                </button>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <div className="flex items-center gap-4 mb-4">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">or</span>
              <Separator className="flex-1" />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full"
            >
              {isLogin ? "Create new account" : "Already have an account? Log in"}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Demo mode: Accounts are stored locally</p>
            <p>Connect Supabase or other auth providers for production use</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}