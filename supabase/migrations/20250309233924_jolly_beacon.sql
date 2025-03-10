/*
  # Initial Schema Setup for DayZ Subscription Platform

  1. New Tables
    - `products`
      - Stores available subscription products
      - Contains name, description, price, features
    
    - `subscriptions`
      - Tracks active subscriptions
      - Links users, products, and payment status
      - Stores Discord usernames and renewal dates
    
    - `webhook_logs`
      - Audit trail for Discord webhook events
      - Tracks subscription events and notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  features jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id uuid REFERENCES products(id),
  discord_username text NOT NULL,
  stripe_subscription_id text,
  paypal_subscription_id text,
  status text NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Webhook logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id),
  event_type text NOT NULL,
  discord_username text NOT NULL,
  payload jsonb,
  sent_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can view webhook logs"
  ON webhook_logs FOR SELECT
  TO authenticated
  USING (true);