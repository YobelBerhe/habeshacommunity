import { CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MentorFiltersProps {
  verifiedOnly: boolean;
  minRating: string;
  sortBy: string;
  onVerifiedOnlyChange: (value: boolean) => void;
  onMinRatingChange: (value: string) => void;
  onSortByChange: (value: string) => void;
}

export default function MentorFilters({
  verifiedOnly,
  minRating,
  sortBy,
  onVerifiedOnlyChange,
  onMinRatingChange,
  onSortByChange,
}: MentorFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto flex-nowrap scrollbar-hide -mx-4 px-4 touch-pan-x snap-x snap-mandatory">
      {/* Verified Only Toggle */}
      <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-md border border-border hover:bg-accent transition-colors shrink-0">
        <input 
          type="checkbox" 
          checked={verifiedOnly} 
          onChange={(e) => onVerifiedOnlyChange(e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
        />
        <CheckCircle2 className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Verified Only</span>
      </label>

      {/* Minimum Rating Filter */}
      <Select value={minRating} onValueChange={onMinRatingChange}>
        <SelectTrigger className="w-[140px] bg-background shrink-0">
          <SelectValue placeholder="Min Rating" />
        </SelectTrigger>
        <SelectContent className="bg-background z-50">
          <SelectItem value="0">All Ratings</SelectItem>
          <SelectItem value="4">⭐ 4.0+</SelectItem>
          <SelectItem value="4.5">⭐ 4.5+</SelectItem>
          <SelectItem value="5">⭐ 5.0 only</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort By Filter */}
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-[160px] bg-background shrink-0">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent className="bg-background z-50">
          <SelectItem value="verified">Verified First</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
          <SelectItem value="newest">Newest Mentors</SelectItem>
          <SelectItem value="price_low">Lowest Price</SelectItem>
          <SelectItem value="price_high">Highest Price</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
