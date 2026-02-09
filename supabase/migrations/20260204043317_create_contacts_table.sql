/*
  # NUTTERX VCF SYSTEM - Contacts Table

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key) - Unique identifier for each contact
      - `phone_number` (text, unique) - Phone number (unique to prevent duplicates)
      - `created_at` (timestamptz) - Timestamp when the contact was created
      
  2. Security
    - Enable RLS on `contacts` table
    - Add policy to allow anyone to read contacts (to get count and generate VCF)
    - Add policy to allow anyone to insert contacts (public submission)
    
  3. Important Notes
    - Phone numbers must be unique to prevent duplicates
    - The system collects exactly 250 phone numbers
    - Public access is required since no authentication is used
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read contacts"
  ON contacts
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);