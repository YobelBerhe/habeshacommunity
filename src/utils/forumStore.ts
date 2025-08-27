import type { ForumBoard, ForumBoardKey, ForumTopic, ForumMessage } from "@/types";

const ROOT = "hn.forum";

// --- Boards (static, but per-city we keep separate topics/messages) ---
export const DEFAULT_BOARDS: ForumBoard[] = [
  { key: "general", name: { en: "General", ti: "መደበኛ" }, description: { en: "Open chat for your city.", ti: "ክልተ ነገር ዝሓልፈ ውይይት." } },
  { key: "housing_tips", name: { en: "Housing & Tips", ti: "መኖር ቦታ & ምክር" } },
  { key: "jobs_career", name: { en: "Jobs & Career", ti: "ስራሕ & መንገዲ ስራሕ" } },
  { key: "immigration_legal", name: { en: "Immigration / Legal", ti: "መምጻእ / ሕጋዊ" } },
  { key: "community_events", name: { en: "Community Events", ti: "ክስተታት ማሕበራዊ" } },
  { key: "buy_sell_swap", name: { en: "Buy / Sell / Swap", ti: "ሽያጭ / ግዛእ / ለውጢ" } },
  { key: "health_wellness", name: { en: "Health & Wellness", ti: "ጥዕና & ሰላምታ" } },
  { key: "faith_bible", name: { en: "Faith & Bible", ti: "ሃይማኖት & መጽሓፍ ቅዱስ" } },
  { key: "tech_learn", name: { en: "Tech & Learn", ti: "ቴክኖሎጂ & ትምህርቲ" } },
];

// --- Helpers ---
type ForumState = {
  topics: ForumTopic[];
  messages: ForumMessage[];
};

function cityKey(city: string) {
  return city.trim().toLowerCase();
}

function load(city: string): ForumState {
  try {
    const raw = localStorage.getItem(`${ROOT}.${cityKey(city)}`);
    return raw ? JSON.parse(raw) : { topics: [], messages: [] };
  } catch {
    return { topics: [], messages: [] };
  }
}

function save(city: string, data: ForumState) {
  try {
    localStorage.setItem(`${ROOT}.${cityKey(city)}`, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn("forum save failed", e);
    return false;
  }
}

// --- Public API ---
export function listBoards(): ForumBoard[] {
  return DEFAULT_BOARDS;
}

export function getTopics(city: string, board: ForumBoardKey): ForumTopic[] {
  const s = load(city);
  return s.topics.filter(t => t.board === board).sort((a,b)=>b.updatedAt - a.updatedAt);
}

export function createTopic(city: string, topic: Omit<ForumTopic,"id"|"createdAt"|"updatedAt"|"replies">): ForumTopic {
  const s = load(city);
  const t: ForumTopic = {
    ...topic,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    replies: 0,
    city: cityKey(city),
  };
  s.topics.unshift(t);
  save(city, s);
  return t;
}

export function getTopic(city: string, id: string): ForumTopic | undefined {
  const s = load(city);
  return s.topics.find(t => t.id === id);
}

export function getMessages(city: string, topicId: string): ForumMessage[] {
  const s = load(city);
  return s.messages.filter(m => m.topicId === topicId).sort((a,b)=>a.createdAt - b.createdAt);
}

export function addMessage(city: string, msg: Omit<ForumMessage,"id"|"createdAt">): ForumMessage {
  const s = load(city);
  const full: ForumMessage = { ...msg, id: crypto.randomUUID(), createdAt: Date.now() };
  s.messages.push(full);
  // bump topic updated/replies
  const t = s.topics.find(t => t.id === msg.topicId);
  if (t) { t.updatedAt = full.createdAt; t.replies += 1; }
  save(city, s);
  return full;
}
