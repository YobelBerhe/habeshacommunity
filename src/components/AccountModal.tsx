import { useState } from "react";

export default function AccountModal({
  open, onOpenChange
}: { open: boolean; onOpenChange: (v: boolean) => void; }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-background border rounded-xl max-w-xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Account</h3>
          <button className="btn" onClick={() => onOpenChange(false)}>✕</button>
        </div>
        <div className="space-y-3">
          <input className="field w-full" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
          <input className="field w-full" placeholder="Email (for magic link)" value={email} onChange={e=>setEmail(e.target.value)} />
          <button
            className="btn btn-primary w-full"
            onClick={() => {
              if (!email.trim()) return alert("Enter email");
              const u = { name: name || "Friend", email };
              localStorage.setItem("hn.user", JSON.stringify(u));
              onOpenChange(false);
              alert("Magic link simulated. Account saved locally.");
            }}
          >Create account</button>
        </div>
      </div>
    </div>
  );
}