import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TAXONOMY, LABELS, CategoryKey } from '@/lib/taxonomy';
import { useLanguage } from '@/store/language';

type Props = {
  topCategory: CategoryKey;
  selectedSubcategory?: string;
  onPickSub: (slug: string) => void;
  onClear: () => void;
};

export function FiltersBar({ topCategory, selectedSubcategory, onPickSub, onClear }: Props) {
  const navigate = useNavigate();
  const [openCat, setOpenCat] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const { language } = useLanguage();
  const langKey = language.toLowerCase() as 'en' | 'ti';
  
  const subs = TAXONOMY[topCategory].sub;
  const categoryLabel = TAXONOMY[topCategory].name[langKey];

  return (
    <div className="sticky top-14 z-[45] bg-background/90 backdrop-blur border-b md:hidden">
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
          onClick={() => {
            if (topCategory === 'mentor') {
              navigate('/mentor/onboarding');
            } else if (topCategory === 'match') {
              setOpenMore(true);
            } else {
              setOpenMore(true);
            }
          }}
        >
          {topCategory === 'mentor' ? 'Become a Mentor' : 
           topCategory === 'match' ? 'Complete Profile & Find Matches' : 'More'}
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
              className={`w-full text-left px-4 py-3 hover:bg-accent border-b ${!selectedSubcategory ? 'bg-accent' : ''}`}
              onClick={() => { 
                onPickSub(''); 
                setOpenCat(false); 
              }}
            >
              All {categoryLabel}
            </button>
            {subs.map(sub => {
              const label = LABELS[sub]?.[langKey] || sub.replace(/_/g, ' ');
              const isSelected = selectedSubcategory === sub;
              return (
                <button
                  key={sub}
                  className={`w-full text-left px-4 py-3 hover:bg-accent border-b last:border-b-0 ${isSelected ? 'bg-accent' : ''}`}
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
      {openMore && topCategory === 'match' && (
        <BottomSheet title="Complete Profile & Find Matches" onClose={() => setOpenMore(false)}>
          <div className="p-4 space-y-4">
            <button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-3 rounded-lg font-medium"
              onClick={() => {
                navigate('/match/onboarding');
                setOpenMore(false);
              }}
            >
              Complete Your Profile
            </button>
            <button 
              className="w-full border border-border hover:bg-accent px-4 py-3 rounded-lg font-medium"
              onClick={() => {
                navigate('/match');
                setOpenMore(false);
              }}
            >
              Find Matches
            </button>
          </div>
        </BottomSheet>
      )}
      
      {/* Default More sheet for other categories */}
      {openMore && topCategory !== 'match' && topCategory !== 'mentor' && (
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