import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, MessageCircle, Settings, Languages, Moon, Sun } from 'lucide-react';
import { TAXONOMY, LABELS } from '@/lib/taxonomy';
import { useAuth } from '@/store/auth';
import ThemeToggle from '@/components/ThemeToggle';

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function DrawerMenu({ open, onOpenChange }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { openAuth } = useAuth();

  useEffect(() => {
    if (!open) return;
    // Mock counts for now - replace with actual API call
    setCounts({
      'housing:apartments': 42,
      'housing:rooms_shared': 18,
      'housing:sublets_temporary': 12,
      'jobs:accounting_finance': 25,
      'jobs:food_bev_hosp': 38,
      'services:legal': 15,
      'services:beauty': 22,
      'community:events': 31,
      'community:volunteers': 19,
    });
  }, [open]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  const handleDonate = () => {
    onOpenChange(false);
    // Trigger existing donate modal
    document.dispatchEvent(new CustomEvent('open-donate'));
  };

  if (!open) return null;

  return (
    <>
      {/* backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 z-40 bg-black/40"
      />
      {/* drawer */}
      <aside className="fixed left-0 top-0 h-full w-[85%] max-w-[380px] bg-background shadow-xl z-50">
        <div className="p-4 border-b flex items-center justify-between">
          <span className="font-semibold">Browse</span>
          <button onClick={() => onOpenChange(false)} aria-label="Close" className="p-2 hover:bg-muted rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="overflow-y-auto p-2 pb-24 h-full">
          {(['housing','jobs','services','community'] as const).map(section => (
            <Fragment key={section}>
              <p className="mt-4 mb-2 text-xs font-semibold uppercase text-muted-foreground px-3">
                {TAXONOMY[section].name.en}
              </p>
              <div className="rounded-lg border overflow-hidden">
                {TAXONOMY[section].sub.slice(0, 8).map(sub => {
                  const key = `${section}:${sub}`;
                  const label = LABELS[sub]?.en || sub.replace(/_/g, ' ');
                  const n = counts[key] ?? 0;
                  return (
                    <Link
                      key={key}
                      to={`/?category=${section}&subcategory=${sub}`}
                      onClick={() => onOpenChange(false)}
                      className="flex items-center justify-between px-3 py-3 hover:bg-muted border-b last:border-b-0"
                    >
                      <span className="text-sm">{label}</span>
                      {n > 0 && (
                        <span className="text-xs bg-muted rounded-full px-2 py-0.5 font-medium">{n}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </Fragment>
          ))}

          <div className="mt-6 space-y-2">
            <Link 
              className="flex items-center gap-3 w-full px-3 py-3 rounded-md border hover:bg-muted text-left" 
              to="/me/listings" 
              onClick={() => onOpenChange(false)}
            >
              <Settings className="w-4 h-4" />
              My listings
            </Link>
            
            <Link 
              className="flex items-center gap-3 w-full px-3 py-3 rounded-md border hover:bg-muted text-left" 
              to="/forums" 
              onClick={() => onOpenChange(false)}
            >
              <MessageCircle className="w-4 h-4" />
              Forums
            </Link>
            
            <button 
              className="flex items-center gap-3 w-full px-3 py-3 rounded-md border hover:bg-muted text-left"
              onClick={handleDonate}
            >
              <Heart className="w-4 h-4 text-red-500" />
              Support HabeshaNetwork
            </button>
          </div>

          {/* Toggles */}
          <div className="mt-8 border-t pt-4 space-y-3">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium">Theme</span>
              <ThemeToggle />
            </div>
            
            <button className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-muted">
              <span className="text-sm">Language</span>
              <span className="text-sm text-muted-foreground">EN ⇄ ትግ</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}