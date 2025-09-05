import { useEffect, useMemo, useState } from "react";
import { TAXONOMY, LABELS, isGig, CategoryKey } from "@/lib/taxonomy";
import { createListingWithContact, updateListingWithContact } from "@/repo/listingsWithContacts";
import { getUserId } from "@/repo/auth";
import { uploadListingImages } from "@/utils/upload";
import type { Listing } from "@/types";
import { toast } from "sonner";
import { useAuth } from '@/store/auth';
import { useLanguage } from '@/store/language';
import { t } from '@/lib/i18n';

type Props = {
  city: string;
  onPosted?: (listing: Listing) => void;
};

const catOptions: { key: string; label: string }[] = [
  { key: "housing", label: "Housing / Rentals" },
  { key: "jobs", label: "Jobs (+ Gigs)" },
  { key: "services", label: "Services" },
  { key: "community", label: "Community" },
  { key: "mentor", label: "Mentor Profile" },
  { key: "marketplace", label: "Marketplace Item" },
  { key: "match", label: "Match & Connect" },
];

export default function PostModal({ city, onPosted }: Props) {
  const { postOpen, closePost, user, editingListing } = useAuth();
  const { language } = useLanguage();
  const isEditing = !!editingListing;
  
  const [category, setCategory] = useState<string>("housing");
  const [subcategory, setSubcategory] = useState<string>("");
  const [jobKind, setJobKind] = useState<"regular"|"gig"|undefined>(undefined);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number|undefined>(undefined);
  const [currency, setCurrency] = useState("USD");
  const [contact, setContact] = useState({ phone:"", email:"", whatsapp:"", telegram:"" });
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [lat, setLat] = useState<number|undefined>(undefined);
  const [lng, setLng] = useState<number|undefined>(undefined);
  const [currentCity, setCurrentCity] = useState(city);
  const [country, setCountry] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [contactHidden, setContactHidden] = useState(false);
  const [streetAddress, setStreetAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Mentor fields
  const [displayName, setDisplayName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [topics, setTopics] = useState<string>("");
  const [languages, setLanguages] = useState<string>("");
  const [priceCents, setPriceCents] = useState<number|undefined>(undefined);

  // Marketplace fields  
  const [condition, setCondition] = useState<"new"|"like-new"|"good"|"fair"|undefined>(undefined);
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");

  // Match fields
  const [age, setAge] = useState<number|undefined>(undefined);
  const [gender, setGender] = useState<"male"|"female"|"other"|undefined>(undefined);
  const [seeking, setSeeking] = useState<"male"|"female"|"other"|undefined>(undefined);

  // Load listing data when editing
  useEffect(() => {
    if (editingListing) {
      setCategory(editingListing.category);
      setSubcategory(editingListing.subcategory || "");
      setTitle(editingListing.title);
      setDescription(editingListing.description || "");
      setPrice(editingListing.price || undefined);
      setCurrency(editingListing.currency || "USD");
      setContact({
        phone: editingListing.contact_phone || "",
        email: editingListing.contact_email || "",
        whatsapp: editingListing.contact_whatsapp || "",
        telegram: editingListing.contact_telegram || ""
      });
      setTags(editingListing.tags?.join(", ") || "");
      setPhotos([]); // Reset photos, user can upload new ones
      setLat(editingListing.lat || undefined);
      setLng(editingListing.lng || undefined);
      setCurrentCity(editingListing.city);
      setCountry(editingListing.country || "");
      setWebsiteUrl(editingListing.website_url || "");
      setContactHidden((editingListing as any).contact_hidden || false);
      setStreetAddress((editingListing as any).street_address || "");
    } else {
      // Reset form when not editing
      setCategory("housing");
      setSubcategory("");
      setTitle("");
      setDescription("");
      setPrice(undefined);
      setCurrency("USD");
      setContact({ phone:"", email:"", whatsapp:"", telegram:"" });
      setTags("");
      setPhotos([]);
      setLat(undefined);
      setLng(undefined);
      setCurrentCity(city);
      setCountry("");
      setWebsiteUrl("");
      setContactHidden(false);
      setStreetAddress("");
    }
  }, [editingListing, city]);

  useEffect(()=> {
    // whenever subcategory changes, detect gig flag (jobs only)
    if (category === "jobs") {
      setJobKind(isGig(subcategory) ? "gig" : "regular");
    } else {
      setJobKind(undefined);
    }
  }, [subcategory, category]);

  const subOptions = useMemo(() => {
    if (category === "mentor") {
      return [
        { slug: "language", label: "Language" },
        { slug: "health", label: "Health" },
        { slug: "career", label: "Career" },
        { slug: "finance", label: "Finance" },
        { slug: "education", label: "Education" },
        { slug: "immigration", label: "Immigration" },
        { slug: "business", label: "Business" },
        { slug: "tech", label: "Technology" },
        { slug: "life", label: "Life Coaching" },
      ];
    }
    if (category === "marketplace") {
      return [
        { slug: "electronics", label: "Electronics" },
        { slug: "furniture", label: "Furniture" },
        { slug: "clothing", label: "Clothing" },
        { slug: "books", label: "Books" },
        { slug: "vehicles", label: "Vehicles" },
        { slug: "home", label: "Home & Garden" },
        { slug: "sports", label: "Sports & Recreation" },
        { slug: "other", label: "Other" },
      ];
    }
    if (category === "match") {
      return [
        { slug: "dating", label: "Dating" },
        { slug: "friendship", label: "Friendship" },
        { slug: "networking", label: "Professional Networking" },
        { slug: "activity", label: "Activity Partner" },
      ];
    }
    if (TAXONOMY[category as CategoryKey]) {
      return TAXONOMY[category as CategoryKey].sub.map((slug) => ({
        slug,
        label: LABELS[slug]?.en ?? slug.replace(/_/g, " "),
      }));
    }
    return [];
  }, [category]);

  

  const handlePhotos = (files: FileList | null) => {
    if (!files?.length) {
      setPhotos([]);
      return;
    }
    setPhotos(Array.from(files).slice(0, 6));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic required fields for all categories
    if (!title.trim()) newErrors.title = "Title is required";
    if (!subcategory) newErrors.subcategory = "Subcategory is required";
    if (!currentCity.trim()) newErrors.currentCity = "City is required";
    
    // Category-specific validation
    if (category === "mentor") {
      if (!displayName.trim()) newErrors.displayName = "Display name is required";
      if (!bio.trim()) newErrors.bio = "Bio is required";
    }
    
    if (category === "marketplace") {
      if (!condition) newErrors.condition = "Condition is required";
    }
    
    if (category === "match") {
      if (!age) newErrors.age = "Age is required";
      if (!gender) newErrors.gender = "Gender is required";
      if (!seeking) newErrors.seeking = "Seeking preference is required";
    }
    
    // At least one contact method required
    if (!contact.phone && !contact.email && !contact.whatsapp && !contact.telegram) {
      newErrors.contact = "At least one contact method is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validateForm()) {
      toast("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const userId = await getUserId();
      if (!userId) {
        toast("Please sign in to post a listing");
        setSubmitting(false);
        return;
      }

      // Upload images first (only if new photos are selected)
      const imageUrls = photos.length ? await uploadListingImages(photos, userId) : 
                       (isEditing ? editingListing?.images || [] : []);

      // Build description with dynamic fields
      let finalDescription = description.trim();
      if (category === "housing") {
        finalDescription += formatAttrs({
          bedrooms, bathrooms, furnished, availableFrom
        });
      }
      if (category === "jobs") {
        finalDescription += formatAttrs({
          jobKind, employer, employment, pay, remoteOk
        });
      }
      if (category === "mentor") {
        finalDescription += formatAttrs({
          topics: topics.split(',').map(t => t.trim()).filter(Boolean),
          languages: languages.split(',').map(l => l.trim()).filter(Boolean),
          price: priceCents ? `$${priceCents/100}/session` : undefined
        });
      }
      if (category === "marketplace") {
        finalDescription += formatAttrs({
          condition, brand, model
        });
      }
      if (category === "match") {
        finalDescription += formatAttrs({
          age, gender, seeking
        });
      }

      // Create or update the listing in database
      const finalWebsiteUrl = websiteUrl.trim() ? 
        (websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`) : null;
      
      let dbListing, dbContact;
      
      if (isEditing && editingListing) {
        const result = await updateListingWithContact(editingListing.id, {
          city: currentCity || "Unknown",
          country: country || null,
          category: category as any,
          subcategory: subcategory || null,
          title: title.trim(),
          description: finalDescription,
          price_cents: price ? Math.round(price * 100) : null,
          currency: currency || "USD",
          tags: splitTags(tags),
          images: imageUrls,
          location_lat: lat || null,
          location_lng: lng || null,
          website_url: finalWebsiteUrl,
          contact_hidden: contactHidden,
          street_address: streetAddress.trim() || null,
        } as any, {
          contact_method: getContactMethod(contact),
          contact_value: getContactValue(contact),
        });
        dbListing = result.listing;
        dbContact = result.contact;
      } else {
        const result = await createListingWithContact({
          user_id: userId,
          city: currentCity || "Unknown",
          country: country || null,
          category: category as any,
          subcategory: subcategory || null,
          title: title.trim(),
          description: finalDescription,
          price_cents: price ? Math.round(price * 100) : null,
          currency: currency || "USD",
          tags: splitTags(tags),
          images: imageUrls,
          location_lat: lat || null,
          location_lng: lng || null,
          website_url: finalWebsiteUrl,
          contact_hidden: contactHidden,
          street_address: streetAddress.trim() || null,
        } as any, {
          contact_method: getContactMethod(contact),
          contact_value: getContactValue(contact),
        });
        dbListing = result.listing;
        dbContact = result.contact;
      }

      // Convert back to frontend format for optimistic update
      const frontendListing: Listing = {
        id: dbListing.id,
        user_id: dbListing.user_id || userId,
        city: dbListing.city,
        country: dbListing.country,
        category: dbListing.category as string,
        subcategory: dbListing.subcategory,
        title: dbListing.title,
        description: dbListing.description || "",
        price: dbListing.price_cents ? dbListing.price_cents / 100 : null,
        currency: dbListing.currency,
        contact_phone: dbContact?.contact_method === 'phone' ? dbContact.contact_value : null,
        contact_whatsapp: dbContact?.contact_method === 'whatsapp' ? dbContact.contact_value : null,
        contact_telegram: dbContact?.contact_method === 'telegram' ? dbContact.contact_value : null,
        contact_email: dbContact?.contact_method === 'email' ? dbContact.contact_value : null,
        website_url: dbListing.website_url,
        tags: dbListing.tags || [],
        images: dbListing.images || [],
        lat: dbListing.location_lat,
        lng: dbListing.location_lng,
        created_at: dbListing.created_at,
        // Legacy compatibility
        jobKind,
        contact: { phone: dbContact?.contact_value || "" },
        photos: dbListing.images || [],
        lon: dbListing.location_lng || undefined,
        createdAt: new Date(dbListing.created_at).getTime(),
        updatedAt: new Date(dbListing.updated_at).getTime(),
        hasImage: !!(dbListing.images?.length),
      };

      onPosted?.(frontendListing);
      closePost();
      
      // Reset form
      setTitle("");
      setDescription("");
      setTags("");
      setPhotos([]);
      setPrice(undefined);
      setContact({ phone:"", email:"", whatsapp:"", telegram:"" });
      setWebsiteUrl("");
      setCountry("");
      setStreetAddress("");
      setErrors({});
      
      toast(isEditing ? "Updated successfully!" : "Posted successfully!");

      // smooth scroll to listings (if present)
      setTimeout(() => {
        document.getElementById("listing-root")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } catch (error) {
      console.error("Failed to post listing:", error);
      toast("Failed to post listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  if (!postOpen) return null;
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-end md:items-stretch md:justify-end">
      <div className="bg-background w-full md:w-[520px] h-[85vh] md:h-full rounded-t-2xl md:rounded-none p-4 md:p-6 overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">{isEditing ? t(language, "edit_listing") : t(language, "post_a_listing")}</h2>
          <button onClick={closePost} className="rounded-md px-2 py-1 border">✕</button>
        </div>

        {/* Step 1: Category */}
        <label className="block text-sm font-medium mb-1">Category *</label>
        <select
          className={`w-full mb-1 border rounded-md px-3 py-2 bg-background text-foreground ${errors.category ? 'border-red-500' : ''}`}
          value={category}
          onChange={(e)=>{ setCategory(e.target.value); setSubcategory(""); setErrors({...errors, category: "", subcategory: ""}); }}
        >
          {catOptions.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        {errors.category && <p className="text-red-500 text-xs mb-2">{errors.category}</p>}

        {/* Step 2: Subcategory */}
        <label className="block text-sm font-medium mb-1">Subcategory *</label>
        <select
          className={`w-full mb-1 border rounded-md px-3 py-2 bg-background text-foreground ${errors.subcategory ? 'border-red-500' : ''}`}
          value={subcategory}
          onChange={(e)=>{setSubcategory(e.target.value); setErrors({...errors, subcategory: ""});}}
        >
          <option value="" disabled>Select…</option>
          {subOptions.map(s => <option key={s.slug} value={s.slug}>{s.label}</option>)}
        </select>
        {errors.subcategory && <p className="text-red-500 text-xs mb-2">{errors.subcategory}</p>}
        <div className="mb-2"></div>

        {/* Title Field */}
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input 
          className={`w-full mb-1 border rounded-md px-3 py-2 bg-background text-foreground ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter a descriptive title"
          value={title}
          onChange={(e)=>{setTitle(e.target.value); setErrors({...errors, title: ""});}}
        />
        {errors.title && <p className="text-red-500 text-xs mb-2">{errors.title}</p>}
        <div className="mb-3"></div>

        {/* Description Field */}
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          className="w-full mb-3 border rounded-md px-3 py-2 bg-background text-foreground min-h-20"
          placeholder="Describe what you're offering"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        {/* Price Field */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input 
            type="number" 
            placeholder="Price (optional)" 
            className="border rounded-md px-3 py-2 bg-background text-foreground"
            value={price ?? ""} 
            onChange={(e)=>setPrice(num(e.target.value))}
          />
          <select 
            className="border rounded-md px-3 py-2 bg-background text-foreground"
            value={currency}
            onChange={(e)=>setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ETB">ETB</option>
            <option value="CAD">CAD</option>
          </select>
        </div>

        {/* Tags Field */}
        <label className="block text-sm font-medium mb-1">Tags</label>
        <input 
          className="w-full mb-4 border rounded-md px-3 py-2 bg-background text-foreground"
          placeholder="Comma separated tags"
          value={tags}
          onChange={(e)=>setTags(e.target.value)}
        />

        {/* Website URL Field */}
        <label className="block text-sm font-medium mb-1">Website URL (optional)</label>
        <input 
          className="w-full mb-4 border rounded-md px-3 py-2 bg-background text-foreground"
          placeholder="https://yourwebsite.com"
          value={websiteUrl}
          onChange={(e)=>setWebsiteUrl(e.target.value)}
        />

        {/* Dynamic fields */}
        {category === "housing" && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input type="number" min={0} placeholder="Bedrooms"
              className="border rounded-md px-3 py-2 bg-background text-foreground"
              value={bedrooms ?? ""} onChange={(e)=>setBedrooms(num(e.target.value))}/>
            <input type="number" min={0} placeholder="Bathrooms"
              className="border rounded-md px-3 py-2 bg-background text-foreground"
              value={bathrooms ?? ""} onChange={(e)=>setBathrooms(num(e.target.value))}/>
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={furnished} onChange={(e)=>setFurnished(e.target.checked)} />
              Furnished
            </label>
            <input type="date" className="border rounded-md px-3 py-2 col-span-2 bg-background text-foreground"
              value={availableFrom} onChange={(e)=>setAvailableFrom(e.target.value)} />
          </div>
        )}

        {category === "jobs" && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input placeholder="Employer (optional)" className="border rounded-md px-3 py-2 col-span-2 bg-background text-foreground"
              value={employer} onChange={(e)=>setEmployer(e.target.value)} />
            <select className="border rounded-md px-3 py-2 bg-background text-foreground"
              value={employment ?? ""} onChange={(e)=>setEmployment((e.target.value || undefined) as any)}>
              <option value="">Employment type</option>
              <option value="full">Full-time</option>
              <option value="part">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temp">Temporary</option>
              <option value="intern">Internship</option>
            </select>
            <input placeholder="Pay (e.g., $20/hr)" className="border rounded-md px-3 py-2 bg-background text-foreground"
              value={pay} onChange={(e)=>setPay(e.target.value)} />
            <label className="col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={remoteOk} onChange={(e)=>setRemoteOk(e.target.checked)} />
              Remote OK
            </label>
          </div>
        )}

        {category === "mentor" && (
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Display Name *</label>
              <input 
                placeholder="Display Name" 
                className={`w-full border rounded-md px-3 py-2 bg-background text-foreground ${errors.displayName ? 'border-red-500' : ''}`}
                value={displayName} 
                onChange={(e)=>{setDisplayName(e.target.value); setErrors({...errors, displayName: ""});}}
              />
              {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio *</label>
              <textarea 
                placeholder="Bio - Tell people about your expertise" 
                className={`w-full border rounded-md px-3 py-2 bg-background text-foreground min-h-20 ${errors.bio ? 'border-red-500' : ''}`}
                value={bio} 
                onChange={(e)=>{setBio(e.target.value); setErrors({...errors, bio: ""});}}
              />
              {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
            </div>
            <input placeholder="Topics (comma separated: language, career, health)" className="border rounded-md px-3 py-2 bg-background text-foreground"
              value={topics} onChange={(e)=>setTopics(e.target.value)} />
            <input placeholder="Languages (comma separated: English, Tigrinya, Amharic)" className="border rounded-md px-3 py-2 bg-background text-foreground"
              value={languages} onChange={(e)=>setLanguages(e.target.value)} />
            <input type="number" placeholder="Price per session (USD)" className="border rounded-md px-3 py-2 bg-background text-foreground"
              value={priceCents ? priceCents/100 : ""} onChange={(e)=>setPriceCents(e.target.value ? parseFloat(e.target.value) * 100 : undefined)} />
          </div>
        )}

        {category === "marketplace" && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Condition *</label>
              <select 
                className={`w-full border rounded-md px-3 py-2 bg-background text-foreground ${errors.condition ? 'border-red-500' : ''}`}
                value={condition ?? ""} 
                onChange={(e)=>{setCondition((e.target.value || undefined) as any); setErrors({...errors, condition: ""});}}
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
              {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
            </div>
            <input placeholder="Brand" className="border rounded-md px-3 py-2 bg-background text-foreground"
              value={brand} onChange={(e)=>setBrand(e.target.value)} />
            <input placeholder="Model" className="border rounded-md px-3 py-2 bg-background text-foreground"
              value={model} onChange={(e)=>setModel(e.target.value)} />
          </div>
        )}

        {category === "match" && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Age *</label>
              <input 
                type="number" 
                placeholder="Age" 
                className={`w-full border rounded-md px-3 py-2 bg-background text-foreground ${errors.age ? 'border-red-500' : ''}`}
                value={age ?? ""} 
                onChange={(e)=>{setAge(num(e.target.value)); setErrors({...errors, age: ""});}}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">My Gender *</label>
              <select 
                className={`w-full border rounded-md px-3 py-2 bg-background text-foreground ${errors.gender ? 'border-red-500' : ''}`}
                value={gender ?? ""} 
                onChange={(e)=>{setGender((e.target.value || undefined) as any); setErrors({...errors, gender: ""});}}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Seeking *</label>
              <select 
                className={`w-full border rounded-md px-3 py-2 bg-background text-foreground ${errors.seeking ? 'border-red-500' : ''}`}
                value={seeking ?? ""} 
                onChange={(e)=>{setSeeking((e.target.value || undefined) as any); setErrors({...errors, seeking: ""});}}
              >
                <option value="">Select preference</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Any</option>
              </select>
              {errors.seeking && <p className="text-red-500 text-xs mt-1">{errors.seeking}</p>}
            </div>
          </div>
        )}

        {/* Street Address - moved above city */}
        <input 
          className="border rounded-md px-3 py-2 mb-3 w-full bg-background text-foreground" 
          placeholder="Street Address (optional - helps with map location)"
          value={streetAddress} 
          onChange={(e)=>setStreetAddress(e.target.value)}
          list="street-suggestions"
        />
        <datalist id="street-suggestions">
          <option value="123 Main St" />
          <option value="456 Oak Avenue" />
          <option value="789 Pine Street" />
          <option value="321 Elm Drive" />
        </datalist>

        {/* City & Country */}
        <div className="grid grid-cols-2 gap-3 mb-1">
          <div className="relative">
            <label className="block text-sm font-medium mb-1">City *</label>
            <input 
              className={`border rounded-md px-3 py-2 bg-background text-foreground w-full ${errors.currentCity ? 'border-red-500' : ''}`}
              placeholder="City"
              value={currentCity} 
              onChange={(e)=>{setCurrentCity(e.target.value); setErrors({...errors, currentCity: ""});}}
              list="city-suggestions"
            />
            <datalist id="city-suggestions">
              <option value="New York" />
              <option value="Los Angeles" />
              <option value="Chicago" />
              <option value="Houston" />
              <option value="Phoenix" />
              <option value="Philadelphia" />
              <option value="San Antonio" />
              <option value="San Diego" />
              <option value="Dallas" />
              <option value="San Jose" />
              <option value="Oakland" />
              <option value="San Francisco" />
            </datalist>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Country (optional)</label>
            <input 
              className="border rounded-md px-3 py-2 bg-background text-foreground w-full" 
              placeholder="Country"
              value={country} 
              onChange={(e)=>setCountry(e.target.value)}
              list="country-suggestions"
            />
            <datalist id="country-suggestions">
              <option value="United States" />
              <option value="Canada" />
              <option value="United Kingdom" />
              <option value="Germany" />
              <option value="France" />
              <option value="Italy" />
              <option value="Spain" />
              <option value="Netherlands" />
              <option value="Australia" />
              <option value="Japan" />
            </datalist>
          </div>
        </div>
        {errors.currentCity && <p className="text-red-500 text-xs mb-2">{errors.currentCity}</p>}
        <div className="mb-2"></div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Photos (up to 8)</label>
          <input type="file" accept="image/*" multiple onChange={(e)=>handlePhotos(e.target.files)} />
          {!!photos.length && <p className="text-xs text-muted-foreground mt-1">{photos.length} selected</p>}
        </div>

        <label className="block text-sm font-medium mb-1">Contact Information * (at least one required)</label>
        <div className="grid grid-cols-2 gap-3 mb-1">
          <input 
            className={`border rounded-md px-3 py-2 bg-background text-foreground ${errors.contact ? 'border-red-500' : ''}`}
            placeholder="Phone" 
            value={contact.phone}
            onChange={(e)=>{setContact({...contact, phone:e.target.value}); setErrors({...errors, contact: ""});}}
          />
          <input 
            className={`border rounded-md px-3 py-2 bg-background text-foreground ${errors.contact ? 'border-red-500' : ''}`}
            placeholder="Email" 
            value={contact.email}
            onChange={(e)=>{setContact({...contact, email:e.target.value}); setErrors({...errors, contact: ""});}}
          />
          <input 
            className={`border rounded-md px-3 py-2 bg-background text-foreground ${errors.contact ? 'border-red-500' : ''}`}
            placeholder="WhatsApp" 
            value={contact.whatsapp}
            onChange={(e)=>{setContact({...contact, whatsapp:e.target.value}); setErrors({...errors, contact: ""});}}
          />
          <input 
            className={`border rounded-md px-3 py-2 bg-background text-foreground ${errors.contact ? 'border-red-500' : ''}`}
            placeholder="Telegram" 
            value={contact.telegram}
            onChange={(e)=>{setContact({...contact, telegram:e.target.value}); setErrors({...errors, contact: ""});}}
          />
        </div>
        {errors.contact && <p className="text-red-500 text-xs mb-2">{errors.contact}</p>}
        <div className="mb-1"></div>

        <div className="mb-3">
          <label className="flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={contactHidden} 
              onChange={(e)=>setContactHidden(e.target.checked)} 
            />
            Hide contact information (only you can see it)
          </label>
          <p className="text-xs text-muted-foreground mt-1">
            When hidden, only you can see contact details. Others will need to message you through the platform.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input className="border rounded-md px-3 py-2 bg-background text-foreground" placeholder="Lat (optional)" value={lat ?? ""} onChange={(e)=>setLat(num(e.target.value))}/>
          <input className="border rounded-md px-3 py-2 bg-background text-foreground" placeholder="Lng (optional)" value={lng ?? ""} onChange={(e)=>setLng(num(e.target.value))}/>
        </div>

        <button
          className="w-full py-3 rounded-md bg-primary text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          onClick={submit}
          disabled={submitting}
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              {isEditing ? "Updating..." : "Publishing..."}
            </div>
          ) : (
            isEditing ? "Update" : "Publish"
          )}
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
function getContactMethod(contact: any): 'phone' | 'whatsapp' | 'telegram' | 'email' | null {
  if (contact.phone) return 'phone';
  if (contact.whatsapp) return 'whatsapp';
  if (contact.telegram) return 'telegram';
  if (contact.email) return 'email';
  return null;
}
function getContactValue(contact: any): string | null {
  return contact.phone || contact.whatsapp || contact.telegram || contact.email || null;
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