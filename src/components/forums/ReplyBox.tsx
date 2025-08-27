import { useState } from "react";

type Props = {
  onSend: (payload: { body: string; author?: string }) => void;
};

export default function ReplyBox({ onSend }: Props) {
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");

  return (
    <div className="rounded-xl border border-border/50 bg-gradient-card p-4">
      <textarea
        className="w-full border rounded-md px-3 py-2 min-h-[100px] mb-3"
        placeholder="Write a reply…"
        value={body}
        onChange={(e)=>setBody(e.target.value)}
      />
      <div className="flex gap-3">
        <input className="border rounded-md px-3 py-2 flex-1" placeholder="Name (optional)"
          value={author} onChange={(e)=>setAuthor(e.target.value)} />
        <button
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold disabled:opacity-60"
          disabled={!body.trim()}
          onClick={()=>{ onSend({ body: body.trim(), author: author || undefined }); setBody(""); }}
        >
          Reply
        </button>
      </div>
    </div>
  );
}