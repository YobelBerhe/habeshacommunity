import { useEffect, useRef, useState } from "react";
const RENT_HINTS = ["rent room","rent studio","rent 1BR","rent 2BR","furnished","house for rent","sublet"];
const JOB_HINTS  = ["driver","barista","mechanic","caregiver","cashier","IT support","photographer"];

export default function SearchWithHints({
  value, onChange, category
}:{ value: string; onChange:(v:string)=>void; category?: string; }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=>{ const off=(e:MouseEvent)=>{ if(!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click",off); return ()=>document.removeEventListener("click",off); },[]);

  function onInput(v:string){
    onChange(v);
    const base = category==="housing" ? RENT_HINTS : category==="jobs" ? JOB_HINTS : [];
    const q=v.toLowerCase(); const list=base.filter(x=>x.startsWith(q)).slice(0,6);
    setItems(list); setOpen(list.length>0);
  }

  function handleSelect(s:string){
    onChange(s);
    setItems([]);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative flex-1 min-w-[200px]">
      <input className="field w-full" placeholder="Search listings…" value={value}
             onChange={e=>onInput(e.target.value)} onFocus={()=>items.length&&setOpen(true)} />
      {open && (
        <div className="absolute left-0 right-0 top-[46px] z-40 bg-background border rounded-xl shadow-xl">
          {items.map((s,i)=>(
            <div key={i} className="px-3 py-2 cursor-pointer hover:bg-muted/50"
                 onMouseDown={()=>handleSelect(s)}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}