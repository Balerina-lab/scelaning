-- Add new columns to booking_inquiries
ALTER TABLE public.booking_inquiries
ADD COLUMN IF NOT EXISTS frequency text DEFAULT 'Samo enkrat',
ADD COLUMN IF NOT EXISTS subscription_months integer,
ADD COLUMN IF NOT EXISTS extras text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS property_image_url text;

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'property-images' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'property-images' );
