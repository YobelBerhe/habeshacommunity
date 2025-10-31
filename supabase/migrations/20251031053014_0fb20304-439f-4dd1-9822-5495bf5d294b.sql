-- Fix security warnings for health functions
-- Set search_path for trigger functions

DROP FUNCTION IF EXISTS update_health_coach_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_health_coach_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER health_coaches_updated_at
  BEFORE UPDATE ON health_coaches
  FOR EACH ROW
  EXECUTE FUNCTION update_health_coach_updated_at();

DROP FUNCTION IF EXISTS update_health_booking_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION update_health_booking_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER health_bookings_updated_at
  BEFORE UPDATE ON health_coach_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_health_booking_updated_at();