import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterChip {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onClearAll?: () => void;
}

export function FilterChips({ chips, onClearAll }: FilterChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 rounded-lg">
      <span className="text-sm text-muted-foreground font-medium">
        Active filters:
      </span>
      
      <AnimatePresence mode="popLayout">
        {chips.map((chip) => (
          <motion.div
            key={chip.key}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Badge 
              variant="secondary" 
              className="gap-1.5 pl-3 pr-2 py-1.5"
            >
              <span className="text-xs font-medium">
                {chip.label}: {chip.value}
              </span>
              <button
                onClick={chip.onRemove}
                className="hover:bg-background/50 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>

      {chips.length > 1 && onClearAll && (
        <button
          onClick={onClearAll}
          className="text-xs text-primary hover:underline font-medium ml-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
