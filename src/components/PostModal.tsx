import { useState } from "react";
import { Listing } from "@/types";
import { JOB_TYPES } from "@/constants";

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
  const [msg, setMsg] = useState<{type:"info"|"error"|"success"; text:string} | null>(null);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function filesToDataUrls(fs: FileList | null) {
    if (!fs) return;
    const arr = Array.from(fs).slice(0, 6);
    const res = await Promise.all(
      arr.map(
        f =>
          new Promise<string>((resolve) => {
            const fr = new FileReader();
            fr.onload = () => resolve(String(fr.result));
            fr.readAsDataURL(f);
          })
      )
    );
    setImages(res);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setMsg({ type: "error", text: "Geolocation not supported by your browser." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLat(p.coords.latitude);
        setLon(p.coords.longitude);
        setMsg({ type: "info", text: "Location added to this post." });
      },
      (e) => setMsg({ type: "error", text: e.message })
    );
  }

  function validate(): string | null {
    if (!title.trim() || title.trim().length < 3) return "Please enter a longer title.";
    if (!contact.trim()) return "Please add a contact (phone / WhatsApp / Telegram / email).";
    if (price && Number.isNaN(Number(price))) return "Price must be a number.";
    return null;
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const v = validate();
    if (v) { setMsg({ type: "error", text: v }); return; }

    setSaving(true);
    try {
      const id = Math.random().toString(36).slice(2, 9);
      const now = Date.now();
      const out: Listing = {
        id,
        title: title.trim(),
        category: cat,
        jobSubcategory: cat === "jobs" ? (job || undefined) : undefined,
        description: desc,
        tags: tags.split(/[,\s]+/).map(t => t.replace(/^#/, "")).filter(Boolean),
        price: price ? Number(price) : undefined,
        contact,
        createdAt: now,
        images,
        city: "Current City",
        lat: lat ?? cityFallback?.lat,
        lon: lon ?? cityFallback?.lon,
        categoryLabel:
          cat === "housing" ? "Housing / Rentals" :
          cat === "forsale" ? "For Sale" :
          cat === "jobs" ? "Jobs & Employment" :
          cat === "services" ? "Services" : "Community",
        jobSubcategoryLabel: JOB_TYPES.find(j=>j.value===job)?.label,
      };

      onSave(out);
      setMsg({ type: "success", text: "Posted! Opening your listing…" });
      setTimeout(() => onOpenChange(false), 350);
    } catch (err: any) {
      setMsg({ type: "error", text: `Could not save: ${String(err?.message || err)}` });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal open">
      <div className="card max-w-2xl w-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Post a listing</h3>
          <button className="btn" onClick={() => onOpenChange(false)}>✕</button>
        </div>

        {msg && (
          <div className={`mb-3 rounded-md px-3 py-2 text-sm ${
            msg.type === "error" ? "bg-red-50 text-red-700 border border-red-200" :
            msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" :
            "bg-blue-50 text-blue-700 border border-blue-200"
          }`}>{msg.text}</div>
        )}

        <form className="grid gap-3" onSubmit={submit}>
          <div className="flex gap-3 flex-wrap">
            <select className="field max-w-[240px]" value={cat} onChange={e => setCat(e.target.value)}>
              <option value="housing">Housing / Rentals</option>
              <option value="forsale">For Sale</option>
              <option value="jobs">Jobs</option>
              <option value="services">Services</option>
              <option value="community">Community</option>
            </select>
            {cat === "jobs" && (
              <select
                className="field max-w-[260px]"
                value={job}
                onChange={e => setJob(e.target.value)}
              >
                <option value="">All job types</option>
                {JOB_TYPES.map(j => <option key={j.value} value={j.value}>{j.label}</option>)}
              </select>
            )}
          </div>

          <input className="field" placeholder="Title *" value={title} onChange={e => setTitle(e.target.value)} />
          <div className="flex gap-3 flex-wrap">
            <input
              className="field max-w-[200px]" type="number" inputMode="numeric"
              placeholder="Price (optional)" value={price} onChange={e => setPrice(e.target.value)}
            />
            <input
              className="field flex-1"
              placeholder="Contact (phone / WhatsApp / Telegram / email)"
              value={contact} onChange={e => setContact(e.target.value)}
            />
          </div>
          <textarea className="field" rows={5} placeholder="Description"
                    value={desc} onChange={e => setDesc(e.target.value)} />
          <input className="field" placeholder="Tags (comma or # separated)"
                 value={tags} onChange={e => setTags(e.target.value)} />

          <div>
            <label className="text-sm text-muted-foreground block mb-2">Photos (up to 6)</label>
            <input className="field" type="file" accept="image/*" multiple onChange={e => filesToDataUrls(e.target.files)} />
            <div className="flex gap-2 flex-wrap mt-2">
              {images.map((src, i) => (<img key={i} src={src} className="w-20 h-20 object-cover rounded border" />))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="btn" onClick={useMyLocation}>Use my location</button>
            <span className="text-sm text-muted-foreground">Optional: add a map pin</span>
          </div>

          <button type="submit" className="btn btn-primary disabled:opacity-60" disabled={saving}>
            {saving ? "Publishing…" : "Publish"}
          </button>
        </form>
      </div>
    </div>
  );
}