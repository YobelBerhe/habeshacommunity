-- Add new match questions that don't duplicate existing ones

-- Lifestyle section questions
INSERT INTO public.match_questions (section, question_text, choices, weight, is_required) VALUES
('lifestyle', 'What type of relationship are you seeking?', '["Casual dating","Serious relationship","Marriage","Friendship first"]', 3, true),
('lifestyle', 'How do you spend your free time?', '["Sports/fitness","Arts/culture","Social activities","Quiet hobbies"]', 1, false),
('lifestyle', 'How often do you visit family back home?', '["Every year","Every 2-3 years","Rarely","Never"]', 2, false),
('lifestyle', 'Do you prefer fasting traditions?', '["Strictly observe","Sometimes","Rarely","Not applicable"]', 1, false),
('lifestyle', 'How important is financial transparency in a relationship?', '["Very important","Somewhat","Not important"]', 2, false),
('lifestyle', 'How do you split chores at home?', '["Traditional roles","Shared","Flexible/depends"]', 2, false),
('lifestyle', 'Religious observance level?', '["High","Medium","Low","None"]', 2, false),
('lifestyle', 'Social media usage?', '["Heavy","Moderate","Light","Prefer offline"]', 1, false),
('lifestyle', 'Do you like community events (weddings/mahabers)?', '["Love them","Sometimes","Rarely"]', 1, false),
('lifestyle', 'Alcohol at home?', '["Not allowed","Allowed occasionally","No restrictions"]', 1, false),
('lifestyle', 'Expectations around hosting guests?', '["Often","Sometimes","Rarely"]', 1, false),
('lifestyle', 'How do you feel about pets in the home?', '["Love pets","Maybe later","No pets"]', 1, false),
('lifestyle', 'Preferred celebration of holidays?', '["Traditional","Modern","Mix"]', 1, false),
('lifestyle', 'Comfort with extended family advice in decisions?', '["Comfortable","Depends","Prefer just us"]', 2, false);

-- Partner preferences section
INSERT INTO public.match_questions (section, question_text, choices, weight, is_required) VALUES
('partner_prefs', 'Do you prefer partner from same ethnic background?', '["Prefer same","Open","No preference"]', 2, false),
('partner_prefs', 'Do you want to live near extended family?', '["Yes","Maybe","No"]', 2, false),
('partner_prefs', 'How important is higher education?', '["Very","Somewhat","Not important"]', 1, false),
('partner_prefs', 'Languages you want your kids to learn?', '["Tigrinya","Amharic","English","Multiple"]', 2, false);

-- Core profile section
INSERT INTO public.match_questions (section, question_text, choices, weight, is_required) VALUES
('core_profile', 'What is your ideal living situation?', '["City center","Suburbs","Small town","Rural area"]', 1, false),
('core_profile', 'Openness to entrepreneurship risk?', '["High","Medium","Low"]', 1, false),
('core_profile', 'Savings vs. giving/remittances?', '["Save first","Balanced","Give first"]', 2, false);