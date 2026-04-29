-- ============================================================
-- Add is_sale column to products
-- Run this in the Supabase SQL Editor
-- ============================================================

ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_sale BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_products_is_sale ON products(is_sale) WHERE is_sale = true;
