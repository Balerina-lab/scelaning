ALTER TABLE booking_inquiries ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

CREATE POLICY "Users can view their own bookings"
  ON booking_inquiries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON booking_inquiries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
