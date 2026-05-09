-- 1. Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email varchar NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view profiles (Admin can see all, users can see their own)
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- 2. Create trigger to automatically insert into profiles on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (new.id, new.email, new.created_at);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid errors on multiple runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Populate existing users into profiles (if any exist)
INSERT INTO public.profiles (id, email, created_at)
SELECT id, email, created_at FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 4. Unify statuses in booking_inquiries to Slovenian
ALTER TABLE public.booking_inquiries ALTER COLUMN status SET DEFAULT 'V čakanju';

UPDATE public.booking_inquiries
SET status = CASE
  WHEN status = 'pending' THEN 'V čakanju'
  WHEN status = 'confirmed' THEN 'Potrjeno'
  WHEN status = 'rejected' THEN 'Zavrnjeno'
  WHEN status = 'cancelled' THEN 'Odpovedano'
  WHEN status = 'completed' THEN 'Zaključeno'
  ELSE status
END;

-- Update the schema default
ALTER TABLE public.booking_inquiries ALTER COLUMN status SET DEFAULT 'V čakanju';
