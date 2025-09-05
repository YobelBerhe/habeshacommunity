-- Add helpful indexes for mentor booking performance
CREATE INDEX IF NOT EXISTS idx_mentor_bookings_mentor_status ON public.mentor_bookings (mentor_id, status);
CREATE INDEX IF NOT EXISTS idx_mentor_bookings_mentee_status ON public.mentor_bookings (mentee_id, status);

-- Add 20+ more match questions for better compatibility
INSERT INTO public.match_questions (text, choices, weight) VALUES
('How often do you visit family back home?', ARRAY['Every year','Every 2–3 years','Rarely','Never'], 2),
('Preferred wedding style?', ARRAY['Traditional','Mix traditional & modern','Modern'], 1),
('Do you prefer fasting traditions?', ARRAY['Strictly observe','Sometimes','Rarely','Not applicable'], 1),
('Typical weekday evening?', ARRAY['Family/home','Friends/community','Gym/outdoors','Study/side projects'], 1),
('How important is financial transparency in a relationship?', ARRAY['Very important','Somewhat','Not important'], 2),
('Approach to conflict with partner?', ARRAY['Discuss immediately','Wait & cool down','Prefer to avoid'], 1),
('How do you split chores at home?', ARRAY['Traditional roles','Shared','Flexible/depends'], 2),
('Do you prefer partner from same ethnic background?', ARRAY['Prefer same','Open','No preference'], 2),
('Do you want to live near extended family?', ARRAY['Yes','Maybe','No'], 2),
('Religious observance level?', ARRAY['High','Medium','Low','None'], 2),
('How important is higher education?', ARRAY['Very','Somewhat','Not important'], 1),
('Openness to entrepreneurship risk?', ARRAY['High','Medium','Low'], 1),
('Savings vs. giving/remittances?', ARRAY['Save first','Balanced','Give first'], 2),
('Social media usage?', ARRAY['Heavy','Moderate','Light','Prefer offline'], 1),
('Do you like community events (weddings/mahabers)?', ARRAY['Love them','Sometimes','Rarely'], 1),
('Alcohol at home?', ARRAY['Not allowed','Allowed occasionally','No restrictions'], 1),
('Expectations around hosting guests?', ARRAY['Often','Sometimes','Rarely'], 1),
('Do you want to relocate in the next 3–5 years?', ARRAY['Yes','Maybe','No'], 2),
('Work-life balance preference?', ARRAY['Career-first','Balanced','Family-first'], 1),
('How do you feel about pets in the home?', ARRAY['Love pets','Maybe later','No pets'], 1),
('Preferred celebration of holidays?', ARRAY['Traditional','Modern','Mix'], 1),
('Languages you want your kids to learn?', ARRAY['Tigrinya','Amharic','English','Other'], 2),
('Comfort with extended family advice in decisions?', ARRAY['Comfortable','Depends','Prefer just us'], 2)
ON CONFLICT DO NOTHING;