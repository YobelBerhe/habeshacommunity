import { Grid3X3, List, Map, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewMode = "list" | "grid" | "gallery" | "map";
export type SortKey = "relevance" | "newest" | "oldest" | "price_asc" | "price_desc" | "upcoming";

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  const views = [
    { mode: "list" as const, icon: List, label: "List" },
    { mode: "grid" as const, icon: Grid3X3, label: "Grid" },
    { mode: "gallery" as const, icon: Image, label: "Gallery" },
    { mode: "map" as const, icon: Map, label: "Map" },
  ];

  return (
    <div className="flex items-center gap-1 border rounded-lg p-1">
      {views.map(({ mode, icon: Icon, label }) => (
        <Button
          key={mode}
          variant={viewMode === mode ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(mode)}
          className="h-8 px-2"
          aria-label={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}
    </div>
  );
}