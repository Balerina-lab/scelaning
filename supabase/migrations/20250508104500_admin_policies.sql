-- Allow authenticated users to view all bookings (for Admin panel purposes)
CREATE POLICY "Admins can view all bookings"
  ON booking_inquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update all bookings
CREATE POLICY "Admins can update all bookings"
  ON booking_inquiries
  FOR UPDATE
  TO authenticated
  USING (true);
