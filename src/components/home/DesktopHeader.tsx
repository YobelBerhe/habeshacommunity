import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Menu = {
  label: string;
  children: { label: string; href: string }[];
};

const MENUS: Menu[] = [
  {
    label: 'Housing / Rentals',
    children: [
      { label: 'Apartments', href: '/c/housing/apartments' },
      { label: 'Rooms & Shares', href: '/c/housing/rooms' },
      { label: 'Sublets', href: '/c/housing/sublets' },
      { label: 'Short-term', href: '/c/housing/short' },
    ],
  },
  {
    label: 'Jobs',
    children: [
      { label: 'Full-time', href: '/c/jobs/fulltime' },
      { label: 'Part-time', href: '/c/jobs/parttime' },
      { label: 'Gigs', href: '/c/jobs/gigs' },
      { label: 'Caregiver / IHSS', href: '/c/jobs/caregiver' },
    ],
  },
  {
    label: 'Services',
    children: [
      { label: 'Moving', href: '/c/services/moving' },
      { label: 'Tutoring', href: '/c/services/tutoring' },
      { label: 'Photography', href: '/c/services/photography' },
      { label: 'Events', href: '/c/services/events' },
    ],
  },
  {
    label: 'Marketplace',
    children: [
      { label: 'Furniture', href: '/c/marketplace/furniture' },
      { label: 'Electronics', href: '/c/marketplace/electronics' },
      { label: 'Cars', href: '/c/marketplace/cars' },
      { label: 'Free / Giveaways', href: '/c/marketplace/free' },
    ],
  },
  {
    label: 'Mentors',
    children: [
      { label: 'Language', href: '/mentors/language' },
      { label: 'Health', href: '/mentors/health' },
      { label: 'Career', href: '/mentors/career' },
    ],
  },
  {
    label: 'Match',
    children: [
      { label: 'Find Match', href: '/match' },
      { label: 'My Answers', href: '/match/answers' },
    ],
  },
  {
    label: 'Forums',
    children: [
      { label: 'By City', href: '/forums' },
      { label: 'General', href: '/forums/board/general' },
      { label: 'Rentals Q&A', href: '/forums/board/rentals' },
      { label: 'Jobs & Visas', href: '/forums/board/jobs' },
    ],
  },
];

export default function DesktopHeader() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-4 md:px-6 lg:px-0">
        <a href="/" className="flex items-center gap-2 font-semibold text-xl">
          <span className="rounded-xl bg-primary text-primary-foreground px-2 py-1">H</span>
          HabeshaCommunity
        </a>

        <nav className="hidden lg:flex gap-6">
          {MENUS.map((m, i) => (
            <div
              key={m.label}
              className="relative"
              onMouseEnter={() => setOpen(i)}
              onMouseLeave={() => setOpen((cur) => (cur === i ? null : cur))}
            >
              <button className="inline-flex items-center gap-1 hover:text-foreground/80">
                {m.label}
                <ChevronDown size={16} />
              </button>
              {open === i && (
                <div className="absolute left-0 mt-2 bg-background border shadow-xl rounded-xl p-4 w-[420px] grid grid-cols-2 gap-2">
                  {m.children.map((c) => (
                    <a key={c.href} href={c.href} className="px-2 py-2 rounded hover:bg-muted">
                      {c.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href="/post" className="hidden md:inline-flex bg-primary text-primary-foreground px-3 py-2 rounded-lg">Post</a>
          <a href="/auth/login" className="text-sm underline">Sign in</a>
        </div>
      </div>
    </header>
  );
}