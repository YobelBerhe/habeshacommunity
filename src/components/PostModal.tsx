/* ======================================================================
   FILE: /components/PostModal.tsx
   TRUE modal/drawer + compression + validation + quota handling
   ====================================================================== */
import { useEffect, useState } from "react";
import { Listing } from "@/types";
import { JOB_TYPES } from "@/constants";
import { compressImage } from "@/utils/storage";
import CitySearch from "@/components/CitySearch";

export default function PostModal({
  open, onOpenChange, defaultCategory, cityFallback, onSave
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultCategory: string;
  cityFallback?: { lat?: number; lon?: number };
  onSave: (l: Listing) => Promise<{ok:boolean; note?:string}>;
}) {
  const [cat, setCat] = useState(defaultCategory);
  const [job, setJob] = useState<string>("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<string>("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [contact, setContact] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [lat, setLat] = useState<number | undefined>(cityFallback?.lat);
  const [lon, setLon] = useState<number | undefined>(cityFallback?.lon);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ if(open){ setCat(defaultCategory);} },[open, defaultCategory]);
  if (!open) return null;

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const arr = Array.from(files).slice(0, 6);
    const out: string[] = [];
    for (const f of arr) out.push(await compressImage(f, 960, 0.82));
    setImages(out);
  }

  function useMyLocation() {
    if (!navigator.geolocation) { setMsg("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      p => { setLat(p.coords.latitude); setLon(p.coords.longitude); setMsg("Location added to post."); },
      e => setMsg(e.message)
    );
  }

  function validate(): string | null {
    if (!title.trim() || title.trim().length < 3) return "Please enter a longer title.";
    if (!contact.trim()) return "Please add a contact.";
    if (price && Number.isNaN(Number(price))) return "Price must be a number.";
    return null;
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const v = validate();
    if (v) { setMsg(v); return; }
    setSaving(true);
    const id = crypto.randomUUID().slice(0,8);
    const listing: Listing = {
      id,
      title: title.trim(),
      category: cat,
      jobSubcategory: cat === "jobs" ? (job || undefined) : undefined,
      description: desc.trim(),
      tags: tags.split(/[,\s]+/).map(t=>t.replace(/^#/, "")).filter(Boolean),
      price: price ? Number(price) : undefined,
      contact: contact.trim(),
      createdAt: Date.now(),
      images,
      lat: lat ?? cityFallback?.lat,
      lon: lon ?? cityFallback?.lon,
      categoryLabel:
        cat === "housing" ? "Housing / Rentals" :
        cat === "forsale" ? "For Sale" :
        cat === "jobs" ? "Jobs & Employment" :
        cat === "services" ? "Services" : "Community",
      jobSubcategoryLabel: JOB_TYPES.find(j=>j.value===job)?.label,
      city: "Current City"
    };

    const res = await onSave(listing);
    setSaving(false);

    if (res.ok) {
      setMsg(res.note ? `Posted (images skipped): ${res.note}` : "Posted!");
      setTimeout(()=>onOpenChange(false), 350);
    } else {
      setMsg("Could not save listing (storage quota). Try fewer/smaller photos.");
    }
  }

  return (
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40" onClick={()=>onOpenChange(false)} />
      <div className="absolute right-0 top-0 h-full w-full md:w-[520px] bg-background shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-background/90 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Post a listing</div>
          <button className="btn" onClick={()=>onOpenChange(false)}>✕</button>
        </div>

        <form className="p-4 grid gap-3" onSubmit={submit}>
          {msg && <div className="text-sm px-3 py-2 rounded bg-amber-50 border border-amber-200 text-amber-800">{msg}</div>}

          <div className="flex gap-3 flex-wrap">
            <select className="field max-w-[240px]" value={cat} onChange={e=>setCat(e.target.value)}>
              <option value="housing">Housing / Rentals</option>
              <option value="forsale">For Sale</option>
              <option value="jobs">Jobs</option>
              <option value="services">Services</option>
              <option value="community">Community</option>
            </select>
            {cat === "jobs" && (
              <select className="field max-w-[260px]" value={job} onChange={e=>setJob(e.target.value)}>
                <option value="">All job types</option>
                {JOB_TYPES.map(j=> <option key={j.value} value={j.value}>{j.label}</option>)}
              </select>
            )}
          </div>

          <input className="field" placeholder="Title *" value={title} onChange={e=>setTitle(e.target.value)} />
          <div className="flex gap-3 flex-wrap">
            <input className="field max-w-[200px]" type="number" placeholder="Price (optional)" value={price} onChange={e=>setPrice(e.target.value)} />
            <input className="field flex-1" placeholder="Contact (phone / WhatsApp / Telegram / email)" value={contact} onChange={e=>setContact(e.target.value)} />
          </div>
          <textarea className="field" rows={5} placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <input className="field" placeholder="Tags (comma or # separated)" value={tags} onChange={e=>setTags(e.target.value)} />

          <div>
            <label className="text-sm text-muted-foreground block mb-2">Photos (up to 6)</label>
            <input className="field" type="file" accept="image/*" multiple onChange={e=>onFiles(e.target.files)} />
            <div className="flex gap-2 flex-wrap mt-2">
              {images.map((src,i)=>(<img key={i} src={src} className="w-20 h-20 object-cover rounded border" />))}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground block mb-2">Location</label>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1">
                <CitySearch
                  value={selectedCity}
                  onSelect={(city) => {
                    setSelectedCity(`${city.name}, ${city.country}`);
                    setLat(Number(city.lat));
                    setLon(Number(city.lon));
                    setMsg("City location added to post.");
                  }}
                />
              </div>
              <button type="button" className="btn" onClick={useMyLocation}>Use my location</button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary disabled:opacity-60" disabled={saving}>
            {saving ? "Publishing…" : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}