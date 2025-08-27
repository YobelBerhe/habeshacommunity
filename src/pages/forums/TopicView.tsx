import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAppState } from "@/utils/storage";
import { getTopic, getMessages, addMessage } from "@/utils/forumStore";
import type { ForumMessage } from "@/types";
import ReplyBox from "@/components/forums/ReplyBox";

export default function TopicView() {
  const { id } = useParams<{ id: string }>();
  const city = getAppState().city || "city";
  const [title, setTitle] = useState<string>("");
  const [messages, setMessages] = useState<ForumMessage[]>([]);

  // Poll localStorage lightly to simulate realtime
  useEffect(()=>{
    if (!id) return;
    const t = getTopic(city, id);
    setTitle(t?.title || "Topic");
    const sync = () => setMessages(getMessages(city, id));
    sync();
    const iv = setInterval(sync, 1500);
    return () => clearInterval(iv);
  }, [id, city]);

  const onSend = (p: { body: string; author?: string }) => {
    if (!id) return;
    addMessage(city, { topicId: id, body: p.body, author: p.author });
    setMessages(getMessages(city, id));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>

      <div className="rounded-xl border border-border/50 bg-card divide-y">
        {messages.map(m => (
          <div key={m.id} className="p-4">
            <div className="text-sm">
              <span className="font-medium">{m.author || "Anon"}</span>{" "}
              <span className="text-muted-foreground">• {new Date(m.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="p-6 text-center text-muted-foreground">No replies yet.</div>
        )}
      </div>

      <div className="mt-4">
        <ReplyBox onSend={onSend}/>
      </div>
    </div>
  );
}