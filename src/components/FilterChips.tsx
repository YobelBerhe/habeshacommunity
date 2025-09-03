import { X, Image, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterChipsProps {
  hasImage: boolean;
  postedToday: boolean;
  onToggleImage: () => void;
  onToggleToday: () => void;
  onClear: () => void;
}

export default function FilterChips({ 
  hasImage, 
  postedToday, 
  onToggleImage, 
  onToggleToday, 
  onClear 
}: FilterChipsProps) {
  const hasFilters = hasImage || postedToday;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant={hasImage ? "default" : "outline"}
        size="sm"
        onClick={onToggleImage}
        className="h-8"
      >
        <Image className="w-4 h-4 mr-1" />
        Has image
      </Button>
      
      <Button
        variant={postedToday ? "default" : "outline"}
        size="sm"
        onClick={onToggleToday}
        className="h-8"
      >
        <Clock className="w-4 h-4 mr-1" />
        Posted today
      </Button>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}