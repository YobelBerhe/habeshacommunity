import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { X, Heart, MessageCircle, Plus, ChevronDown } from 'lucide-react';
import { TAXONOMY, LABELS } from '@/lib/taxonomy';
import { useAuth } from '@/store/auth';
import { useLockBody } from '@/hooks/useLockBody';
import ThemeToggle from '@/components/ThemeToggle';

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function DrawerMenu({ open, onOpenChange }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { user, openAuth, openPost } = useAuth();
  const navigate = useNavigate();
  
  useLockBody(open);

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
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
    };
  }, [open, onOpenChange]);

  const handleDonate = () => {
    onOpenChange(false);
    // Trigger existing donate modal
    document.dispatchEvent(new CustomEvent('open-donate'));
  };

  const handlePost = () => {
    onOpenChange(false);
    if (!user) {
      openAuth();
      return;
    }
    openPost();
  };

  if (!open) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={() => onOpenChange(false)}
      />

      {/* Panel */}
      <aside
        className="fixed inset-0 z-50 bg-background shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Sticky header with safe-area */}
        <div className="sticky top-0 z-[1] bg-background/95 backdrop-blur border-b">
          <div className="pt-[env(safe-area-inset-top)] px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/b4a1d9ff-6ada-4004-84e1-e2a43ad47cc5.png" 
                alt="HabeshaCommunity" 
                className="w-6 h-6 rounded"
              />
              <h3 className="text-base font-semibold text-primary">HabeshaCommunity</h3>
            </div>
            <button
              aria-label="Close"
              onClick={() => onOpenChange(false)}
              className="p-2 rounded hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll area */}
        <div className="overflow-y-auto overscroll-contain px-2 pb-[env(safe-area-inset-bottom)]">
          {(['housing','jobs','services','community'] as const).map(section => (
            <details key={section} className="group border-b last:border-0">
              <summary className="flex items-center justify-between py-3 cursor-pointer select-none">
                <span className="font-medium capitalize">{getSectionLabel(section)}</span>
                <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
              </summary>

              <ul className="pb-2">
                {TAXONOMY[section].sub.map(sub => {
                  const key = `${section}:${sub}`;
                  const label = LABELS[sub]?.en || sub.replace(/_/g, ' ');
                  const n = counts[key] ?? 0;
                  return (
                    <li key={key}>
                      <button
                        onClick={() => {
                          onOpenChange(false);
                          navigate(`/browse?category=${section}&sub=${sub}`);
                        }}
                        className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-muted/50 text-left"
                      >
                        <span className="text-sm text-primary">{label}</span>
                        <span className="text-xs text-muted-foreground">
                          {n}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </details>
          ))}

          <div className="mt-4 grid gap-2">
            <button 
              className="btn-primary flex items-center justify-center gap-3 font-semibold"
              onClick={handlePost}
            >
              <Plus className="w-4 h-4" />
              Post
            </button>
            
            <Link 
              className="btn-secondary flex items-center gap-3" 
              to="/forums" 
              onClick={() => onOpenChange(false)}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Link>
            
            <button 
              className="btn-secondary flex items-center gap-3 text-left"
              onClick={handleDonate}
            >
              <span>💙</span>
              Support HabeshaCommunity
            </button>

            <div className="flex gap-2 mt-4">
              <button className="btn-secondary w-1/2" onClick={() => {}}>
                <span className="text-sm">EN / ትግ</span>
              </button>
              <div className="btn-secondary w-1/2 flex items-center justify-between">
                <span className="text-sm">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
}

function getSectionLabel(section: string) {
  switch(section) {
    case 'housing': return 'Housing / Rentals';
    case 'jobs': return 'Jobs (+Gigs)';
    case 'services': return 'Services';
    case 'community': return 'Community';
    default: return section;
  }
}