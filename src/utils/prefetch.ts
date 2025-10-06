/**
 * Resource prefetching utilities
 */

// Prefetch route data
export function prefetchRoute(path: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  document.head.appendChild(link);
}

// Preload critical image
export function preloadImage(src: string, as: 'image' = 'image') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = src;
  document.head.appendChild(link);
}

// Preconnect to domain
export function preconnectDomain(domain: string) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

// DNS prefetch
export function dnsPrefetch(domain: string) {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
}

// Prefetch on hover
export function setupHoverPrefetch() {
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href^="/"]') as HTMLAnchorElement;
    
    if (link && !link.dataset.prefetched) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        prefetchRoute(href);
        link.dataset.prefetched = 'true';
      }
    }
  });
}

// Prefetch visible links
export function prefetchVisibleLinks() {
  const links = document.querySelectorAll('a[href^="/"]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement;
          const href = link.getAttribute('href');
          if (href && !link.dataset.prefetched) {
            prefetchRoute(href);
            link.dataset.prefetched = 'true';
            observer.unobserve(link);
          }
        }
      });
    },
    { rootMargin: '50px' }
  );

  links.forEach((link) => observer.observe(link));
}
