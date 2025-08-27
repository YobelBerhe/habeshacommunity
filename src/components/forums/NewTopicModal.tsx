import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: { title: string; body: string; author?: string }) => void;
};

export default function NewTopicModal({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center md:justify-center">
      <div className="bg-background w-full md:w-[560px] rounded-t-2xl md:rounded-xl shadow-xl p-4 md:p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Start a topic</h3>
          <button className="border rounded-md px-2 py-1" onClick={onClose}>✕</button>
        </div>
        <input className="w-full border rounded-md px-3 py-2 mb-3" placeholder="Title"
          value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea className="w-full border rounded-md px-3 py-2 min-h-[140px] mb-3" placeholder="Body"
          value={body} onChange={(e)=>setBody(e.target.value)} />
        <input className="w-full border rounded-md px-3 py-2 mb-4" placeholder="Name (optional)"
          value={author} onChange={(e)=>setAuthor(e.target.value)} />
        <button
          className="w-full bg-primary text-primary-foreground rounded-md py-2 font-semibold disabled:opacity-60"
          disabled={!title || !body}
          onClick={()=>{ onCreate({ title, body, author: author || undefined }); onClose(); }}
        >Create</button>
      </div>
    </div>
  );
}