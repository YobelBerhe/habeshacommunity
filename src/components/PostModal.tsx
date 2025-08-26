import { useState } from "react";
import { Listing } from "@/types";

export default function PostModal({
  open, onOpenChange, defaultCategory, cityFallback, onSave
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultCategory: string;
  cityFallback?: { lat?: number; lon?: number };
  onSave: (l: Listing) => void;
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

  if (!open) return null;

  async function filesToDataUrls(fs: FileList | null) {
    if (!fs) return;
    const arr = Array.from(fs).slice(0, 6);
    const res = await Promise.all(
      arr.map(f => new Promise<string>(r => { const fr=new FileReader(); fr.onload=()=>r(String(fr.result)); fr.readAsDataURL(f); }))
    );
    setImages(res);
  }
  function useMyLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(p => {
      setLat(p.coords.latitude); setLon(p.coords.longitude);
      alert("Location added to post.");
    }, e => alert(e.message));
  }
  function save() {
    if (!title.trim()) return alert("Title required");
    const id = Math.random().toString(36).slice(2, 9);
    const now = Date.now();
    const out: Listing = {
      id,
      title: title.trim(),
      category: cat,
      jobSubcategory: cat==="jobs" ? (job || undefined) : undefined,
      description: desc,
      tags: tags.split(/[,\s]+/).map(t=>t.replace(/^#/,"")).filter(Boolean),
      price: price ? Number(price) : undefined,
      contact,
      createdAt: now,
      images,
      city: "Current City", // This would be passed from parent
      lat: lat ?? cityFallback?.lat,
      lon: lon ?? cityFallback?.lon,
      categoryLabel: cat==="housing" ? "Housing / Rentals" :
                     cat==="forsale" ? "For Sale" :
                     cat==="jobs" ? "Jobs" :
                     cat==="services" ? "Services" : "Community",
      jobSubcategoryLabel: undefined
    };
    onSave(out);
    onOpenChange(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-background border rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Post a listing</h3>
          <button className="btn" onClick={() => onOpenChange(false)}>✕</button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <select className="field max-w-[240px]" value={cat} onChange={e=>setCat(e.target.value)}>
              <option value="housing">Housing / Rentals</option>
              <option value="forsale">For Sale</option>
              <option value="jobs">Jobs</option>
              <option value="services">Services</option>
              <option value="community">Community</option>
            </select>
            {cat==="jobs" && (
              <select className="field max-w-[260px]" value={job} onChange={e=>setJob(e.target.value)}>
                <option value="">All job types</option>
                <option value="transport_truck">Truck Driver</option>
                <option value="rideshare_taxi">Taxi / Rideshare</option>
                <option value="food_barista">Café / Barista</option>
                <option value="caregiver">Caregiver</option>
                <option value="it_support">IT Support</option>
                <option value="cashier">Cashier</option>
              </select>
            )}
          </div>

          <input className="field w-full" placeholder="Title *" value={title} onChange={e=>setTitle(e.target.value)} />
          <div className="flex gap-3 flex-wrap">
            <input className="field max-w-[200px]" type="number" placeholder="Price (optional)"
                   value={price} onChange={e=>setPrice(e.target.value)} />
            <input className="field flex-1" placeholder="Contact (phone / WhatsApp / Telegram / email)"
                   value={contact} onChange={e=>setContact(e.target.value)} />
          </div>
          <textarea className="field w-full" rows={5} placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
          <input className="field w-full" placeholder="Tags (comma or # separated)" value={tags} onChange={e=>setTags(e.target.value)} />

          <div>
            <label className="text-sm text-muted-foreground block mb-2">Photos (up to 6)</label>
            <input className="field w-full" type="file" accept="image/*" multiple onChange={e=>filesToDataUrls(e.target.files)} />
            <div className="flex gap-2 flex-wrap mt-2">
              {images.map((src,i)=>(<img key={i} src={src} className="w-20 h-20 object-cover rounded border" />))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn" onClick={useMyLocation}>Use my location</button>
            <span className="text-sm text-muted-foreground">Optional: add a map pin.</span>
          </div>

          <button className="btn btn-primary w-full" onClick={save}>Publish</button>
        </div>
      </div>
    </div>
  );
}