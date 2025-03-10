-- This script should be run in the Supabase SQL editor after applying all migrations

-- First create the necessary tables if they don't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text,
  username text UNIQUE,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create the admin view if it doesn't exist
CREATE VIEW IF NOT EXISTS admin_users AS
  SELECT id, is_admin AS is_super_admin
  FROM profiles
  WHERE is_admin = true;

-- Create the admin user
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if user already exists by username
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE raw_user_meta_data->>'username' = 'FOTFAdminDev';
  
  -- If user doesn't exist, create it
  IF admin_user_id IS NULL THEN
    -- Create user in auth.users
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at,
      is_sso_user
    )
    VALUES (
      'FOTFAdminDev@placeholder.com',
      crypt('FOTFAdmin1970!@!', gen_salt('bf')),
      now(),
      '{"username": "FOTFAdminDev"}'::jsonb,
      now(),
      now(),
      now(),
      false
    )
    RETURNING id INTO admin_user_id;
    
    -- Create profile for the admin user
    INSERT INTO profiles (id, username, is_admin)
    VALUES (admin_user_id, 'FOTFAdminDev', true);
    
    RAISE NOTICE 'Admin user created with ID: %', admin_user_id;
  ELSE
    -- Update existing user to be admin
    UPDATE profiles
    SET is_admin = true
    WHERE id = admin_user_id;
    
    RAISE NOTICE 'Existing user updated as admin with ID: %', admin_user_id;
  END IF;
END $$; 