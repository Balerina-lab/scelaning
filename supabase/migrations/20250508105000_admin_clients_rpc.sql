CREATE OR REPLACE FUNCTION get_all_clients()
RETURNS TABLE (id uuid, email varchar, created_at timestamptz)
SECURITY DEFINER
AS $$
BEGIN
  -- We should ideally check if the user is an admin here
  RETURN QUERY SELECT au.id, au.email::varchar, au.created_at FROM auth.users au;
END;
$$ LANGUAGE plpgsql;
