-- Create referrals table
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  reward_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add credits and referral code to profiles
ALTER TABLE public.profiles 
ADD COLUMN credits_balance INTEGER DEFAULT 0,
ADD COLUMN referral_code TEXT UNIQUE;

-- Generate referral codes for existing profiles
UPDATE public.profiles 
SET referral_code = 'REF-' || UPPER(SUBSTRING(MD5(id::TEXT || RANDOM()::TEXT) FROM 1 FOR 8))
WHERE referral_code IS NULL;

-- Enable RLS on referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Users can view their own referrals (as referrer or referee)
CREATE POLICY "Users can view their own referrals"
ON public.referrals FOR SELECT
USING (auth.uid() = referrer_id OR auth.uid() = referee_id);

-- Admins can view all referrals
CREATE POLICY "Admins can view all referrals"
ON public.referrals FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to get top referrers
CREATE OR REPLACE FUNCTION public.top_referrers()
RETURNS TABLE(
  user_id UUID,
  display_name TEXT,
  email TEXT,
  total_referrals BIGINT,
  successful_referrals BIGINT,
  total_credits_earned BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.display_name,
    COALESCE((SELECT email FROM auth.users WHERE id = p.id), 'N/A') as email,
    COUNT(r.id) AS total_referrals,
    SUM(CASE WHEN r.reward_applied = true THEN 1 ELSE 0 END) AS successful_referrals,
    SUM(CASE WHEN r.reward_applied = true THEN 10 ELSE 0 END) AS total_credits_earned
  FROM public.referrals r
  JOIN public.profiles p ON r.referrer_id = p.id
  GROUP BY p.id
  ORDER BY successful_referrals DESC, total_referrals DESC
  LIMIT 10;
END;
$$;

-- Create trigger to generate referral code on profile creation
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := 'REF-' || UPPER(SUBSTRING(MD5(NEW.id::TEXT || RANDOM()::TEXT) FROM 1 FOR 8));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_referral_code
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.generate_referral_code();