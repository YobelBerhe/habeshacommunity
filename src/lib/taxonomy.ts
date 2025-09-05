// /lib/taxonomy.ts
export type CategoryKey = "housing" | "jobs" | "services" | "community" | "mentor" | "marketplace";
export type JobKind = "regular" | "gig";

export const TAXONOMY: Record<
  CategoryKey,
  { name: { en: string; ti: string }; sub: string[] }
> = {
  housing: {
    name: { en: "Housing / Rentals", ti: "መኖር ቦታ / ኪራይ" },
    sub: [
      "apartments",
      "housing_swap",
      "housing_wanted",
      "office_commercial",
      "parking_storage",
      "real_estate_for_sale",
      "rooms_shared",
      "sublets_temporary",
      "vacation_rentals",
    ],
  },
  jobs: {
    name: { en: "Jobs (+ Gigs)", ti: "ስራዎች (+ ግጥሚት)" },
    sub: [
      "accounting_finance","admin_office","arch_engineering","art_design",
      "biotech_science","business_mgmt","customer_service","education",
      "etc_misc","food_bev_hosp","general_labor","government",
      "human_resources","legal_paralegal","manufacturing",
      "marketing_pr_ad","medical_health","nonprofit_sector","real_estate",
      "retail_wholesale","sales_bizdev","salon_spa_fitness","security",
      "skilled_trade_craft","software_qa_dba","systems_network",
      "technical_support","transport","tv_film_video","web_info_design",
      "writing_editing",

      // gigs are appended here but we'll mark them jobKind="gig" in UI
      "gig_computer","gig_creative","gig_crew","gig_domestic",
      "gig_event","gig_labor","gig_talent","gig_writing"
    ],
  },
  services: {
    name: { en: "Services", ti: "ኣገልግሎታት" },
    sub: [
      "automotive","beauty","cell_mobile","computer","creative","cycle",
      "event","farm_garden","financial","health_wellness","household",
      "labor_move","legal","lessons","marine","pet","real_estate",
      "skilled_trade","small_business_ads","travel_vacation","write_edit_translate",
    ],
  },
  community: {
    name: { en: "Community", ti: "ማሕበራዊ" },
    sub: [
      "activities","artists","childcare","classes","events","general","groups",
      "local_news","lost_found","missed_connections","musicians","pets",
      "politics","rants_raves","rideshare","volunteers",
    ],
  },
  mentor: {
    name: { en: "Mentor", ti: "መሪሕ" },
    sub: [
      "language","health","career","tech","finance","immigration","business",
    ],
  },
  marketplace: {
    name: { en: "Marketplace", ti: "ዕዳጋ" },
    sub: [
      "electronics","furniture","vehicles","clothing","services","home_garden",
      "jobs_gigs","tickets",
    ],
  },
};

// Human labels for subcategories (keep keys stable; add more over time)
export const LABELS: Record<string, { en: string; ti: string }> = {
  apartments: { en: "apts / housing", ti: "ኣፓርትመንት / መኖር ቦታ" },
  rooms_shared: { en: "rooms / shared", ti: "ክፍሊ መኖር / ተካፋሊ" },
  sublets_temporary: { en: "sublets / temporary", ti: "ንጥፈት / ግዜያዊ" },
  vacation_rentals: { en: "vacation rentals", ti: "ኪራይ ናይ ዕረፍቲ" },
  real_estate_for_sale: { en: "real estate for sale", ti: "መኖር ቦታ ሽያጭ" },

  // jobs examples (add more as needed)
  accounting_finance: { en: "accounting + finance", ti: "ሒሳብ ንግዲ" },
  food_bev_hosp: { en: "food / bev / hospitality", ti: "መግቢ ንኣትና ኣቢል" },
  skilled_trade_craft: { en: "skilled trade / craft", ti: "እዋናዊ ስራሕ" },
  transport: { en: "transport", ti: "መጓዓዝ" },
  gig_labor: { en: "gigs — labor", ti: "ግጥሚት — ስራሕ" },
  gig_talent: { en: "gigs — talent", ti: "ግጥሚት — ብዝግባእ" },

  // services examples
  lessons: { en: "lessons", ti: "ትምህርቲ" },
  beauty: { en: "beauty", ti: "ምስጢር ግሩም" },
  legal: { en: "legal", ti: "ሕጋዊ" },

  // community examples
  volunteers: { en: "volunteers", ti: "በዓል ዘይኮርኦ" },
  events: { en: "events", ti: "ክስተታት" },

  // mentor examples
  language: { en: "language", ti: "ቋንቋ" },
  health: { en: "health", ti: "ጥዕና" },
  career: { en: "career", ti: "ሞያ" },
  tech: { en: "tech", ti: "ቴክኖሎጂ" },
  finance: { en: "finance", ti: "ገንዘብ" },
  immigration: { en: "immigration", ti: "ስደት" },
  business: { en: "business", ti: "ንግዲ" },

  // marketplace examples
  electronics: { en: "electronics", ti: "ኤለክትሮኒክስ" },
  furniture: { en: "furniture", ti: "ዕቁባት" },
  vehicles: { en: "vehicles", ti: "መኪናታት" },
  clothing: { en: "clothing", ti: "ክዳን" },
  home_garden: { en: "home & garden", ti: "ገዛ ኣትክልቲ" },
  jobs_gigs: { en: "jobs & gigs", ti: "ስራሕ ግጥሚት" },
  tickets: { en: "tickets", ti: "ሰነዳት" },
};

export function isGig(sub: string): boolean {
  return sub.startsWith("gig_");
}
