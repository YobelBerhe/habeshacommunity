-- Create helper to get or create DM thread between auth user and another user
CREATE OR REPLACE FUNCTION public.get_or_create_dm_thread(p_other_user uuid, p_user uuid DEFAULT auth.uid())
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_thread uuid;
BEGIN
  IF p_user IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT dt.id INTO v_thread
  FROM public.dm_threads dt
  JOIN public.dm_members m1 ON m1.thread_id = dt.id AND m1.user_id = p_user
  JOIN public.dm_members m2 ON m2.thread_id = dt.id AND m2.user_id = p_other_user
  LIMIT 1;

  IF v_thread IS NULL THEN
    INSERT INTO public.dm_threads DEFAULT VALUES RETURNING id INTO v_thread;
    INSERT INTO public.dm_members(thread_id, user_id) VALUES (v_thread, p_user), (v_thread, p_other_user);
  END IF;

  RETURN v_thread;
END;
$function$;