-- Fix function search_path security warnings

DROP TRIGGER IF EXISTS churches_search_vector_update ON churches;
DROP TRIGGER IF EXISTS churches_location_update ON churches;
DROP FUNCTION IF EXISTS update_church_search_vector();
DROP FUNCTION IF EXISTS update_church_location();

-- Recreate with proper search_path
CREATE OR REPLACE FUNCTION update_church_search_vector()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.city, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$;

CREATE TRIGGER churches_search_vector_update
BEFORE INSERT OR UPDATE ON churches
FOR EACH ROW EXECUTE FUNCTION update_church_search_vector();

CREATE OR REPLACE FUNCTION update_church_location()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER churches_location_update
BEFORE INSERT OR UPDATE ON churches
FOR EACH ROW EXECUTE FUNCTION update_church_location();