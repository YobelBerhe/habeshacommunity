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
import { supabase } from '@/integrations/supabase/client';

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
  { key: "forsale", label: "Marketplace Item" },
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
  const [squareFeet, setSquareFeet] = useState<number|undefined>(undefined);
  const [leaseDuration, setLeaseDuration] = useState<string>("");
  const [utilitiesIncluded, setUtilitiesIncluded] = useState<boolean>(false);
  const [petPolicy, setPetPolicy] = useState<"allowed"|"not-allowed"|"negotiable"|undefined>(undefined);
  const [parkingAvailable, setParkingAvailable] = useState<boolean>(false);
  const [securityDeposit, setSecurityDeposit] = useState<number|undefined>(undefined);
  const [amenities, setAmenities] = useState<string>("");

  // Jobs fields
  const [employment, setEmployment] = useState<"full"|"part"|"contract"|"temp"|"intern"|undefined>(undefined);
  const [pay, setPay] = useState<string>(""); // e.g. "$20/hr" or "3000 ETB/mo"
  const [remoteOk, setRemoteOk] = useState<boolean>(false);
  const [employer, setEmployer] = useState<string>("");
  const [benefits, setBenefits] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<"entry"|"mid"|"senior"|undefined>(undefined);
  const [education, setEducation] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");

  // Mentor fields
  const [displayName, setDisplayName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [topics, setTopics] = useState<string>("");
  const [languages, setLanguages] = useState<string>("");
  const [priceCents, setPriceCents] = useState<number|undefined>(undefined);
  const [planDescription, setPlanDescription] = useState<string>("2 calls per month (30min/call)");
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    linkedin: '',
    instagram: '',
    facebook: ''
  });

  // Marketplace fields  
  const [condition, setCondition] = useState<"new"|"like-new"|"good"|"fair"|undefined>(undefined);
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState<string>("");
  const [warranty, setWarranty] = useState<boolean>(false);
  const [reasonForSelling, setReasonForSelling] = useState<string>("");
  const [shippingAvailable, setShippingAvailable] = useState<boolean>(false);

  // Match fields
  const [matchName, setMatchName] = useState<string>("");
  const [matchBio, setMatchBio] = useState<string>("");
  const [matchPhotos, setMatchPhotos] = useState<string[]>([]);
  const [matchQuestions, setMatchQuestions] = useState<any[]>([]);
  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});

  // Load match questions when match category is selected
  useEffect(() => {
    if (category === "match" && matchQuestions.length === 0) {
      const loadQuestions = async () => {
        try {
          const { data, error } = await supabase
            .from('match_questions')
            .select('*')
            .order('section', { ascending: true })
            .order('is_required', { ascending: false });

          if (error) throw error;
          setMatchQuestions(data || []);
        } catch (error) {
          console.error('Error loading match questions:', error);
        }
      };
      loadQuestions();
    }
  }, [category]);

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

  // Geocoding function to get coordinates from address
  const geocodeAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
    try {
      // Using OpenStreetMap Nominatim API for free geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Handle address blur to geocode
  const handleAddressBlur = async () => {
    if (streetAddress.trim() && currentCity.trim()) {
      const fullAddress = `${streetAddress}, ${currentCity}${country ? ', ' + country : ''}`;
      const coords = await geocodeAddress(fullAddress);
      if (coords) {
        setLat(coords.lat);
        setLng(coords.lng);
        toast.success("📍 Location found on map!");
      }
    }
  };

  // Handle city blur to geocode if no street address
  const handleCityBlur = async () => {
    if (!streetAddress.trim() && currentCity.trim()) {
      const cityAddress = `${currentCity}${country ? ', ' + country : ''}`;
      const coords = await geocodeAddress(cityAddress);
      if (coords) {
        setLat(coords.lat);
        setLng(coords.lng);
        toast.success("📍 City location found on map!");
      }
    }
  };

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
    if (category === "forsale") {
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
    
    if (category === "forsale") {
      if (!condition) newErrors.condition = "Condition is required";
    }
    
    if (category === "match") {
      if (!matchName.trim()) newErrors.matchName = "Name is required";
      if (!matchBio.trim()) newErrors.matchBio = "Bio is required";
      // Check required questions
      const requiredQuestions = matchQuestions.filter(q => q.is_required);
      const missingAnswers = requiredQuestions.filter(q => !matchAnswers[q.id]);
      if (missingAnswers.length > 0) {
        newErrors.matchAnswers = "Please answer all required questions";
      }
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
          bedrooms, bathrooms, squareFeet: squareFeet ? `${squareFeet} sq ft` : undefined,
          furnished, availableFrom, leaseDuration, utilitiesIncluded,
          petPolicy, parkingAvailable, 
          securityDeposit: securityDeposit ? `$${securityDeposit}` : undefined,
          amenities: amenities.split(',').map(a => a.trim()).filter(Boolean)
        });
      }
      if (category === "jobs") {
        finalDescription += formatAttrs({
          jobKind, employer, employment, pay, remoteOk, benefits,
          experienceLevel, education, startDate
        });
      }
      if (category === "mentor") {
        finalDescription += formatAttrs({
          topics: topics.split(',').map(t => t.trim()).filter(Boolean),
          languages: languages.split(',').map(l => l.trim()).filter(Boolean),
          price: priceCents ? `$${priceCents/100}/session` : undefined,
          planDescription,
          socialLinks: [
            socialLinks.linkedin && `LinkedIn: ${socialLinks.linkedin}`,
            socialLinks.twitter && `Twitter: ${socialLinks.twitter}`,
            socialLinks.instagram && `Instagram: ${socialLinks.instagram}`,
            socialLinks.facebook && `Facebook: ${socialLinks.facebook}`,
          ].filter(Boolean)
        });
      }
      if (category === "forsale") {
        finalDescription += formatAttrs({
          condition, brand, model, purchaseDate, warranty,
          reasonForSelling, shippingAvailable
        });
      }
      if (category === "match") {
        // Store match profile data and answers in description as JSON
        const matchData = {
          name: matchName,
          bio: matchBio,
          answers: matchAnswers
        };
        finalDescription += `\n\n---\nMatch Profile Data: ${JSON.stringify(matchData)}`;
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

        {/* Price Field - Hide for Match category */}
        {category !== "match" && (
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
        )}

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
          <div className="space-y-3 mb-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-sm font-semibold mb-2">🏠 Rental Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" min={0} placeholder="Bedrooms *"
                className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={bedrooms ?? ""} onChange={(e)=>setBedrooms(num(e.target.value))}/>
              <input type="number" min={0} placeholder="Bathrooms *"
                className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={bathrooms ?? ""} onChange={(e)=>setBathrooms(num(e.target.value))}/>
              <input type="number" min={0} placeholder="Square Feet"
                className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={squareFeet ?? ""} onChange={(e)=>setSquareFeet(num(e.target.value))}/>
              <input type="text" placeholder="Lease Duration (e.g., 12 months)"
                className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={leaseDuration} onChange={(e)=>setLeaseDuration(e.target.value)}/>
              <input type="number" min={0} placeholder="Security Deposit ($)"
                className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={securityDeposit ?? ""} onChange={(e)=>setSecurityDeposit(num(e.target.value))}/>
              <select className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={petPolicy ?? ""} onChange={(e)=>setPetPolicy((e.target.value || undefined) as any)}>
                <option value="">Pet Policy</option>
                <option value="allowed">Pets Allowed</option>
                <option value="not-allowed">No Pets</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>
            <input type="text" placeholder="Amenities (pool, gym, laundry, etc.)"
              className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
              value={amenities} onChange={(e)=>setAmenities(e.target.value)}/>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={furnished} onChange={(e)=>setFurnished(e.target.checked)} />
              Furnished
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={utilitiesIncluded} onChange={(e)=>setUtilitiesIncluded(e.target.checked)} />
              Utilities Included
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={parkingAvailable} onChange={(e)=>setParkingAvailable(e.target.checked)} />
              Parking Available
            </label>
            <div>
              <label className="block text-xs font-medium mb-1">Available From</label>
              <input type="date" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                value={availableFrom} onChange={(e)=>setAvailableFrom(e.target.value)} />
            </div>
          </div>
        )}

        {category === "jobs" && (
          <div className="space-y-3 mb-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-sm font-semibold mb-2">💼 Job Details</h3>
            <input placeholder="Employer/Company Name" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
              value={employer} onChange={(e)=>setEmployer(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <select className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={employment ?? ""} onChange={(e)=>setEmployment((e.target.value || undefined) as any)}>
                <option value="">Employment Type *</option>
                <option value="full">Full-time</option>
                <option value="part">Part-time</option>
                <option value="contract">Contract</option>
                <option value="temp">Temporary</option>
                <option value="intern">Internship</option>
              </select>
              <select className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={experienceLevel ?? ""} onChange={(e)=>setExperienceLevel((e.target.value || undefined) as any)}>
                <option value="">Experience Level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
              </select>
              <input placeholder="Pay (e.g., $20/hr)" className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={pay} onChange={(e)=>setPay(e.target.value)} />
              <input type="date" placeholder="Start Date" className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
            </div>
            <input placeholder="Education Required (e.g., Bachelor's in CS)" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
              value={education} onChange={(e)=>setEducation(e.target.value)} />
            <input placeholder="Benefits (health insurance, 401k, PTO, etc.)" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
              value={benefits} onChange={(e)=>setBenefits(e.target.value)} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={remoteOk} onChange={(e)=>setRemoteOk(e.target.checked)} />
              Remote Work Available
            </label>
          </div>
        )}

        {category === "mentor" && (
          <div className="space-y-3 mb-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-sm font-semibold mb-2">👨‍🏫 Mentor Profile</h3>
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
                placeholder="Tell people about your expertise and experience" 
                className={`w-full border rounded-md px-3 py-2 bg-background text-foreground min-h-20 ${errors.bio ? 'border-red-500' : ''}`}
                value={bio} 
                onChange={(e)=>{setBio(e.target.value); setErrors({...errors, bio: ""});}}
              />
              {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
            </div>
            <input placeholder="Topics/Expertise (comma-separated)" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
              value={topics} onChange={(e)=>setTopics(e.target.value)} />
            <input placeholder="Languages Spoken (comma-separated)" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
              value={languages} onChange={(e)=>setLanguages(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Hourly Rate (USD)" className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={priceCents ? priceCents/100 : ""} onChange={(e)=>setPriceCents(e.target.value ? parseFloat(e.target.value) * 100 : undefined)} />
              <select className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={currency} onChange={(e)=>setCurrency(e.target.value)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="ETB">ETB</option>
              </select>
            </div>
            <input placeholder="Mentorship plan details (e.g., 2 calls per month)" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
              value={planDescription} onChange={(e)=>setPlanDescription(e.target.value)} />
            <div className="space-y-2">
              <label className="block text-sm font-medium">Social Media Links (optional)</label>
              <input placeholder="LinkedIn profile URL" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                value={socialLinks.linkedin} onChange={(e)=>setSocialLinks({...socialLinks, linkedin: e.target.value})} />
              <input placeholder="Twitter/X profile URL" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                value={socialLinks.twitter} onChange={(e)=>setSocialLinks({...socialLinks, twitter: e.target.value})} />
              <input placeholder="Instagram profile URL" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                value={socialLinks.instagram} onChange={(e)=>setSocialLinks({...socialLinks, instagram: e.target.value})} />
              <input placeholder="Facebook profile URL" className="w-full border rounded-md px-3 py-2 bg-background text-foreground"
                value={socialLinks.facebook} onChange={(e)=>setSocialLinks({...socialLinks, facebook: e.target.value})} />
            </div>
          </div>
        )}

        {category === "forsale" && (
          <div className="space-y-3 mb-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-sm font-semibold mb-2">🛍️ Item Details</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Condition *</label>
              <select 
                className={`w-full border rounded-md px-3 py-2 bg-background text-foreground ${errors.condition ? 'border-red-500' : ''}`}
                value={condition ?? ""} 
                onChange={(e)=>{setCondition((e.target.value || undefined) as any); setErrors({...errors, condition: ""});}}
              >
                <option value="">Select condition</option>
                <option value="new">Brand New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
              {errors.condition && <p className="text-red-500 text-xs mt-1">{errors.condition}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Brand" className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={brand} onChange={(e)=>setBrand(e.target.value)} />
              <input placeholder="Model" className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={model} onChange={(e)=>setModel(e.target.value)} />
              <input type="date" placeholder="Original Purchase Date" className="border rounded-md px-3 py-2 bg-background text-foreground"
                value={purchaseDate} onChange={(e)=>setPurchaseDate(e.target.value)} />
            </div>
            <textarea placeholder="Reason for Selling (optional)" className="w-full border rounded-md px-3 py-2 bg-background text-foreground min-h-16"
              value={reasonForSelling} onChange={(e)=>setReasonForSelling(e.target.value)} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={warranty} onChange={(e)=>setWarranty(e.target.checked)} />
              Still Under Warranty
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={shippingAvailable} onChange={(e)=>setShippingAvailable(e.target.checked)} />
              Shipping Available
            </label>
          </div>
        )}

        {category === "match" && (
          <div className="space-y-3 mb-4 p-4 border rounded-lg bg-muted/30">
            <h3 className="text-sm font-semibold mb-2">💝 Match Profile</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Your Name *</label>
              <input 
                placeholder="Your name" 
                className={`w-full border rounded-md px-3 py-2 bg-background text-foreground ${errors.matchName ? 'border-red-500' : ''}`}
                value={matchName} 
                onChange={(e)=>{setMatchName(e.target.value); setErrors({...errors, matchName: ""});}}
              />
              {errors.matchName && <p className="text-red-500 text-xs mt-1">{errors.matchName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">About You *</label>
              <textarea 
                placeholder="Tell us about yourself..." 
                className={`w-full border rounded-md px-3 py-2 bg-background text-foreground min-h-20 ${errors.matchBio ? 'border-red-500' : ''}`}
                value={matchBio} 
                onChange={(e)=>{setMatchBio(e.target.value); setErrors({...errors, matchBio: ""});}}
                rows={4}
              />
              {errors.matchBio && <p className="text-red-500 text-xs mt-1">{errors.matchBio}</p>}
            </div>

            {/* Dynamically render all match questions */}
            {matchQuestions.length > 0 && (
              <div className="space-y-3 pt-3 border-t">
                <h4 className="text-sm font-semibold">Answer Questions for Better Matching</h4>
                {matchQuestions.map((q) => (
                  <div key={q.id}>
                    <label className="block text-sm font-medium mb-1">
                      {q.question_text} {q.is_required && '*'}
                    </label>
                    {q.choices && (q.choices as any).length > 0 ? (
                      <select
                        className={`w-full border rounded-md px-3 py-2 bg-background text-foreground ${q.is_required && !matchAnswers[q.id] ? 'border-amber-300' : ''}`}
                        value={matchAnswers[q.id] || ''}
                        onChange={(e) => setMatchAnswers({ ...matchAnswers, [q.id]: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {((q.choices as any) || []).map((choice: string) => (
                          <option key={choice} value={choice}>
                            {choice}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className={`w-full border rounded-md px-3 py-2 bg-background text-foreground ${q.is_required && !matchAnswers[q.id] ? 'border-amber-300' : ''}`}
                        value={matchAnswers[q.id] || ''}
                        onChange={(e) => setMatchAnswers({ ...matchAnswers, [q.id]: e.target.value })}
                        placeholder="Your answer..."
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Street Address - moved above city */}
        <input 
          className="border rounded-md px-3 py-2 mb-3 w-full bg-background text-foreground" 
          placeholder="Street Address (optional - helps with map location)"
          value={streetAddress} 
          onChange={(e)=>setStreetAddress(e.target.value)}
          onBlur={handleAddressBlur}
          list="street-suggestions"
        />
        <datalist id="street-suggestions">
          <option value="123 Main St" />
          <option value="456 Oak Avenue" />
          <option value="789 Pine Street" />
          <option value="321 Elm Drive" />
        </datalist>
        
        {/* Show current coordinates if available */}
        {(lat && lng) && (
          <div className="text-xs bg-green-50 border border-green-200 rounded p-2 mb-2 flex items-center gap-1">
            <span className="text-green-700">📍 Map location found: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
            <button 
              type="button" 
              onClick={() => {setLat(undefined); setLng(undefined); toast.info("Location cleared");}} 
              className="text-red-500 hover:text-red-700 ml-1"
              title="Clear location"
            >
              ✕
            </button>
          </div>
        )}

        {/* Location help text */}
        {(!lat || !lng) && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2 mb-2">
            💡 <strong>Tip:</strong> Add your street address and city to make your listing visible on the map view
          </div>
        )}

        {/* City & Country */}
        <div className="grid grid-cols-2 gap-3 mb-1">
          <div className="relative">
            <label className="block text-sm font-medium mb-1">City *</label>
            <input 
              className={`border rounded-md px-3 py-2 bg-background text-foreground w-full ${errors.currentCity ? 'border-red-500' : ''}`}
              placeholder="City"
              value={currentCity} 
              onChange={(e)=>{setCurrentCity(e.target.value); setErrors({...errors, currentCity: ""});}}
              onBlur={handleCityBlur}
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