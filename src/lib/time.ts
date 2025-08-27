export function timeAgo(ts: number) {
  const s = Math.floor((Date.now()-ts)/1000);
  if (s<60) return `${s}s ago`;
  const m = Math.floor(s/60); if (m<60) return `${m}m ago`;
  const h = Math.floor(m/60); if (h<24) return `${h}h ago`;
  const d = Math.floor(h/24); if (d<30) return `${d}d ago`;
  const mo = Math.floor(d/30); if (mo<12) return `${mo}mo ago`;
  const y = Math.floor(mo/12); return `${y}y ago`;
}