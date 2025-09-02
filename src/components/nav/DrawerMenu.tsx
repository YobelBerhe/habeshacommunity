import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { X, Heart, MessageCircle, Plus, ChevronDown, Edit3, Bookmark } from 'lucide-react';
import { TAXONOMY, LABELS } from '@/lib/taxonomy';
import { useAuth } from '@/store/auth';
import { useLockBody } from '@/hooks/useLockBody';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import { supabase } from '@/integrations/supabase/client';

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function DrawerMenu({ open, onOpenChange }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [myListingsOpen, setMyListingsOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const { user, openAuth, openPost } = useAuth();
  const navigate = useNavigate();
  
  useLockBody(open);

  useEffect(() => {
    if (!open) return;
    
    // Fetch real counts from Supabase
    const fetchCounts = async () => {
      try {
        const { data, error } = await supabase.rpc('get_listing_counts');
        if (error) {
          console.error('Error fetching counts:', error);
          return;
        }
        
        const countsMap: Record<string, number> = {};
        data?.forEach((item: any) => {
          if (item.subcategory) {
            // Find which category this subcategory belongs to
            for (const [category, categoryData] of Object.entries(TAXONOMY)) {
              if (categoryData.sub.includes(item.subcategory)) {
                countsMap[`${category}:${item.subcategory}`] = item.total;
                break;
              }
            }
          }
        });
        setCounts(countsMap);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    
    fetchCounts();
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
    // Open donation URL from environment variable
    const donateUrl = import.meta.env.VITE_DONATE_URL || 'https://stripe.com';
    window.open(donateUrl, '_blank');
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
            <Link to="/" className="flex items-center gap-2" onClick={() => onOpenChange(false)}>
              <img 
                src="/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png" 
                alt="HabeshaCommunity" 
                className="w-6 h-6 rounded"
              />
              <h3 className="text-base font-semibold text-primary">HabeshaCommunity</h3>
            </Link>
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

            {/* My Listings Toggle */}
            <details className="group border rounded">
              <summary className="flex items-center justify-between p-3 cursor-pointer select-none hover:bg-muted/50">
                <span className="font-medium">My Listings</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-3 pb-2 space-y-1">
                <Link 
                  to="/account/saved" 
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 text-sm"
                >
                  <Heart className="w-4 h-4 text-red-500" />
                  ❤️ Saved Listings
                </Link>
                <Link 
                  to="/account/listings" 
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  ✏️ Edit My Listings
                </Link>
              </div>
            </details>
            
            <Link 
              className="btn-secondary flex items-center gap-3" 
              to="/chat" 
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
            💙 Support HabeshaCommunity
            </button>

            <div className="flex gap-2 mt-4">
              <div className="btn-secondary w-1/2 flex items-center justify-center">
                <LanguageToggle value={language} onChange={setLanguage} />
              </div>
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