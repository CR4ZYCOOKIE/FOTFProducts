/*
  # Create admin user
  
  1. Create the admin user with provided credentials:
    - Username: FOTFAdminDev
    - Password: FOTFAdmin1970!@!
    - Admin flag: true
*/

-- First enable the necessary extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert the admin user directly into auth.users
-- Note: This is a special case for initialization
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at,
  is_anonymous
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com', -- We still need an email for compatibility
  jsonb_build_object('username', 'FOTFAdminDev'),
  now(),
  now(),
  now(),
  false
)
ON CONFLICT DO NOTHING;

-- Get the user ID we just created
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE raw_user_meta_data->>'username' = 'FOTFAdminDev';
  
  -- Set the user's password
  UPDATE auth.users
  SET encrypted_password = crypt('FOTFAdmin1970!@!', gen_salt('bf'))
  WHERE id = admin_user_id;
  
  -- Ensure the user has a profile with admin privileges
  INSERT INTO public.profiles (id, username, is_admin)
  VALUES (admin_user_id, 'FOTFAdminDev', true)
  ON CONFLICT (id) DO UPDATE
  SET is_admin = true, username = 'FOTFAdminDev';
END $$;

-- Check the structure of the profiles table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check for locks on the profiles table
SELECT relation::regclass, mode, granted
FROM pg_locks l
JOIN pg_class c ON c.oid = l.relation
WHERE c.relname = 'profiles';

-- Complete the check for the profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check if admin user exists in auth.users
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE raw_user_meta_data->>'username' = 'FOTFAdminDev';

-- Check if admin profile exists
SELECT id, username, is_admin 
FROM public.profiles 
WHERE username = 'FOTFAdminDev';

-- Check RLS policies on profiles
SELECT * FROM pg_policies 
WHERE tablename = 'profiles';

-- Ensure email is optional
DO $$
BEGIN
  -- Make email optional if it's not already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'email' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.profiles ALTER COLUMN email DROP NOT NULL;
    RAISE NOTICE 'Made email column optional';
  END IF;
END $$;

-- Test the query that's causing the 500 error
SELECT id FROM public.profiles WHERE username = 'FOTFAdminDev'; 