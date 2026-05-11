-- COMPLETE SCHEMA FOR booking_inquiries
CREATE TABLE IF NOT EXISTS public.booking_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  service_type text DEFAULT 'general',
  rooms integer DEFAULT 1,
  area numeric DEFAULT 0,
  date date,
  time text DEFAULT '',
  special_requests text DEFAULT '',
  frequency text DEFAULT 'Samo enkrat',
  subscription_months integer,
  extras text[] DEFAULT '{}',
  property_image_url text,
  total_price numeric DEFAULT 0,
  status text DEFAULT 'V čakanju'
);

ALTER TABLE public.booking_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own bookings
CREATE POLICY "Users can insert their own bookings"
  ON public.booking_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON public.booking_inquiries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to update their own bookings
CREATE POLICY "Users can update their own bookings"
  ON public.booking_inquiries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- COMPLETE STORAGE BUCKET POLICIES
-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
-- Allow public access to view images
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );

-- Allow ANY authenticated user to upload an image
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'property-images' );
