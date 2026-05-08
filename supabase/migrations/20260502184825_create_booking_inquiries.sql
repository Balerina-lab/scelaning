/*
  # Create booking inquiries table

  1. New Tables
    - `booking_inquiries`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `name` (text) - client full name
      - `email` (text) - client email
      - `phone` (text) - client phone number
      - `address` (text) - service address
      - `rooms` (integer) - number of rooms
      - `sqft` (numeric) - square footage
      - `cleaning_type` (text) - type of cleaning (general, deep, move_out)
      - `preferred_date` (date) - requested service date
      - `preferred_time` (text) - requested time slot
      - `special_requests` (text) - additional notes
      - `estimated_price_min` (numeric) - estimated minimum price
      - `estimated_price_max` (numeric) - estimated maximum price
      - `status` (text) - inquiry status (pending, confirmed, completed)

  2. Security
    - Enable RLS on `booking_inquiries` table
    - Add policy for anyone to insert (public form submissions)
    - No select policy (admin access only via service role)
*/

CREATE TABLE IF NOT EXISTS booking_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  rooms integer DEFAULT 1,
  sqft numeric DEFAULT 0,
  cleaning_type text DEFAULT 'general',
  preferred_date date,
  preferred_time text DEFAULT '',
  special_requests text DEFAULT '',
  estimated_price_min numeric DEFAULT 0,
  estimated_price_max numeric DEFAULT 0,
  status text DEFAULT 'pending'
);

ALTER TABLE booking_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a booking inquiry"
  ON booking_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
