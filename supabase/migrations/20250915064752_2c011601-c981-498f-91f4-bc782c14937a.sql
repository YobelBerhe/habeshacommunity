-- Add stripe_account_id to users table for Stripe Connect
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_account_id text;