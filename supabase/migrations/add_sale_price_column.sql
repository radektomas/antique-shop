-- ============================================================
-- Add sale_price column to products
-- Run this in the Supabase SQL Editor
-- ============================================================

ALTER TABLE products
ADD COLUMN IF NOT EXISTS sale_price NUMERIC(10, 2);

-- Postgres does not support ADD CONSTRAINT IF NOT EXISTS,
-- so guard the constraint with a DO block (idempotent re-runs).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sale_price_lower_than_price'
  ) THEN
    ALTER TABLE products
    ADD CONSTRAINT sale_price_lower_than_price
    CHECK (sale_price IS NULL OR sale_price < price);
  END IF;
END $$;
