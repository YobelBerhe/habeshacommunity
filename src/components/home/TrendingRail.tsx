import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

type Item = {
  id: string;
  title: string;
  img: string;
  href: string;
  meta?: string; // e.g., "$2,300 • 2br • Oakland"
};

export default function TrendingRail({
  title,
  subtitle,
  fetchItems,
  variant,
}:{
  title: string;
  subtitle?: string;
  fetchItems: ()=>Promise<Item[]>;
  variant: 'community'|'marketplace'|'housing'|'jobs';
}) {
  const [items, setItems] = useState<Item[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    fetchItems().then(setItems).catch(()=> setItems([]));
  },[fetchItems]);

  const scroll = (dir: 'left'|'right')=>{
    const el = scrollerRef.current;
    if (!el) return;
    const delta = dir==='left' ? -el.clientWidth : el.clientWidth;
    el.scrollBy({ left: delta, behavior:'smooth' });
  };

  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="hidden md:flex gap-2">
          <button aria-label="Scroll left" onClick={()=>scroll('left')} className="p-2 rounded-full border hover:bg-muted">
            <ChevronLeft />
          </button>
          <button aria-label="Scroll right" onClick={()=>scroll('right')} className="p-2 rounded-full border hover:bg-muted">
            <ChevronRight />
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-2">
        {items.map((it)=>(
          <a key={it.id} href={it.href} className="snap-start shrink-0 w-[320px] bg-background rounded-2xl border shadow hover:shadow-md transition">
            <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
              <img src={it.img} alt="" className="h-full w-full object-cover" />
              <button
                aria-label="Save"
                className="absolute top-2 right-2 bg-background/90 rounded-full p-1 hover:bg-background"
                onClick={(e)=>{ e.preventDefault(); /* wire to favorites */ }}
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3">
              <div className="font-semibold line-clamp-2">{it.title}</div>
              {it.meta && <div className="text-sm text-muted-foreground mt-1">{it.meta}</div>}
            </div>
          </a>
        ))}
        {items.length===0 && (
          <div className="text-sm text-muted-foreground">No trending items yet.</div>
        )}
      </div>
    </section>
  );
}