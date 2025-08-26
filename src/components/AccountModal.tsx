import { useState } from "react";

export default function AccountModal({
  open, onOpenChange
}: { open: boolean; onOpenChange: (v: boolean) => void; }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!open) return null;

  const demoSignIn = () => {
    if (!email.trim()) return;
    const u = { name: name || "Friend", email, id: crypto.randomUUID() };
    localStorage.setItem("hn.user", JSON.stringify(u));
    onOpenChange(false);
  };

  return (
    <div className="modal open">
      <div className="card max-w-xl w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Account</h3>
          <button className="btn" onClick={() => onOpenChange(false)}>✕</button>
        </div>
        <div className="grid gap-3">
          <input className="field" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="field" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="btn btn-primary" onClick={demoSignIn}>Sign in (demo)</button>
          <p className="text-xs text-muted-foreground">
            Demo account is stored locally. Connect Resend or Supabase Auth later for real magic links.
          </p>
        </div>
      </div>
    </div>
  );
}