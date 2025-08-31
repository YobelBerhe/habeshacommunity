import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAppState } from "@/utils/storage";
import { getTopics, createTopic, addMessage } from "@/utils/forumStore";
import type { ForumTopic, ForumBoardKey } from "@/types";
import { listBoards } from "@/utils/forumStore";
import NewTopicModal from "@/components/forums/NewTopicModal";

export default function BoardTopics() {
  const { boardKey } = useParams<{ boardKey: ForumBoardKey }>();
  const board = boardKey;
  const navigate = useNavigate();
  const city = getAppState().city || "Select a city";
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    if (!board) return;
    setTopics(getTopics(city, board));
  }, [board, city]);

  if (!board) return null;
  const boardMeta = listBoards().find(b=>b.key===board);

  const create = (p: { title: string; body: string; author?: string }) => {
    const t = createTopic(city, { board, title: p.title, author: p.author, city });
    // first message as body
    addMessage(city, { topicId: t.id, author: p.author, body: p.body });
    setTopics(getTopics(city, board));
    navigate(`/forums/topic/${t.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">{boardMeta?.name.en ?? board} — {city}</h1>
        <button className="rounded-md border px-3 py-2" onClick={()=>setOpen(true)}>New topic</button>
      </div>

      {topics.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-gradient-card p-6 text-center">
          <p className="mb-3">No topics yet. Be the first to start one!</p>
          <button className="rounded-md bg-primary text-primary-foreground px-4 py-2" onClick={()=>setOpen(true)}>Start a topic</button>
        </div>
      ) : (
        <ul className="divide-y rounded-xl border border-border/50 bg-card">
          {topics.map(t => (
            <li key={t.id} className="p-4 hover:bg-muted/40 flex items-center justify-between">
              <button className="text-left" onClick={()=>navigate(`/forums/topic/${t.id}`)}>
                <div className="font-semibold">{t.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t.replies} replies • {timeAgo(t.updatedAt)}
                </div>
              </button>
              <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      )}

      <NewTopicModal open={open} onClose={()=>setOpen(false)} onCreate={create}/>
    </div>
  );
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now()-ts)/1000);
  if (s<60) return `${s}s ago`;
  const m = Math.floor(s/60); if (m<60) return `${m}m ago`;
  const h = Math.floor(m/60); if (h<24) return `${h}h ago`;
  const d = Math.floor(h/24); return `${d}d ago`;
}