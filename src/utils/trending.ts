// Placeholder data + utilities. Replace with Supabase queries later.

type RawItem = { id:string; title:string; img:string; href:string; meta?:string; city?:string; views:number; saves:number; updatedAt:number };

const seed = (overrides: Partial<RawItem> = {}): RawItem => ({
  id: Math.random().toString(36).slice(2),
  title: 'Nice sunny room in shared flat',
  img: 'https://images.unsplash.com/photo-1505692794403-34d4982dd733?q=80&w=1200&auto=format&fit=crop',
  href: '/l/demo',
  meta: '$1,200 • 1br • Oakland',
  city: 'Oakland',
  views: 50 + Math.floor(Math.random()*400),
  saves: 5 + Math.floor(Math.random()*60),
  updatedAt: Date.now() - Math.floor(Math.random()*86400000),
  ...overrides,
});

// pretend DB
const DB = {
  community: [seed({title:'Welcome event this weekend', meta:'Community • Oakland'}), seed({title:'Volunteers needed', city:'San Jose'})],
  marketplace: [seed({title:'Sofa - like new', meta:'$150 • Fremont'}), seed({title:'iPhone 14', meta:'$450 • San Leandro', city:'San Leandro'})],
  housing: [seed(), seed({city:'San Francisco', meta:'$2,950 • Studio • SF'})],
  jobs: [seed({title:'Caregiver (IHSS)', meta:'$22/hr • East Bay'}), seed({title:'Barista - PT', city:'Oakland'})],
};

const byCity = (arr: RawItem[], city?: string | null) =>
  (city ? arr.filter(i => i.city?.toLowerCase() === city.toLowerCase()) : arr)
    .sort((a,b)=> (b.views + b.saves*2) - (a.views + a.saves*2))
    .slice(0,12);

export const getUserCity = (): string | null => {
  // later: read from auth profile; for now localStorage
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hn_city');
};

const toCard = (i: RawItem) => ({ id:i.id, title:i.title, img:i.img, href:i.href, meta:i.meta });

export const getTrendingCommunity   = async (city?: string | null) => byCity(DB.community,   city).map(toCard);
export const getTrendingMarketplace = async (city?: string | null) => byCity(DB.marketplace, city).map(toCard);
export const getTrendingHousing     = async (city?: string | null) => byCity(DB.housing,     city).map(toCard);
export const getTrendingJobs        = async (city?: string | null) => byCity(DB.jobs,        city).map(toCard);