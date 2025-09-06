export default function AppFooter() {
  return (
    <footer className="mt-20 border-t bg-muted/50">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="font-semibold mb-3">Real Estate</div>
          <ul className="space-y-2 text-sm">
            <li><a href="/c/housing/apartments" className="hover:underline">Apartments</a></li>
            <li><a href="/c/housing/rooms" className="hover:underline">Rooms & Shares</a></li>
            <li><a href="/c/housing/sublets" className="hover:underline">Sublets</a></li>
            <li><a href="/c/housing/short" className="hover:underline">Short-term</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Jobs & Services</div>
          <ul className="space-y-2 text-sm">
            <li><a href="/c/jobs/fulltime" className="hover:underline">Full-time</a></li>
            <li><a href="/c/jobs/parttime" className="hover:underline">Part-time</a></li>
            <li><a href="/c/jobs/gigs" className="hover:underline">Gigs</a></li>
            <li><a href="/c/services" className="hover:underline">All Services</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Marketplace</div>
          <ul className="space-y-2 text-sm">
            <li><a href="/c/marketplace/furniture" className="hover:underline">Furniture</a></li>
            <li><a href="/c/marketplace/electronics" className="hover:underline">Electronics</a></li>
            <li><a href="/c/marketplace/cars" className="hover:underline">Cars</a></li>
            <li><a href="/c/marketplace/free" className="hover:underline">Free / Giveaways</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">Community</div>
          <ul className="space-y-2 text-sm">
            <li><a href="/mentors" className="hover:underline">Mentors</a></li>
            <li><a href="/forums" className="hover:underline">Forums</a></li>
            <li><a href="/match" className="hover:underline">Find Match</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-0 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} HabeshaCommunity. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a aria-label="X" href="https://x.com/HabeshaComm" className="hover:opacity-80 text-muted-foreground">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a aria-label="Instagram" href="https://instagram.com/habeshacomm/" className="hover:opacity-80 text-muted-foreground">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.005 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.197-1.526L3.03 17.685c1.331 1.556 3.287 2.547 5.502 2.547 3.95 0 7.168-3.219 7.168-7.169S12.482 5.895 8.532 5.895c-2.215 0-4.171.991-5.502 2.547l2.222 2.223c.749-.93 1.9-1.526 3.197-1.526 2.298 0 4.169 1.871 4.169 4.169s-1.871 4.168-4.169 4.168z"/>
              </svg>
            </a>
            <a aria-label="Facebook" href="https://facebook.com/Habeshacomm/" className="hover:opacity-80 text-muted-foreground">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a aria-label="YouTube" href="https://youtube.com/@HabeshaComm" className="hover:opacity-80 text-muted-foreground">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a aria-label="TikTok" href="https://tiktok.com/@habeshacommunityofficial" className="hover:opacity-80 text-muted-foreground">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}