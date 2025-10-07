import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SlidersHorizontal, Save, X } from 'lucide-react';

interface FilterPanelProps {
  children: React.ReactNode;
  onApply: () => void;
  onReset: () => void;
  onSavePreset?: (name: string) => void;
  hasActiveFilters: boolean;
}

export function FilterPanel({
  children,
  onApply,
  onReset,
  onSavePreset,
  hasActiveFilters,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showSavePreset, setShowSavePreset] = useState(false);

  const handleSavePreset = () => {
    if (presetName.trim() && onSavePreset) {
      onSavePreset(presetName);
      setPresetName('');
      setShowSavePreset(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Options</SheetTitle>
          <SheetDescription>
            Customize your search with advanced filters
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {children}
        </div>

        <div className="space-y-3 pt-4 border-t">
          {showSavePreset ? (
            <div className="space-y-2">
              <Label>Preset Name</Label>
              <div className="flex gap-2">
                <Input
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="My filter preset"
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                />
                <Button size="icon" onClick={handleSavePreset}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  onClick={() => setShowSavePreset(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : onSavePreset && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowSavePreset(true)}
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Preset
            </Button>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onReset();
                setIsOpen(false);
              }}
              disabled={!hasActiveFilters}
            >
              Reset
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onApply();
                setIsOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
