import { useEffect, useRef, useState } from "react";
type City = { name: string; country: string; lat: string; lon: string };

export default function CitySearch({ value, onSelect }:{
  value?: string; onSelect: (c: City) => void;
}) {
  const [q, setQ] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<City[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(()=>setQ(value ?? ""),[value]);

  useEffect(()=>{
    const off=(e:MouseEvent)=>{ if(!boxRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click",off); return ()=>document.removeEventListener("click",off);
  },[]);

  useEffect(()=>{
    if(q.trim().length<2){ setItems([]); return; }
    const t=setTimeout(async()=>{
      const url=`https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&accept-language=en&q=${encodeURIComponent(q)}`;
      const res=await fetch(url); const data=await res.json();
      const list=(data as any[]).filter(x=>["city","town","village","municipality","hamlet","locality"].includes(x.type)).map(x=>{
        const a=x.address||{};
        const name=a.city||a.town||a.village||a.municipality||a.hamlet||a.locality||x.display_name.split(",")[0];
        return {name, country:a.country||"", lat:x.lat, lon:x.lon};
      });
      setItems(list); setOpen(true);
    },200); return ()=>clearTimeout(t);
  },[q]);

  return (
    <div ref={boxRef} className="relative min-w-[260px]">
      <input
        className="field w-full"
        placeholder="Type a city… (e.g., Asmara)"
        value={q}
        onChange={e=>setQ(e.target.value)}
        onFocus={()=>items.length && setOpen(true)}
        autoComplete="off"
      />
      {open && items.length>0 && (
        <div className="absolute left-0 right-0 top-[46px] z-40 max-h-72 overflow-auto bg-background border rounded-xl shadow-xl">
          {items.map((c,i)=>(
            <div key={i}
                 className="px-3 py-2 cursor-pointer hover:bg-muted/50"
                 onMouseDown={()=>{ setQ(`${c.name}, ${c.country}`); setOpen(false); onSelect(c); }}>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}