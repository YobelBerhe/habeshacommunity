import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Settings } from "lucide-react";

interface MatchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  minScore: number;
  ageRange: [number, number];
  location: string;
  interest: string;
}

export default function MatchFilters({ onFilterChange, className }: MatchFiltersProps) {
  const [minScore, setMinScore] = useState(50);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);
  const [location, setLocation] = useState("");
  const [interest, setInterest] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  function applyFilters() {
    onFilterChange({
      minScore,
      ageRange,
      location,
      interest
    });
    setMobileOpen(false);
  }

  function clearFilters() {
    setMinScore(50);
    setAgeRange([18, 60]);
    setLocation("");
    setInterest("");
    onFilterChange({
      minScore: 50,
      ageRange: [18, 60],
      location: "",
      interest: ""
    });
    setMobileOpen(false);
  }

  const FilterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-4">Filters</h3>
      </div>

      {/* Match Score */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Min Match Score</Label>
        <Slider
          value={[minScore]}
          onValueChange={(vals) => setMinScore(vals[0])}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">≥ {minScore}%</p>
      </div>

      {/* Age Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Age Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="18"
            max="100"
            value={ageRange[0]}
            onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
            className="w-20"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            min="18"
            max="100"
            value={ageRange[1]}
            onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
            className="w-20"
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Location</Label>
        <Input
          type="text"
          placeholder="City or Country"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {/* Interest */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Interest</Label>
        <Input
          type="text"
          placeholder="e.g., Cooking, Tech"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <Button
          onClick={applyFilters}
          className="flex-1"
        >
          Apply
        </Button>
        <Button
          onClick={clearFilters}
          variant="outline"
          className="flex-1"
        >
          Clear
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:block w-64 ${className}`}>
        <div className="sticky top-20 p-4 bg-card border rounded-lg">
          {FilterContent}
        </div>
      </div>

      {/* Mobile Sheet */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full mb-4">
              <Settings className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[90vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto h-[calc(90vh-80px)] pb-6">
              {FilterContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
