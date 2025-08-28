import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmail } from "@/repo/auth";
import { toast } from "sonner";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await signInWithEmail(email.trim());
      toast("Check your email for the login link!");
      onOpenChange(false);
      setEmail("");
    } catch (error) {
      console.error("Login error:", error);
      toast("Failed to send login email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-muted/20 border-none shadow-lg p-0">
        <div className="bg-background rounded-lg overflow-hidden">
          {/* Log in Section */}
          <div className="bg-muted/30 p-6 border-b">
            <h2 className="text-lg font-medium text-center text-foreground mb-4">
              Log in
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm text-foreground">
                  Email / Handle
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-background border-input"
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  type="button"
                  variant="outline"
                  className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground"
                  onClick={() => {}}
                >
                  E-mail a login link
                </Button>
                <Button 
                  type="submit" 
                  variant="outline"
                  className="px-8 bg-muted hover:bg-muted/80 text-muted-foreground"
                  disabled={loading || !email.trim()}
                >
                  {loading ? "Sending..." : "Log in"}
                </Button>
              </div>
            </form>
          </div>

          {/* Divider */}
          <div className="px-6 py-3 text-center">
            <span className="text-sm text-muted-foreground italic">or</span>
          </div>

          {/* Create Account Section */}
          <div className="bg-muted/30 p-6">
            <h2 className="text-lg font-medium text-center text-foreground mb-4">
              Create an account
            </h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="signup-email" className="text-sm text-foreground">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  className="bg-background border-input"
                />
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <Button 
                  type="button"
                  variant="link"
                  className="text-primary hover:underline p-0 h-auto text-sm"
                >
                  Account help
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  className="px-6 bg-muted hover:bg-muted/80 text-muted-foreground"
                >
                  Create account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}