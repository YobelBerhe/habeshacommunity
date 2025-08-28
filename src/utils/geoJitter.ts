// Jitter a point within ~2–5 km for privacy
export function jitterAround(lat: number, lon: number): {lat:number; lon:number} {
  const km = 2 + Math.random()*3; // 2–5km
  const degPerKmLat = 1/110.574;
  const degPerKmLon = 1/(111.320 * Math.cos(lat * Math.PI/180));

  const dx = (Math.random()*2 - 1) * km * degPerKmLon;
  const dy = (Math.random()*2 - 1) * km * degPerKmLat;

  return { lat: lat + dy, lon: lon + dx };
}