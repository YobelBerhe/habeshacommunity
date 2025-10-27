-- Create function to find nearby churches using PostGIS

CREATE OR REPLACE FUNCTION find_nearby_churches(
  lat DECIMAL,
  lng DECIMAL,
  radius INTEGER,
  result_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id INTEGER,
  name VARCHAR,
  slug VARCHAR,
  denomination_id INTEGER,
  country VARCHAR,
  country_code VARCHAR,
  state_province VARCHAR,
  city VARCHAR,
  address TEXT,
  postal_code VARCHAR,
  latitude DECIMAL,
  longitude DECIMAL,
  phone VARCHAR,
  email VARCHAR,
  website TEXT,
  languages TEXT[],
  primary_language VARCHAR,
  description TEXT,
  main_image_url TEXT,
  has_parking BOOLEAN,
  has_wheelchair_access BOOLEAN,
  has_sunday_school BOOLEAN,
  has_youth_ministry BOOLEAN,
  has_livestream BOOLEAN,
  view_count INTEGER,
  favorite_count INTEGER,
  rating_average DECIMAL,
  rating_count INTEGER,
  is_verified BOOLEAN,
  is_active BOOLEAN,
  distance_meters DOUBLE PRECISION,
  distance_km DOUBLE PRECISION
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id,
    c.name,
    c.slug,
    c.denomination_id,
    c.country,
    c.country_code,
    c.state_province,
    c.city,
    c.address,
    c.postal_code,
    c.latitude,
    c.longitude,
    c.phone,
    c.email,
    c.website,
    c.languages,
    c.primary_language,
    c.description,
    c.main_image_url,
    c.has_parking,
    c.has_wheelchair_access,
    c.has_sunday_school,
    c.has_youth_ministry,
    c.has_livestream,
    c.view_count,
    c.favorite_count,
    c.rating_average,
    c.rating_count,
    c.is_verified,
    c.is_active,
    ST_Distance(
      c.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) AS distance_meters,
    ST_Distance(
      c.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    ) / 1000 AS distance_km
  FROM churches c
  WHERE 
    c.is_active = true
    AND c.location IS NOT NULL
    AND ST_DWithin(
      c.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
      radius
    )
  ORDER BY distance_meters
  LIMIT result_limit;
$$;