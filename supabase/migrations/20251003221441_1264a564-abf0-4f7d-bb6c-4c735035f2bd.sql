-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Add is_verified to mentors table
ALTER TABLE public.mentors
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Create mentor_verifications table
CREATE TABLE public.mentor_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  documents_url TEXT[],
  social_links TEXT[],
  bio_statement TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mentor_verifications ENABLE ROW LEVEL SECURITY;

-- RLS: Mentors can view their own verifications
CREATE POLICY "Mentors can view own verifications"
ON public.mentor_verifications
FOR SELECT
USING (
  mentor_id IN (
    SELECT id FROM public.mentors WHERE user_id = auth.uid()
  )
);

-- RLS: Mentors can submit their own verification
CREATE POLICY "Mentors can submit own verification"
ON public.mentor_verifications
FOR INSERT
WITH CHECK (
  mentor_id IN (
    SELECT id FROM public.mentors WHERE user_id = auth.uid()
  )
);

-- RLS: Admins can view all verifications
CREATE POLICY "Admins can view all verifications"
ON public.mentor_verifications
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Admins can update verifications
CREATE POLICY "Admins can update verifications"
ON public.mentor_verifications
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_mentor_verifications_updated_at
  BEFORE UPDATE ON public.mentor_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for faster lookups
CREATE INDEX idx_verifications_mentor ON public.mentor_verifications(mentor_id);
CREATE INDEX idx_verifications_status ON public.mentor_verifications(status);