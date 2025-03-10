/*
  # Update authentication to use username instead of email
  
  1. Changes:
    - Alter profiles table:
      - Add username column (text)
      - Make email column optional
      - Add is_admin column (boolean)

  2. Security:
    - Update RLS policies to account for username-based authentication
*/

-- Alter the profiles table to add username and is_admin columns
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS username text UNIQUE,
  ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false,
  ALTER COLUMN email DROP NOT NULL;

-- Create an admin_users view
CREATE VIEW admin_users AS
  SELECT id, is_admin AS is_super_admin
  FROM profiles
  WHERE is_admin = true;

-- Create a function to create user profiles on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, is_admin)
  VALUES (new.id, new.raw_user_meta_data->>'username', false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a trigger to automatically create profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update profiles RLS policies
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_admin = true OR auth.uid() = id); 