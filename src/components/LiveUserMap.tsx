import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LiveUserMapProps {
  className?: string;
}

interface CityPresence {
  city: string;
  count: number;
  lat?: number;
  lng?: number;
}

export default function LiveUserMap({ className = "" }: LiveUserMapProps) {
  const [cities, setCities] = useState<CityPresence[]>([]);
  const [loading, setLoading] = useState(true);

  // City coordinates for major cities (you can expand this)
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    'Asmara': { lat: 15.3389, lng: 38.9327 },
    'Addis Ababa': { lat: 9.0300, lng: 38.7400 },
    'Oakland': { lat: 37.8044, lng: -122.2712 },
    'Frankfurt': { lat: 50.1109, lng: 8.6821 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'New York': { lat: 40.7128, lng: -74.0060 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'Washington': { lat: 38.9072, lng: -77.0369 },
    'Toronto': { lat: 43.6532, lng: -79.3832 },
    'Stockholm': { lat: 59.3293, lng: 18.0686 },
    'Amsterdam': { lat: 52.3676, lng: 4.9041 },
    'Berlin': { lat: 52.5200, lng: 13.4050 },
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Rome': { lat: 41.9028, lng: 12.4964 },
    'Madrid': { lat: 40.4168, lng: -3.7038 },
    'Oslo': { lat: 59.9139, lng: 10.7522 },
    'Helsinki': { lat: 60.1699, lng: 24.9384 },
    'Copenhagen': { lat: 55.6761, lng: 12.5683 },
    'Dublin': { lat: 53.3498, lng: -6.2603 },
    'Brussels': { lat: 50.8503, lng: 4.3517 },
    'Zurich': { lat: 47.3769, lng: 8.5417 },
    'Vienna': { lat: 48.2082, lng: 16.3738 },
    'Prague': { lat: 50.0755, lng: 14.4378 },
    'Warsaw': { lat: 52.2297, lng: 21.0122 },
    'Budapest': { lat: 47.4979, lng: 19.0402 },
    'Bucharest': { lat: 44.4268, lng: 26.1025 },
    'Sofia': { lat: 42.6977, lng: 23.3219 },
    'Athens': { lat: 37.9838, lng: 23.7275 },
    'Istanbul': { lat: 41.0082, lng: 28.9784 },
    'Cairo': { lat: 30.0444, lng: 31.2357 },
    'Tel Aviv': { lat: 32.0853, lng: 34.7818 },
    'Dubai': { lat: 25.2048, lng: 55.2708 },
    'Riyadh': { lat: 24.7136, lng: 46.6753 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Delhi': { lat: 28.7041, lng: 77.1025 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Seoul': { lat: 37.5665, lng: 126.9780 },
    'Beijing': { lat: 39.9042, lng: 116.4074 },
    'Shanghai': { lat: 31.2304, lng: 121.4737 },
    'Sydney': { lat: -33.8688, lng: 151.2093 },
    'Melbourne': { lat: -37.8136, lng: 144.9631 },
    'Auckland': { lat: -36.8485, lng: 174.7633 },
    'Vancouver': { lat: 49.2827, lng: -123.1207 },
    'Montreal': { lat: 45.5017, lng: -73.5673 },
    'Calgary': { lat: 51.0447, lng: -114.0719 },
    'Ottawa': { lat: 45.4215, lng: -75.6972 },
    'Boston': { lat: 42.3601, lng: -71.0589 },
    'Chicago': { lat: 41.8781, lng: -87.6298 },
    'Houston': { lat: 29.7604, lng: -95.3698 },
    'Phoenix': { lat: 33.4484, lng: -112.0740 },
    'Philadelphia': { lat: 39.9526, lng: -75.1652 },
    'San Antonio': { lat: 29.4241, lng: -98.4936 },
    'San Diego': { lat: 32.7157, lng: -117.1611 },
    'Dallas': { lat: 32.7767, lng: -96.7970 },
    'San Jose': { lat: 37.3382, lng: -121.8863 },
    'Austin': { lat: 30.2672, lng: -97.7431 },
    'Jacksonville': { lat: 30.3322, lng: -81.6557 },
    'Fort Worth': { lat: 32.7555, lng: -97.3308 },
    'Columbus_OH': { lat: 39.9612, lng: -82.9988 },
    'Charlotte': { lat: 35.2271, lng: -80.8431 },
    'San Francisco': { lat: 37.7749, lng: -122.4194 },
    'Indianapolis': { lat: 39.7684, lng: -86.1581 },
    'Seattle': { lat: 47.6062, lng: -122.3321 },
    'Denver': { lat: 39.7392, lng: -104.9903 },
    'Nashville': { lat: 36.1627, lng: -86.7816 },
    'Oklahoma City': { lat: 35.4676, lng: -97.5164 },
    'Las Vegas': { lat: 36.1699, lng: -115.1398 },
    'Portland': { lat: 45.5152, lng: -122.6784 },
    'Memphis': { lat: 35.1495, lng: -90.0490 },
    'Louisville': { lat: 38.2527, lng: -85.7585 },
    'Baltimore': { lat: 39.2904, lng: -76.6122 },
    'Milwaukee': { lat: 43.0389, lng: -87.9065 },
    'Albuquerque': { lat: 35.0844, lng: -106.6504 },
    'Tucson': { lat: 32.2226, lng: -110.9747 },
    'Fresno': { lat: 36.7378, lng: -119.7871 },
    'Sacramento': { lat: 38.5816, lng: -121.4944 },
    'Mesa': { lat: 33.4152, lng: -111.8315 },
    'Kansas_City_MO': { lat: 39.0997, lng: -94.5786 },
    'Atlanta': { lat: 33.7490, lng: -84.3880 },
    'Colorado Springs': { lat: 38.8339, lng: -104.8214 },
    'Omaha': { lat: 41.2565, lng: -95.9345 },
    'Raleigh': { lat: 35.7796, lng: -78.6382 },
    'Miami': { lat: 25.7617, lng: -80.1918 },
    'Cleveland': { lat: 41.4993, lng: -81.6944 },
    'Tulsa': { lat: 36.1540, lng: -95.9928 },
    'Oakland_CA': { lat: 37.8044, lng: -122.2712 },
    'Minneapolis': { lat: 44.9778, lng: -93.2650 },
    'Wichita': { lat: 37.6872, lng: -97.3301 },
    'Arlington': { lat: 32.7357, lng: -97.1081 },
    'Bakersfield': { lat: 35.3733, lng: -119.0187 },
    'New Orleans': { lat: 29.9511, lng: -90.0715 },
    'Honolulu': { lat: 21.3099, lng: -157.8581 },
    'Anaheim': { lat: 33.8366, lng: -117.9143 },
    'Tampa': { lat: 27.9506, lng: -82.4572 },
    'Aurora_CO': { lat: 39.7294, lng: -104.8319 },
    'Santa Ana': { lat: 33.7455, lng: -117.8677 },
    'St. Louis': { lat: 38.6270, lng: -90.1994 },
    'Riverside': { lat: 33.9533, lng: -117.3962 },
    'Corpus Christi': { lat: 27.8006, lng: -97.3964 },
    'Lexington': { lat: 38.0406, lng: -84.5037 },
    'Pittsburgh': { lat: 40.4406, lng: -79.9959 },
    'Anchorage': { lat: 61.2181, lng: -149.9003 },
    'Stockton': { lat: 37.9577, lng: -121.2908 },
    'Cincinnati': { lat: 39.1031, lng: -84.5120 },
    'St. Paul': { lat: 44.9537, lng: -93.0900 },
    'Toledo': { lat: 41.6528, lng: -83.5379 },
    'Greensboro': { lat: 36.0726, lng: -79.7920 },
    'Newark': { lat: 40.7357, lng: -74.1724 },
    'Plano': { lat: 33.0198, lng: -96.6989 },
    'Henderson': { lat: 36.0395, lng: -114.9817 },
    'Lincoln': { lat: 40.8136, lng: -96.7026 },
    'Buffalo': { lat: 42.8864, lng: -78.8784 },
    'Jersey City': { lat: 40.7178, lng: -74.0431 },
    'Chula Vista': { lat: 32.6401, lng: -117.0842 },
    'Fort Wayne': { lat: 41.0793, lng: -85.1394 },
    'Orlando': { lat: 28.5383, lng: -81.3792 },
    'St. Petersburg': { lat: 27.7676, lng: -82.6403 },
    'Chandler': { lat: 33.3062, lng: -111.8413 },
    'Laredo': { lat: 27.5306, lng: -99.4803 },
    'Norfolk': { lat: 36.8468, lng: -76.2852 },
    'Durham': { lat: 35.9940, lng: -78.8986 },
    'Madison': { lat: 43.0731, lng: -89.4012 },
    'Lubbock': { lat: 33.5779, lng: -101.8552 },
    'Irvine': { lat: 33.6846, lng: -117.8265 },
    'Winston-Salem': { lat: 36.0999, lng: -80.2442 },
    'Glendale_AZ': { lat: 33.5387, lng: -112.1860 },
    'Garland': { lat: 32.9126, lng: -96.6389 },
    'Hialeah': { lat: 25.8576, lng: -80.2781 },
    'Reno': { lat: 39.5296, lng: -119.8138 },
    'Chesapeake': { lat: 36.7682, lng: -76.2875 },
    'Gilbert': { lat: 33.3528, lng: -111.7890 },
    'Baton Rouge': { lat: 30.4515, lng: -91.1871 },
    'Irving': { lat: 32.8140, lng: -96.9489 },
    'Scottsdale': { lat: 33.4942, lng: -111.9261 },
    'North Las Vegas': { lat: 36.1989, lng: -115.1175 },
    'Fremont': { lat: 37.5485, lng: -121.9886 },
    'Boise': { lat: 43.6150, lng: -116.2023 },
    'Richmond': { lat: 37.5407, lng: -77.4360 },
    'San Bernardino': { lat: 34.1083, lng: -117.2898 },
    'Birmingham': { lat: 33.5186, lng: -86.8104 },
    'Spokane': { lat: 47.6587, lng: -117.4260 },
    'Rochester': { lat: 43.1566, lng: -77.6088 },
    'Des Moines': { lat: 41.5868, lng: -93.6250 },
    'Modesto': { lat: 37.6391, lng: -120.9969 },
    'Fayetteville': { lat: 36.0626, lng: -94.1574 },
    'Tacoma': { lat: 47.2529, lng: -122.4443 },
    'Oxnard': { lat: 34.1975, lng: -119.1771 },
    'Fontana': { lat: 34.0922, lng: -117.4350 },
    'Columbus_GA': { lat: 32.4609, lng: -84.9877 },
    'Montgomery': { lat: 32.3668, lng: -86.3000 },
    'Moreno_Valley': { lat: 33.9425, lng: -117.2297 },
    'Shreveport': { lat: 32.5252, lng: -93.7502 },
    'Aurora_IL': { lat: 41.7606, lng: -88.3201 },
    'Yonkers': { lat: 40.9312, lng: -73.8988 },
    'Akron': { lat: 41.0814, lng: -81.5190 },
    'Huntington Beach': { lat: 33.6595, lng: -117.9988 },
    'Little Rock': { lat: 34.7465, lng: -92.2896 },
    'Augusta': { lat: 33.4734, lng: -82.0105 },
    'Amarillo': { lat: 35.2220, lng: -101.8313 },
    'Glendale_CA': { lat: 34.1425, lng: -118.2551 },
    'Mobile': { lat: 30.6954, lng: -88.0399 },
    'Grand Rapids': { lat: 42.9634, lng: -85.6681 },
    'Salt Lake City': { lat: 40.7608, lng: -111.8910 },
    'Tallahassee': { lat: 30.4518, lng: -84.27277 },
    'Huntsville': { lat: 34.7304, lng: -86.5861 },
    'Grand Prairie': { lat: 32.7460, lng: -96.9978 },
    'Knoxville': { lat: 35.9606, lng: -83.9207 },
    'Worcester': { lat: 42.2626, lng: -71.8023 },
    'Newport News': { lat: 37.0871, lng: -76.4730 },
    'Brownsville': { lat: 25.9018, lng: -97.4975 },
    'Overland Park': { lat: 38.9822, lng: -94.6708 },
    'Santa Clarita': { lat: 34.3917, lng: -118.5426 },
    'Providence': { lat: 41.8240, lng: -71.4128 },
    'Garden Grove': { lat: 33.7739, lng: -117.9415 },
    'Chattanooga': { lat: 35.0456, lng: -85.3097 },
    'Oceanside': { lat: 33.1959, lng: -117.3795 },
    'Jackson': { lat: 32.2988, lng: -90.1848 },
    'Fort Lauderdale': { lat: 26.1224, lng: -80.1373 },
    'Santa Rosa': { lat: 38.4404, lng: -122.7144 },
    'Rancho Cucamonga': { lat: 34.1064, lng: -117.5931 },
    'Port St. Lucie': { lat: 27.2939, lng: -80.3501 },
    'Tempe': { lat: 33.4255, lng: -111.9400 },
    'Ontario': { lat: 34.0633, lng: -117.6509 },
    'Vancouver_WA': { lat: 45.6387, lng: -122.6615 },
    'Cape Coral': { lat: 26.5629, lng: -81.9495 },
    'Sioux Falls': { lat: 43.5446, lng: -96.7311 },
    'Springfield_MO': { lat: 37.2153, lng: -93.2982 },
    'Peoria': { lat: 40.6936, lng: -89.5890 },
    'Pembroke Pines': { lat: 26.0079, lng: -80.3540 },
    'Elk Grove': { lat: 38.4088, lng: -121.3716 },
    'Corona': { lat: 33.8753, lng: -117.5664 },
    'Lancaster': { lat: 34.6868, lng: -118.1542 },
    'Eugene': { lat: 44.0521, lng: -123.0868 },
    'Palmdale': { lat: 34.5794, lng: -118.1165 },
    'Salinas': { lat: 36.6777, lng: -121.6555 },
    'Springfield_MA': { lat: 42.1015, lng: -72.5898 },
    'Pasadena_CA': { lat: 34.1478, lng: -118.1445 },
    'Fort Collins': { lat: 40.5853, lng: -105.0844 },
    'Hayward': { lat: 37.6688, lng: -122.0808 },
    'Pomona': { lat: 34.0552, lng: -117.7500 },
    'Cary': { lat: 35.7915, lng: -78.7811 },
    'Rockford': { lat: 42.2711, lng: -89.0940 },
    'Alexandria': { lat: 38.8048, lng: -77.0469 },
    'Escondido': { lat: 33.1192, lng: -117.0864 },
    'McKinney': { lat: 33.1972, lng: -96.6397 },
    'Kansas_City_KS': { lat: 39.1142, lng: -94.6275 },
    'Joliet': { lat: 41.5250, lng: -88.0817 },
    'Sunnyvale': { lat: 37.3688, lng: -122.0363 },
    'Torrance': { lat: 33.8358, lng: -118.3406 },
    'Bridgeport': { lat: 41.1865, lng: -73.1952 },
    'Lakewood': { lat: 39.7047, lng: -105.0814 },
    'Hollywood': { lat: 26.0112, lng: -80.1494 },
    'Paterson': { lat: 40.9168, lng: -74.1718 },
    'Naperville': { lat: 41.7508, lng: -88.1535 },
    'Syracuse': { lat: 43.0481, lng: -76.1474 },
    'Mesquite': { lat: 32.7668, lng: -96.5991 },
    'Dayton': { lat: 39.7589, lng: -84.1916 },
    'Savannah': { lat: 32.0835, lng: -81.0998 },
    'Clarksville': { lat: 36.5298, lng: -87.3595 },
    'Orange': { lat: 33.7879, lng: -117.8531 },
    'Pasadena_TX': { lat: 29.6911, lng: -95.2091 },
    'Fullerton': { lat: 33.8704, lng: -117.9243 },
    'Killeen': { lat: 31.1171, lng: -97.7278 },
    'Frisco': { lat: 33.1507, lng: -96.8236 },
    'Hampton': { lat: 37.0299, lng: -76.3452 },
    'McAllen': { lat: 26.2034, lng: -98.2300 },
    'Warren': { lat: 42.5148, lng: -83.0113 },
    'Bellevue': { lat: 47.6101, lng: -122.2015 },
    'West Valley City': { lat: 40.6916, lng: -112.0011 },
    'Columbia_SC': { lat: 34.0007, lng: -81.0348 },
    'Olathe': { lat: 38.8814, lng: -94.8191 },
    'Sterling Heights': { lat: 42.5803, lng: -83.0302 },
    'New Haven': { lat: 41.3083, lng: -72.9279 },
    'Miramar': { lat: 25.9873, lng: -80.2322 },
    'Waco': { lat: 31.5494, lng: -97.1467 },
    'Thousand Oaks': { lat: 34.1706, lng: -118.8376 },
    'Cedar Rapids': { lat: 41.9778, lng: -91.6656 },
    'Charleston': { lat: 32.7765, lng: -79.9311 },
    'Visalia': { lat: 36.3302, lng: -119.2921 },
    'Topeka': { lat: 39.0473, lng: -95.6890 },
    'Elizabeth': { lat: 40.6640, lng: -74.2107 },
    'Gainesville': { lat: 29.6516, lng: -82.3248 },
    'Thornton': { lat: 39.8681, lng: -104.9719 },
    'Roseville': { lat: 38.7521, lng: -121.2880 },
    'Carrollton': { lat: 32.9537, lng: -96.8903 },
    'Coral Springs': { lat: 26.2710, lng: -80.2706 },
    'Stamford': { lat: 41.0534, lng: -73.5387 },
    'Simi Valley': { lat: 34.2694, lng: -118.7815 },
    'Concord': { lat: 37.9780, lng: -122.0311 },
    'Hartford': { lat: 41.7658, lng: -72.6734 },
    'Kent': { lat: 47.3809, lng: -122.2348 },
    'Lafayette': { lat: 30.2241, lng: -92.0198 },
    'Midland': { lat: 31.9974, lng: -102.0779 },
    'Surprise': { lat: 33.6292, lng: -112.3679 },
    'Denton': { lat: 33.2148, lng: -97.1331 },
    'Victorville': { lat: 34.5362, lng: -117.2911 },
    'Evansville': { lat: 37.9716, lng: -87.5710 },
    'Santa Clara': { lat: 37.3541, lng: -121.9552 },
    'Abilene': { lat: 32.4487, lng: -99.7331 },
    'Athens_GA': { lat: 33.9519, lng: -83.3576 },
    'Vallejo': { lat: 38.1041, lng: -122.2566 },
    'Allentown': { lat: 40.6023, lng: -75.4714 },
    'Norman': { lat: 35.2226, lng: -97.4395 },
    'Beaumont': { lat: 30.0802, lng: -94.1266 },
    'Independence': { lat: 39.0911, lng: -94.4155 },
    'Murfreesboro': { lat: 35.8456, lng: -86.3903 },
    'Ann Arbor': { lat: 42.2808, lng: -83.7430 },
    'Springfield_IL': { lat: 39.7817, lng: -89.6501 },
    'Berkeley': { lat: 37.8715, lng: -122.2730 },
    'Peoria_AZ': { lat: 33.5806, lng: -112.2374 },
    'Provo': { lat: 40.2338, lng: -111.6585 },
    'El Monte': { lat: 34.0686, lng: -118.0276 },
    'Columbia_MO': { lat: 38.9517, lng: -92.3341 },
    'Lansing': { lat: 42.3314, lng: -84.5557 },
    'Fargo': { lat: 46.8772, lng: -96.7898 },
    'Downey': { lat: 33.9401, lng: -118.1332 },
    'Costa Mesa': { lat: 33.6411, lng: -117.9187 },
    'Wilmington': { lat: 34.2257, lng: -77.9447 },
    'Arvada': { lat: 39.8028, lng: -105.0875 },
    'Inglewood': { lat: 33.9617, lng: -118.3531 },
    'Miami Gardens': { lat: 25.9420, lng: -80.2456 },
    'Carlsbad': { lat: 33.1581, lng: -117.3506 },
    'Westminster': { lat: 39.8367, lng: -105.0372 },
    'Rochester_MN': { lat: 44.0121, lng: -92.4802 },
    'Odessa': { lat: 31.8457, lng: -102.3676 },
    'Manchester': { lat: 42.9956, lng: -71.4548 },
    'Elgin': { lat: 42.0354, lng: -88.2826 },
    'West Jordan': { lat: 40.6097, lng: -111.9391 },
    'Round Rock': { lat: 30.5083, lng: -97.6789 },
    'Clearwater': { lat: 27.9659, lng: -82.8001 },
    'Waterbury': { lat: 41.5581, lng: -73.0515 },
    'Gresham': { lat: 45.5001, lng: -122.4302 },
    'Fairfield': { lat: 38.2494, lng: -122.0400 },
    'Billings': { lat: 45.7833, lng: -108.5007 },
    'Lowell': { lat: 42.6334, lng: -71.3162 },
    'San Buenaventura': { lat: 34.2746, lng: -119.2290 },
    'Pueblo': { lat: 38.2544, lng: -104.6091 },
    'High Point': { lat: 35.9557, lng: -80.0053 },
    'West Covina': { lat: 34.0686, lng: -117.9390 },
    'Richmond_CA': { lat: 37.9358, lng: -122.3477 },
    'Murrieta': { lat: 33.5539, lng: -117.2139 },
    'Cambridge': { lat: 42.3736, lng: -71.1097 },
    'Antioch': { lat: 38.0049, lng: -121.8058 },
    'Temecula': { lat: 33.4936, lng: -117.1483 },
    'Norwalk': { lat: 33.9022, lng: -118.0817 },
    'Centennial': { lat: 39.5807, lng: -104.8769 },
    'Everett': { lat: 47.9790, lng: -122.2021 },
    'Palm Bay': { lat: 28.0345, lng: -80.5887 },
    'Wichita Falls': { lat: 33.9137, lng: -98.4934 },
    'Green Bay': { lat: 44.5133, lng: -88.0133 },
    'Daly City': { lat: 37.7058, lng: -122.4619 },
    'Burbank': { lat: 34.1808, lng: -118.3090 },
    'Richardson': { lat: 32.9483, lng: -96.7299 },
    'Pompano Beach': { lat: 26.2379, lng: -80.1248 },
    'North Charleston': { lat: 32.8546, lng: -79.9748 },
    'Broken Arrow': { lat: 36.0526, lng: -95.7969 },
    'Boulder': { lat: 40.0150, lng: -105.2705 },
    'West Palm Beach': { lat: 26.7153, lng: -80.0534 },
    'Santa Maria': { lat: 34.9530, lng: -120.4357 },
    'El Cajon': { lat: 32.7947, lng: -116.9625 },
    'Davenport': { lat: 41.5236, lng: -90.5776 },
    'Rialto': { lat: 34.1064, lng: -117.3703 },
    'Las Cruces': { lat: 32.3199, lng: -106.7637 },
    'San Mateo': { lat: 37.5630, lng: -122.3255 },
    'Lewisville': { lat: 33.0462, lng: -96.9942 },
    'South Bend': { lat: 41.6764, lng: -86.2520 },
    'Lakeland': { lat: 28.0395, lng: -81.9498 },
    'Erie': { lat: 42.1292, lng: -80.0851 },
    'Tyler': { lat: 32.3513, lng: -95.3011 },
    'Pearland': { lat: 29.5638, lng: -95.2861 },
    'College Station': { lat: 30.6280, lng: -96.3344 },
    'Kenosha': { lat: 42.5847, lng: -87.8212 },
    'Sandy Springs': { lat: 33.9304, lng: -84.3733 },
    'Clovis': { lat: 36.8253, lng: -119.7029 },
    'Flint': { lat: 43.0125, lng: -83.6875 },
    'Columbia_TN': { lat: 35.6145, lng: -87.0348 },
    'El_Paso': { lat: 31.7619, lng: -106.4850 },
    'Miami Beach': { lat: 25.7907, lng: -80.1300 },
    'Duluth': { lat: 46.7867, lng: -92.1005 },
    'Bellevue_NE': { lat: 41.1370, lng: -95.9145 },
    'St. Joseph': { lat: 39.7674, lng: -94.8467 },
    'Appleton': { lat: 44.2619, lng: -88.4154 },
    'Menifee': { lat: 33.6972, lng: -117.1853 },
    'Champaign': { lat: 40.1164, lng: -88.2434 },
    'Brockton': { lat: 42.0834, lng: -71.0184 },
    'Brooklyn Park': { lat: 45.0941, lng: -93.3563 },
    'Kennewick': { lat: 46.2112, lng: -119.1372 },
    'Renton': { lat: 47.4829, lng: -122.2171 },
    'Yakima': { lat: 46.6021, lng: -120.5059 },
    'Des Plaines': { lat: 42.0334, lng: -87.8834 },
    'St. George': { lat: 37.0965, lng: -113.5684 },
    'Wayne': { lat: 42.2814, lng: -83.2863 },
    'Warwick': { lat: 41.7001, lng: -71.4162 },
    'McKinney_Duplicate': { lat: 33.1972, lng: -96.6397 },
    'Sparks': { lat: 39.5349, lng: -119.7527 },
    'Lakewood_WA': { lat: 47.1717, lng: -122.5185 },
    'Southfield': { lat: 42.4734, lng: -83.2219 },
    'Rochester Hills': { lat: 42.6584, lng: -83.1499 },
    'Citrus Heights': { lat: 38.7071, lng: -121.2810 },
    'Redwood City': { lat: 37.4852, lng: -122.2364 }
  };

  useEffect(() => {
    const fetchPresenceData = async () => {
      try {
        // Fetch recent presence data (last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { data, error } = await supabase
          .from('presence')
          .select('city')
          .gte('last_seen', fiveMinutesAgo);

        if (error) throw error;

        // Count users per city
        const cityCount: Record<string, number> = {};
        data?.forEach(entry => {
          if (entry.city) {
            cityCount[entry.city] = (cityCount[entry.city] || 0) + 1;
          }
        });

        // Convert to array with coordinates
        const cityPresenceArray: CityPresence[] = Object.entries(cityCount).map(([city, count]) => ({
          city,
          count,
          ...cityCoordinates[city]
        })).filter(item => item.lat && item.lng); // Only include cities with known coordinates

        setCities(cityPresenceArray);
      } catch (error) {
        console.error('Error fetching presence data:', error);
        // Fallback to demo data
        setCities([
          { city: 'Asmara', count: 3, lat: 15.3389, lng: 38.9327 },
          { city: 'Oakland', count: 2, lat: 37.8044, lng: -122.2712 },
          { city: 'Frankfurt', count: 1, lat: 50.1109, lng: 8.6821 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPresenceData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchPresenceData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl overflow-hidden ${className}`}>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading live community...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-xl overflow-hidden ${className}`}>
      {/* World map SVG background */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        <svg viewBox="0 0 1000 500" className="w-full h-full">
          {/* Simplified world map paths */}
          <path
            d="M158 206c0-1 1-2 3-2 1 0 2 0 3 1l11 8c2 1 3 3 3 5v3c0 2-1 4-3 5l-11 8c-1 1-2 1-3 1-2 0-3-1-3-2v-27z"
            fill="currentColor"
            className="text-muted-foreground/40"
          />
          <path
            d="M200 180c15-8 35-5 45 8 8 10 5 25-8 30-10 4-22 2-30-5-12-10-15-25-7-33z"
            fill="currentColor"
            className="text-muted-foreground/40"
          />
          <path
            d="M300 150c25-12 55-8 70 12 12 15 8 38-12 45-15 6-33 3-45-8-18-15-23-38-13-49z"
            fill="currentColor"
            className="text-muted-foreground/40"
          />
          <path
            d="M500 120c35-15 75-10 95 15 15 20 10 50-15 60-20 8-45 4-60-10-25-20-30-50-20-65z"
            fill="currentColor"
            className="text-muted-foreground/40"
          />
          <path
            d="M700 200c20-10 45-6 55 10 8 12 6 30-10 35-12 4-26 2-35-6-15-12-18-30-10-39z"
            fill="currentColor"
            className="text-muted-foreground/40"
          />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 text-center">
        <h3 className="text-2xl font-bold mb-2">Live Community</h3>
        <p className="text-muted-foreground">
          {cities.reduce((total, city) => total + city.count, 0)} people active across {cities.length} cities
        </p>
      </div>

      {/* Breathing dots for each city */}
      <div className="relative z-10 h-64 overflow-hidden">
        {cities.map((city, index) => {
          // Convert lat/lng to approximate x/y position on the container
          const x = ((city.lng + 180) / 360) * 100; // Convert longitude to percentage
          const y = ((90 - city.lat) / 180) * 100; // Convert latitude to percentage

          return (
            <div
              key={city.city}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${Math.max(10, Math.min(90, x))}%`,
                top: `${Math.max(10, Math.min(90, y))}%`,
                animationDelay: `${index * 0.3}s`
              }}
            >
              {/* Breathing dot */}
              <div className="relative">
                <div 
                  className="w-3 h-3 bg-primary rounded-full animate-pulse"
                  style={{
                    animationDuration: '2s',
                    animationDelay: `${index * 0.2}s`
                  }}
                />
                {/* Expanding ring */}
                <div 
                  className="absolute inset-0 w-3 h-3 bg-primary/30 rounded-full animate-ping"
                  style={{
                    animationDuration: '3s',
                    animationDelay: `${index * 0.2}s`
                  }}
                />
                
                {/* City label */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium border">
                    {city.city}
                    <span className="text-primary ml-1">({city.count})</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="relative z-10 p-6 text-center text-sm text-muted-foreground">
        Real-time community activity • Updates every 30 seconds
      </div>
    </div>
  );
}