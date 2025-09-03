import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortKey = "relevance" | "newest" | "oldest" | "price_asc" | "price_desc" | "upcoming";

interface SortDropdownProps {
  sortKey: SortKey;
  onChange: (sort: SortKey) => void;
}

export default function SortDropdown({ sortKey, onChange }: SortDropdownProps) {
  const sortOptions = [
    { key: "relevance" as const, label: "Relevance" },
    { key: "newest" as const, label: "Newest" },
    { key: "oldest" as const, label: "Oldest" },
    { key: "price_asc" as const, label: "$ → $$$" },
    { key: "price_desc" as const, label: "$$$ → $" },
    { key: "upcoming" as const, label: "Upcoming" },
  ];

  const currentLabel = sortOptions.find(opt => opt.key === sortKey)?.label || "Sort";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 px-3">
          <span className="text-sm">{currentLabel}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {sortOptions.map(({ key, label }) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onChange(key)}
            className={sortKey === key ? "bg-accent" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}