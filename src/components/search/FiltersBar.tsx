import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { TAXONOMY, LABELS, CategoryKey } from '@/lib/taxonomy';

type Props = {
  topCategory: CategoryKey;
  selectedSubcategory?: string;
  onPickSub: (slug: string) => void;
  onClear: () => void;
};

export function FiltersBar({ topCategory, selectedSubcategory, onPickSub, onClear }: Props) {
  const [openCat, setOpenCat] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  
  const subs = TAXONOMY[topCategory].sub;
  const categoryLabel = TAXONOMY[topCategory].name.en;

  return (
    <div className="sticky top-14 z-30 bg-background/90 backdrop-blur border-b md:hidden">
      <div className="flex gap-2 p-2">
        <button 
          className="flex items-center gap-1 px-3 py-2 rounded-full bg-muted text-sm font-medium"
          onClick={() => setOpenCat(true)}
        >
          {categoryLabel}
          <ChevronDown className="w-3 h-3" />
        </button>
        
        <button 
          className="flex items-center gap-1 px-3 py-2 rounded-full bg-muted text-sm font-medium"
          onClick={() => setOpenMore(true)}
        >
          More
          <ChevronDown className="w-3 h-3" />
        </button>
        
        <button 
          className="flex items-center gap-1 px-3 py-2 rounded-full border text-sm font-medium ml-auto"
          onClick={onClear}
        >
          Clear all
        </button>
      </div>

      {/* Category sheet */}
      {openCat && (
        <BottomSheet title={categoryLabel} onClose={() => setOpenCat(false)}>
          <div className="max-h-[60vh] overflow-y-auto">
            <button
              className={`w-full text-left px-4 py-3 hover:bg-muted border-b ${!selectedSubcategory ? 'bg-muted' : ''}`}
              onClick={() => { 
                onPickSub(''); 
                setOpenCat(false); 
              }}
            >
              All {categoryLabel}
            </button>
            {subs.map(sub => {
              const label = LABELS[sub]?.en || sub.replace(/_/g, ' ');
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  className={`w-full text-left px-4 py-3 hover:bg-muted border-b last:border-b-0 ${isSelected ? 'bg-muted' : ''}`}
                  onClick={() => { 
                    onPickSub(sub); 
                    setOpenCat(false); 
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </BottomSheet>
      )}

      {/* More sheet */}
      {openMore && (
        <BottomSheet title="More filters" onClose={() => setOpenMore(false)}>
          <div className="p-4 text-sm text-muted-foreground">
            <p>Price range, location distance, and other filters will be added here.</p>
            <p className="mt-2">This integrates with your existing filter controls.</p>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

function BottomSheet({ title, onClose, children }:{
  title: string; onClose:()=>void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0 bg-background rounded-t-2xl shadow-xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}