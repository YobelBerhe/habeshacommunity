-- Create reports table for listing reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL,
  reporter_id UUID NULL, -- can be anonymous
  reason TEXT NOT NULL,
  details TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policies for reports
CREATE POLICY "Anyone can create reports" 
ON public.reports 
FOR INSERT 
WITH CHECK (true);

-- Add index for better performance
CREATE INDEX idx_reports_listing_id ON public.reports(listing_id);
CREATE INDEX idx_reports_created_at ON public.reports(created_at);