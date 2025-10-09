import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface Filters {
  ageRange: [number, number];
  location: string;
  faith: string;
  education: string;
  distance: number;
  verified?: boolean;
  hasPhotos?: boolean;
}

interface FilterPanelProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  onApply?: () => void;
  onReset?: () => void;
}

export function FilterPanel({ filters, setFilters, onApply, onReset }: FilterPanelProps) {
  const handleReset = () => {
    setFilters({
      ageRange: [22, 35],
      location: 'all',
      faith: 'all',
      education: 'all',
      distance: 50,
      verified: false,
      hasPhotos: false
    });
    onReset?.();
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Age Range */}
      <div>
        <Label className="mb-3 block">
          Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
        </Label>
        <Slider
          min={18}
          max={50}
          step={1}
          value={filters.ageRange}
          onValueChange={(value) => setFilters({ ...filters, ageRange: value as [number, number] })}
          className="w-full"
        />
      </div>

      {/* Distance */}
      <div>
        <Label className="mb-3 block">
          Maximum Distance: {filters.distance} miles
        </Label>
        <Slider
          min={5}
          max={100}
          step={5}
          value={[filters.distance]}
          onValueChange={(value) => setFilters({ ...filters, distance: value[0] })}
          className="w-full"
        />
      </div>

      {/* Education Level */}
      <div>
        <Label htmlFor="education" className="mb-2 block">Education Level</Label>
        <Select value={filters.education} onValueChange={(value) => setFilters({ ...filters, education: value })}>
          <SelectTrigger id="education">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Education</SelectItem>
            <SelectItem value="bachelors">Bachelors Degree</SelectItem>
            <SelectItem value="masters">Masters Degree</SelectItem>
            <SelectItem value="doctorate">Doctorate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Religion */}
      <div>
        <Label htmlFor="religion" className="mb-2 block">Religion</Label>
        <Select value={filters.faith} onValueChange={(value) => setFilters({ ...filters, faith: value })}>
          <SelectTrigger id="religion">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Religion</SelectItem>
            <SelectItem value="orthodox">Orthodox</SelectItem>
            <SelectItem value="catholic">Catholic</SelectItem>
            <SelectItem value="protestant">Protestant</SelectItem>
            <SelectItem value="muslim">Muslim</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Verified Only */}
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div>
          <Label htmlFor="verified" className="font-semibold">Verified Only</Label>
          <p className="text-xs text-muted-foreground">Show only verified profiles</p>
        </div>
        <Switch
          id="verified"
          checked={filters.verified || false}
          onCheckedChange={(checked) => setFilters({ ...filters, verified: checked })}
        />
      </div>

      {/* Has Photos */}
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div>
          <Label htmlFor="hasPhotos" className="font-semibold">Has Photos</Label>
          <p className="text-xs text-muted-foreground">Show profiles with 3+ photos</p>
        </div>
        <Switch
          id="hasPhotos"
          checked={filters.hasPhotos || false}
          onCheckedChange={(checked) => setFilters({ ...filters, hasPhotos: checked })}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={handleReset} className="flex-1">
          Reset
        </Button>
        <Button onClick={onApply} className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
