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