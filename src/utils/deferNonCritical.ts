export function deferNonCriticalResources() {
  const loadCSS = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

  if (document.readyState === 'complete') {
    loadNonCritical();
  } else {
    window.addEventListener('load', loadNonCritical);
  }
}

function loadNonCritical() {
  console.log('[Performance] Loading non-critical resources');
}
