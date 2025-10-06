import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutocompleteProps<T> {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (item: T) => void;
  suggestions: T[];
  isLoading?: boolean;
  placeholder?: string;
  displayValue: (item: T) => string;
  renderItem?: (item: T) => React.ReactNode;
}

export function Autocomplete<T>({
  value,
  onChange,
  onSelect,
  suggestions,
  isLoading,
  placeholder = 'Search...',
  displayValue,
  renderItem,
}: AutocompleteProps<T>) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOpen(suggestions.length > 0 && value.length > 0);
  }, [suggestions, value]);

  const handleSelect = (item: T) => {
    onChange(displayValue(item));
    onSelect?.(item);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-10"
            aria-label={placeholder}
            aria-autocomplete="list"
            aria-controls="autocomplete-list"
            aria-expanded={open}
          />
          {value && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="p-0 w-[--radix-popover-trigger-width]" 
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList id="autocomplete-list" role="listbox">
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : suggestions.length === 0 ? (
              <CommandEmpty>No results found</CommandEmpty>
            ) : (
              <CommandGroup>
                <AnimatePresence>
                  {suggestions.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CommandItem
                        onSelect={() => handleSelect(item)}
                        role="option"
                      >
                        {renderItem ? renderItem(item) : displayValue(item)}
                      </CommandItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
