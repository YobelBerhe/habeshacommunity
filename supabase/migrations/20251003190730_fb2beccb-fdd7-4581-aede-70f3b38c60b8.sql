-- Create function to calculate compatibility score between two users
CREATE OR REPLACE FUNCTION public.calculate_match_score(
  viewer_id UUID,
  profile_user_id UUID
)
RETURNS TABLE(
  match_percent INTEGER,
  total_questions INTEGER,
  matched_questions INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_score NUMERIC := 0;
  total_weight NUMERIC := 0;
  match_count INTEGER := 0;
  question_count INTEGER := 0;
BEGIN
  -- Calculate compatibility based on common answered questions
  SELECT 
    COALESCE(SUM(
      CASE 
        -- Exact match: full weight
        WHEN a1.answer = a2.answer THEN q.weight
        -- Partial matches for specific questions
        WHEN q.question_text ILIKE '%maybe%' AND (a1.answer = 'Maybe' OR a2.answer = 'Maybe') THEN q.weight * 0.5
        WHEN q.question_text ILIKE '%any%' AND (a1.answer ILIKE '%any%' OR a2.answer ILIKE '%any%') THEN q.weight * 0.8
        WHEN q.question_text ILIKE '%open%' AND (a1.answer = 'Open' OR a2.answer = 'Open') THEN q.weight * 0.7
        ELSE 0
      END
    ), 0),
    COALESCE(SUM(q.weight), 1), -- Prevent division by zero
    COUNT(CASE WHEN a1.answer = a2.answer THEN 1 END),
    COUNT(*)
  INTO total_score, total_weight, match_count, question_count
  FROM user_answers a1
  INNER JOIN user_answers a2 
    ON a1.question_id = a2.question_id
  INNER JOIN match_questions q 
    ON a1.question_id = q.id
  WHERE a1.user_id = viewer_id
    AND a2.user_id = profile_user_id;

  -- Return results
  RETURN QUERY SELECT 
    CASE 
      WHEN total_weight > 0 THEN ROUND((total_score / total_weight) * 100)::INTEGER
      ELSE 0
    END AS match_percent,
    question_count AS total_questions,
    match_count AS matched_questions;
END;
$$;