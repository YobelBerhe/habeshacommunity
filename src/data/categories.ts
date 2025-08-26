import { Category, JobSubcategory } from "@/types";

export const CATEGORIES: Category[] = [
  { id: "housing", name: "Housing & Rentals" },
  { id: "forsale", name: "For Sale" },
  { id: "jobs", name: "Jobs & Employment" },
  { id: "services", name: "Services" },
  { id: "community", name: "Community & Events" }
];

export const JOB_SUBCATEGORIES: JobSubcategory[] = [
  // Transportation
  { id: "transport_truck", name: "Truck Driver", category: "transport" },
  { id: "transport_rideshare", name: "Taxi / Uber / Lyft", category: "transport" },
  { id: "transport_bus", name: "Bus / Shuttle Driver", category: "transport" },
  { id: "transport_delivery", name: "Delivery (Amazon/UPS/DHL)", category: "transport" },
  { id: "transport_shipping", name: "Shipping / Maritime / Ground", category: "transport" },
  
  // Food & Hospitality
  { id: "food_restaurant", name: "Restaurant (cook/server/owner)", category: "food" },
  { id: "food_cafe_barista", name: "Café / Barista", category: "food" },
  { id: "food_catering", name: "Catering / Events", category: "food" },
  { id: "food_hotel", name: "Hotel (housekeeping/front desk)", category: "food" },
  { id: "food_bartender", name: "Bartender / Waitstaff", category: "food" },
  
  // Skilled Trades
  { id: "trade_mechanic", name: "Auto Mechanic / Body Shop", category: "trade" },
  { id: "trade_construction", name: "Construction (carpentry/painting)", category: "trade" },
  { id: "trade_electrician", name: "Electrician", category: "trade" },
  { id: "trade_plumbing", name: "Plumbing", category: "trade" },
  { id: "trade_welding", name: "Welding / Metal Work", category: "trade" },
  { id: "trade_cleaning", name: "Cleaning / Janitorial", category: "trade" },
  { id: "trade_moving", name: "Moving / Furniture Assembly", category: "trade" },
  { id: "trade_tailor", name: "Tailor / Sewing", category: "trade" },
  
  // Beauty & Personal Care
  { id: "beauty_barber", name: "Barber / Hair / Braids", category: "beauty" },
  { id: "beauty_nails_spa", name: "Nails / Spa / Esthetician", category: "beauty" },
  
  // Retail
  { id: "retail_shop", name: "Retail / Grocery / Mini-mart", category: "retail" },
  { id: "retail_resale", name: "Resale / Thrift / Used Goods", category: "retail" },
  
  // Healthcare
  { id: "health_caregiver", name: "Caregiver / Home Health Aide", category: "health" },
  { id: "health_cna", name: "Nursing Assistant (CNA)", category: "health" },
  { id: "health_dental", name: "Dental Assistant / Hygienist", category: "health" },
  { id: "health_tech", name: "Medical / Lab / Radiology Tech", category: "health" },
  { id: "health_nurse", name: "Nurse / Midwife / Pharmacist", category: "health" },
  { id: "health_doctor", name: "Doctor / Specialist", category: "health" },
  
  // Education & Childcare
  { id: "edu_teacher", name: "Teacher / TA", category: "education" },
  { id: "edu_tutor", name: "Tutor (Math/Language/Bible)", category: "education" },
  { id: "edu_childcare", name: "Childcare / Daycare / Babysitter", category: "education" },
  
  // Community & Social
  { id: "community_social", name: "Social Worker / Community Center", category: "community" },
  { id: "community_church", name: "Church / Pastor / Sunday School", category: "community" },
  
  // Technology
  { id: "tech_it", name: "IT Support / Help Desk / Data", category: "technology" },
  { id: "tech_software", name: "Software / Cybersecurity", category: "technology" },
  
  // Professional Services
  { id: "pro_accounting", name: "Accounting / Bookkeeping", category: "professional" },
  { id: "pro_business", name: "Business / Management", category: "professional" },
  { id: "pro_sales", name: "Sales / Customer Service", category: "professional" },
  { id: "pro_engineer", name: "Engineer (Civil/Electrical/Mech)", category: "professional" },
  { id: "pro_legal", name: "Legal / Paralegal / Lawyer", category: "professional" },
  
  // Creative
  { id: "creative_photo", name: "Photographer / Videographer", category: "creative" },
  { id: "creative_creator", name: "YouTuber / TikTok / Influencer", category: "creative" },
  { id: "creative_music", name: "Musician / DJ", category: "creative" },
  { id: "creative_design", name: "Graphic / Web / Designer", category: "creative" },
  { id: "creative_writer", name: "Writer / Translator", category: "creative" },
  
  // Government & Public Service
  { id: "gov_public", name: "Government / Postal / Admin", category: "government" },
  { id: "gov_security", name: "Police / Security / Military", category: "government" },
  
  // NGO & Agriculture
  { id: "ngo_humanitarian", name: "NGO / Humanitarian", category: "ngo" },
  { id: "agri_farm", name: "Farm / Seasonal / Vineyard / Dairy", category: "agriculture" }
];

export const getCategoryName = (categoryId: string): string => {
  const category = CATEGORIES.find(c => c.id === categoryId);
  return category ? category.name : categoryId;
};

export const getJobSubcategoryName = (subcategoryId: string): string => {
  const subcategory = JOB_SUBCATEGORIES.find(s => s.id === subcategoryId);
  return subcategory ? subcategory.name : subcategoryId;
};