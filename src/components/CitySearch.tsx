import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
type City = { name: string; country: string; lat: string; lon: string };

export default function CitySearch({ value, onSelect }:{
  value?: string; onSelect: (c: City) => void;
}) {
  const [q, setQ] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<City[]>([]);
  const [locked, setLocked] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(()=>setQ(value ?? ""),[value]);

  useEffect(()=>{
    const off=(e:MouseEvent)=>{ if(!boxRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click",off); return ()=>document.removeEventListener("click",off);
  },[]);

  useEffect(()=>{
    if(q.trim().length<2 || locked){ 
      setItems([]); 
      setOpen(false); 
      return; 
    }
    
    const t=setTimeout(async()=>{
      try {
        const url=`https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&accept-language=en&q=${encodeURIComponent(q)}`;
        const res=await fetch(url, { headers: { "Accept": "application/json" }});
        const data=await res.json();
        const list=(data as any[]).map(x=>{
          const a=x.address||{};
          const name=a.city||a.town||a.village||a.municipality||a.state_district||a.state||x.display_name.split(",")[0];
          const country=a.country||"";
          return {name, country, lat:x.lat, lon:x.lon};
        }).filter(Boolean);
        setItems(list); 
        if(list.length > 0 && !locked) setOpen(true);
      } catch (error) {
        // Allow manual city entry as fallback
        setItems([{name: q, country: "Manual Entry", lat: "0", lon: "0"}]);
        if (!locked) setOpen(true);
      }
    },200); return ()=>clearTimeout(t);
  },[q, locked]);

  return (
    <div ref={boxRef} className="relative">
      <input
        className="field w-full"
        placeholder="Type a city… (e.g., Asmara, Oakland, Frankfurt)"
        value={q}
        onChange={e=>{ const v=e.target.value; setQ(v); if(locked && v !== selectedValue) setLocked(false); }}
        onFocus={()=>items.length > 0 && q.trim().length >= 2 && !locked && setOpen(true)}
        autoComplete="off"
      />
      {open && items.length>0 && !locked && (
        <div className="absolute left-0 right-0 top-[46px] z-[9999] max-h-72 overflow-auto bg-white border rounded-xl shadow-2xl">
          {items.map((c,i)=>(
            <div key={i}
                 className="px-3 py-2 cursor-pointer hover:bg-slate-50"
             onMouseDown={()=>{ 
               setLocked(true);
               const sel = `${c.name}, ${c.country}`;
               setSelectedValue(sel);
               setQ(sel); 
               setItems([]);
               setOpen(false); 
               onSelect(c);
               navigate('/browse');
             }}>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-slate-500">{c.country}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}