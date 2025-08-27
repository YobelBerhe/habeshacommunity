// /components/PostModal.tsx
import { useEffect, useMemo, useState } from "react";
import { TAXONOMY, LABELS, isGig, CategoryKey } from "@/lib/taxonomy";
import { addListing } from "@/utils/storage";
import type { Listing } from "@/types";

type Props = {
  city: string;
  open: boolean;
  onClose: () => void;
  onPosted?: (listing: Listing) => void;
};

const catOptions: { key: CategoryKey; label: string }[] = ([
  ["housing","Housing / Rentals"],
  ["jobs","Jobs (+ Gigs)"],
  ["services","Services"],
  ["community","Community"],
] as const).map(([key,label]) => ({ key: key as CategoryKey, label }));

export default function PostModal({ city, open, onClose, onPosted }: Props) {
  const [category, setCategory] = useState<CategoryKey>("housing");
  const [subcategory, setSubcategory] = useState<string>("");
  const [jobKind, setJobKind] = useState<"regular"|"gig"|undefined>(undefined);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number|undefined>(undefined);
  const [currency, setCurrency] = useState("USD");
  const [contact, setContact] = useState({ phone:"", email:"", whatsapp:"", telegram:"" });
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string>("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [lat, setLat] = useState<number|undefined>(undefined);
  const [lon, setLon] = useState<number|undefined>(undefined);

  // Housing fields
  const [bedrooms, setBedrooms] = useState<number|undefined>(undefined);
  const [bathrooms, setBathrooms] = useState<number|undefined>(undefined);
  const [furnished, setFurnished] = useState<boolean>(false);
  const [availableFrom, setAvailableFrom] = useState<string>("");

  // Jobs fields
  const [employment, setEmployment] = useState<"full"|"part"|"contract"|"temp"|"intern"|undefined>(undefined);
  const [pay, setPay] = useState<string>(""); // e.g. "$20/hr" or "3000 ETB/mo"
  const [remoteOk, setRemoteOk] = useState<boolean>(false);
  const [employer, setEmployer] = useState<string>("");

  useEffect(()=> {
    // whenever subcategory changes, detect gig flag (jobs only)
    if (category === "jobs") {
      setJobKind(isGig(subcategory) ? "gig" : "regular");
    } else {
      setJobKind(undefined);
    }
  }, [subcategory, category]);

  const subOptions = useMemo(() => {
    return TAXONOMY[category].sub.map((slug) => ({
      slug,
      label: LABELS[slug]?.en ?? slug.replace(/_/g, " "),
    }));
  }, [category]);

  if (!open) return null;

  const handlePhotos = async (files: FileList | null) => {
    if (!files?.length) return;
    const arr: string[] = [];
    for (const f of Array.from(files).slice(0, 8)) {
      const dataUrl = await compressToDataUrl(f, 1400); // simple client compression
      arr.push(dataUrl);
    }
    setPhotos(arr);
  };

  const submit = () => {
    const now = Date.now();
    const listing: Listing = {
      id: crypto.randomUUID(),
      city,
      category,
      subcategory,
      jobKind,
      title: title.trim(),
      description: description.trim(),
      price,
      currency,
      contact: normalizeContact(contact),
      tags: splitTags(tags),
      images: photos,
      lat, lon,
      createdAt: now,
      updatedAt: now,
      hasImage: photos.length > 0,
    };

    // attach dynamic fields into description footer for now (until DB attrs)
    if (category === "housing") {
      listing.description += formatAttrs({
        bedrooms, bathrooms, furnished, availableFrom
      });
    }
    if (category === "jobs") {
      listing.description += formatAttrs({
        jobKind, employer, employment, pay, remoteOk
      });
    }

    const { ok, reason } = addListing(city, listing);
    if (!ok && reason === "quota") {
      // retry without photos (localStorage full)
      listing.images = [];
      listing.hasImage = false;
      addListing(city, listing);
      alert("Posted without photos due to browser storage limit.");
    }

    onPosted?.(listing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-stretch md:justify-end">
      <div className="bg-background w-full md:w-[520px] h-[85vh] md:h-full rounded-t-2xl md:rounded-none p-4 md:p-6 overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Post a listing</h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 border">✕</button>
        </div>

        {/* Step 1: Category */}
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          className="w-full mb-3 border rounded-md px-3 py-2"
          value={category}
          onChange={(e)=>{ setCategory(e.target.value as CategoryKey); setSubcategory(""); }}
        >
          {catOptions.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>

        {/* Step 2: Subcategory */}
        <label className="block text-sm font-medium mb-1">Subcategory</label>
        <select
          className="w-full mb-4 border rounded-md px-3 py-2"
          value={subcategory}
          onChange={(e)=>setSubcategory(e.target.value)}
        >
          <option value="" disabled>Select…</option>
          {subOptions.map(s => <option key={s.slug} value={s.slug}>{s.label}</option>)}
        </select>

        {/* Dynamic fields */}
        {category === "housing" && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input type="number" min={0} placeholder="Bedrooms"
              className="border rounded-md px-3 py-2"
              value={bedrooms ?? ""} onChange={(e)=>setBedrooms(num(e.target.value))}/>
            <input type="number" min={0} placeholder="Bathrooms"
              className="border rounded-md px-3 py-2"
              value={bathrooms ?? ""} onChange={(e)=>setBathrooms(num(e.target.value))}/>
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={furnished} onChange={(e)=>setFurnished(e.target.checked)} />
              Furnished
            </label>
            <input type="date" className="border rounded-md px-3 py-2 col-span-2"
              value={availableFrom} onChange={(e)=>setAvailableFrom(e.target.value)} />
          </div>
        )}

        {category === "jobs" && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input placeholder="Employer (optional)" className="border rounded-md px-3 py-2 col-span-2"
              value={employer} onChange={(e)=>setEmployer(e.target.value)} />
            <select className="border rounded-md px-3 py-2"
              value={employment ?? ""} onChange={(e)=>setEmployment((e.target.value || undefined) as any)}>
              <option value="">Employment type</option>
              <option value="full">Full-time</option>
              <option value="part">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temp">Temporary</option>
              <option value="intern">Internship</option>
            </select>
            <input placeholder="Pay (e.g., $20/hr)" className="border rounded-md px-3 py-2"
              value={pay} onChange={(e)=>setPay(e.target.value)} />
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={remoteOk} onChange={(e)=>setRemoteOk(e.target.checked)} />
              Remote OK
            </label>
          </div>
        )}

        {/* Common fields */}
        <input className="border rounded-md px-3 py-2 mb-3 w-full" placeholder="Title *"
          value={title} onChange={(e)=>setTitle(e.target.value)} />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input className="border rounded-md px-3 py-2" placeholder="Price (optional)"
            inputMode="decimal" value={price ?? ""} onChange={(e)=>setPrice(num(e.target.value))} />
          <input className="border rounded-md px-3 py-2" placeholder="Currency" value={currency} onChange={(e)=>setCurrency(e.target.value.toUpperCase())}/>
        </div>
        <textarea className="border rounded-md px-3 py-2 mb-3 w-full min-h-[120px]" placeholder="Description"
          value={description} onChange={(e)=>setDescription(e.target.value)} />
        <input className="border rounded-md px-3 py-2 mb-3 w-full" placeholder="Tags (comma or # separated)"
          value={tags} onChange={(e)=>setTags(e.target.value)} />

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Photos (up to 8)</label>
          <input type="file" accept="image/*" multiple onChange={(e)=>handlePhotos(e.target.files)} />
          {!!photos.length && <p className="text-xs text-muted-foreground mt-1">{photos.length} selected</p>}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input className="border rounded-md px-3 py-2" placeholder="Phone" value={contact.phone}
            onChange={(e)=>setContact({...contact, phone:e.target.value})} />
          <input className="border rounded-md px-3 py-2" placeholder="Email" value={contact.email}
            onChange={(e)=>setContact({...contact, email:e.target.value})} />
          <input className="border rounded-md px-3 py-2" placeholder="WhatsApp" value={contact.whatsapp}
            onChange={(e)=>setContact({...contact, whatsapp:e.target.value})} />
          <input className="border rounded-md px-3 py-2" placeholder="Telegram" value={contact.telegram}
            onChange={(e)=>setContact({...contact, telegram:e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input className="border rounded-md px-3 py-2" placeholder="Lat (optional)" value={lat ?? ""} onChange={(e)=>setLat(num(e.target.value))}/>
          <input className="border rounded-md px-3 py-2" placeholder="Lon (optional)" value={lon ?? ""} onChange={(e)=>setLon(num(e.target.value))}/>
        </div>

        <button
          className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold"
          onClick={submit}
          disabled={!title || !subcategory}
        >
          Publish
        </button>
      </div>
    </div>
  );
}

// helpers
function splitTags(s: string): string[] {
  if (!s) return [];
  return s.split(/[,#]/g).map(t=>t.trim()).filter(Boolean).slice(0,10);
}
function num(v: string): number|undefined {
  const n = Number(v); return isNaN(n) ? undefined : n;
}
function normalizeContact(c: any) {
  const out: any = {};
  for (const k of ["phone","email","whatsapp","telegram"]) {
    if (c?.[k]) out[k] = String(c[k]).trim();
  }
  return out;
}
function formatAttrs(obj: Record<string, unknown>): string {
  const pairs = Object.entries(obj).filter(([,v])=>v!==undefined && v!=="");
  if (!pairs.length) return "";
  const lines = pairs.map(([k,v])=>`• ${labelize(k)}: ${String(v)}`).join("\n");
  return `\n\n—\n${lines}`;
}
function labelize(k: string) {
  return k.replace(/_/g," ").replace(/\b\w/g, m=>m.toUpperCase());
}
async function compressToDataUrl(file: File, maxW: number): Promise<string> {
  const img = await new Promise<HTMLImageElement>((res)=>{
    const i = new Image(); const r = new FileReader();
    r.onload = ()=>{ i.onload = ()=>res(i); i.src = r.result as string; }; r.readAsDataURL(file);
  });
  const scale = Math.min(1, maxW / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.82);
}