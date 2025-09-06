interface CountryFlagProps {
  country: string;
  className?: string;
}

// Country code mapping for common countries
const countryCodeMap: Record<string, string> = {
  'Ethiopia': 'ET',
  'United States': 'US',
  'Canada': 'CA',
  'United Kingdom': 'GB',
  'Germany': 'DE',
  'France': 'FR',
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Australia': 'AU',
  'Japan': 'JP',
  'China': 'CN',
  'India': 'IN',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'Argentina': 'AR',
  'South Africa': 'ZA',
  'Nigeria': 'NG',
  'Kenya': 'KE',
  'UAE': 'AE',
  'Saudi Arabia': 'SA',
  'Turkey': 'TR',
  'Russia': 'RU',
  'Poland': 'PL',
  'Czech Republic': 'CZ',
  'Hungary': 'HU',
  'Romania': 'RO',
  'Bulgaria': 'BG',
  'Greece': 'GR',
  'Portugal': 'PT',
  'Austria': 'AT',
  'Switzerland': 'CH',
  'Belgium': 'BE',
  'Ireland': 'IE',
  'Israel': 'IL',
  'Egypt': 'EG',
  'Morocco': 'MA',
  'Tunisia': 'TN',
  'Algeria': 'DZ',
  'Ghana': 'GH',
  'Uganda': 'UG',
  'Tanzania': 'TZ',
  'Rwanda': 'RW',
  'Cameroon': 'CM',
  'Senegal': 'SN',
  'Mali': 'ML',
  'Burkina Faso': 'BF',
  'Niger': 'NE',
  'Chad': 'TD',
  'Sudan': 'SD',
  'Somalia': 'SO',
  'Djibouti': 'DJ',
  'Eritrea': 'ER'
};

export default function CountryFlag({ country, className = "w-4 h-3" }: CountryFlagProps) {
  if (!country) return null;
  
  const countryCode = countryCodeMap[country] || country.slice(0, 2).toUpperCase();
  
  return (
    <img
      src={`https://flagcdn.com/${countryCode.toLowerCase()}.svg`}
      alt={`${country} flag`}
      className={`inline-block object-cover ${className}`}
      onError={(e) => {
        // Hide flag if image fails to load
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}