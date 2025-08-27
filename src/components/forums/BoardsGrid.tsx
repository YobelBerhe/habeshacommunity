import { listBoards } from "@/utils/forumStore";
import type { ForumBoard } from "@/types";

type Props = {
  lang?: "en" | "ti";
  onOpenBoard: (key: ForumBoard["key"]) => void;
};

export default function BoardsGrid({ lang = "en", onOpenBoard }: Props) {
  const boards = listBoards();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {boards.map(b => (
        <button
          key={b.key}
          onClick={() => onOpenBoard(b.key)}
          className="text-left rounded-xl border border-border/50 bg-gradient-card p-4 hover:bg-muted transition"
        >
          <div className="font-semibold text-lg">{b.name[lang] ?? b.name.en}</div>
          {b.description && (
            <div className="text-sm text-muted-foreground mt-1">
              {b.description[lang] ?? b.description.en}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}