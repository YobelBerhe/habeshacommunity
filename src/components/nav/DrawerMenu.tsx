import { Fragment, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { X, Heart, MessageCircle, Plus, ChevronDown, Edit3, Bookmark, Users, Target, ShoppingBag, MessageSquare, Inbox, Home, Briefcase, Wrench, Users2, BarChart3 } from 'lucide-react';
import { TAXONOMY, LABELS } from '@/lib/taxonomy';
import { useAuth } from '@/store/auth';
import { useLockBody } from '@/hooks/useLockBody';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import DonateButton from '@/components/DonateButton';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/store/language';
import { t } from '@/lib/i18n';

type Props = { open: boolean; onOpenChange: (v: boolean) => void };

export function DrawerMenu({ open, onOpenChange }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [myListingsOpen, setMyListingsOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { user, openAuth, openPost } = useAuth();
  const navigate = useNavigate();
  
  useLockBody(open);

  useEffect(() => {
    if (!open) return;
    
    // Check admin status
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();
      
      setIsAdmin(!!data);
    };
    
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
    
    checkAdmin();
    fetchCounts();
  }, [open, user]);

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
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={() => onOpenChange(false)} title="Go to Homepage">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <h3 className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors">HabeshaCommunity</h3>
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
          {/* Community first */}
          <details className="group border-b">
            <summary className="flex items-center justify-between py-4 cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <Users2 className="w-5 h-5 text-primary" />
                <span className="font-medium">{TAXONOMY.community.name[language.toLowerCase() as 'en' | 'ti']}</span>
              </div>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>

            <ul className="pb-2">
              {TAXONOMY.community.sub.map(sub => {
                const key = `community:${sub}`;
                const label = LABELS[sub]?.[language.toLowerCase() as 'en' | 'ti'] || LABELS[sub]?.en || sub.replace(/_/g, ' ');
                const n = counts[key] ?? 0;
                return (
                  <li key={key}>
                    <button
                      onClick={() => {
                        onOpenChange(false);
                        navigate(`/browse?category=community&sub=${sub}`);
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

          {/* Find a Mentor - Toggleable */}
          <details className="group border-b">
            <summary className="flex items-center justify-between py-4 cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">Find a Mentor</span>
              </div>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <ul className="pb-2">
              <li>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/browse?category=mentor');
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-muted/50 text-left"
                >
                  <span className="text-sm text-primary">Browse All Mentors</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/mentor/onboarding');
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-muted/50 text-left"
                >
                  <span className="text-sm text-primary">Become a Mentor</span>
                </button>
              </li>
            </ul>
          </details>

          {/* Matchmaking - Toggleable */}
          <details className="group border-b">
            <summary className="flex items-center justify-between py-4 cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-medium">Matchmaking</span>
              </div>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <ul className="pb-2">
              <li>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/browse?category=match');
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-muted/50 text-left"
                >
                  <span className="text-sm text-primary">Browse Matches</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/match/onboarding');
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-muted/50 text-left"
                >
                  <span className="text-sm text-primary">Complete Profile</span>
                </button>
              </li>
            </ul>
          </details>

          {/* Marketplace - Toggleable */}
          <details className="group border-b">
            <summary className="flex items-center justify-between py-4 cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span className="font-medium">Marketplace</span>
              </div>
              <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
            </summary>
            <ul className="pb-2">
              <li>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/browse?category=forsale&sub=electronics');
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-muted/50 text-left"
                >
                  <span className="text-sm text-primary">Electronics</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/browse?category=forsale&sub=furniture');
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-muted/50 text-left"
                >
                  <span className="text-sm text-primary">Furniture</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/browse?category=forsale&sub=vehicles');
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-muted/50 text-left"
                >
                  <span className="text-sm text-primary">Vehicles</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    navigate('/browse?category=forsale&sub=books');
                  }}
                  className="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-muted/50 text-left"
                >
                  <span className="text-sm text-primary">Books</span>
                </button>
              </li>
            </ul>
          </details>

          {/* Other categories with icons */}
          {(['housing','jobs','services'] as const).map(section => (
            <details key={section} className="group border-b">
              <summary className="flex items-center justify-between py-4 cursor-pointer select-none">
                <div className="flex items-center gap-3">
                  {section === 'housing' && <Home className="w-5 h-5 text-primary" />}
                  {section === 'jobs' && <Briefcase className="w-5 h-5 text-primary" />}
                  {section === 'services' && <Wrench className="w-5 h-5 text-primary" />}
                  <span className="font-medium">{TAXONOMY[section].name[language.toLowerCase() as 'en' | 'ti']}</span>
                </div>
                <ChevronDown className="w-5 h-5 text-primary group-open:rotate-180 transition-transform" />
              </summary>

              <ul className="pb-2">
                {TAXONOMY[section].sub.map(sub => {
                  const key = `${section}:${sub}`;
                  const label = LABELS[sub]?.[language.toLowerCase() as 'en' | 'ti'] || LABELS[sub]?.en || sub.replace(/_/g, ' ');
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
                <span className="font-medium">{t(language, "my_listings")}</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-3 pb-2 space-y-1">
                <Link 
                  to="/account/saved" 
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 text-sm"
                >
                  <Heart className="w-4 h-4 text-red-500" />
                  ❤️ {t(language, "saved_listings")}
                </Link>
                <Link 
                  to="/account/listings" 
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  ✏️ {t(language, "edit_my_listings")}
                </Link>
              </div>
            </details>
            
            <Link 
              className="btn-secondary flex items-center gap-3" 
              to="/chat" 
              onClick={() => onOpenChange(false)}
            >
              <MessageCircle className="w-4 h-4" />
              {t(language, "chat")}
            </Link>

            <Link 
              className="btn-secondary flex items-center gap-3" 
              to="/inbox" 
              onClick={() => onOpenChange(false)}
            >
              <Inbox className="w-4 h-4" />
              Inbox
            </Link>

            {isAdmin && (
              <Link 
                className="btn-secondary flex items-center gap-3 bg-primary/10 hover:bg-primary/20" 
                to="/admin/metrics" 
                onClick={() => onOpenChange(false)}
              >
                <BarChart3 className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            
            <DonateButton />

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