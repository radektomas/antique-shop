-- ============================================================
-- Antique Shop — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT,
  price       NUMERIC     NOT NULL,
  category    TEXT        NOT NULL,
  images      TEXT[]      DEFAULT '{}',
  sold        BOOLEAN     DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  items            JSONB       NOT NULL,
  customer_name    TEXT        NOT NULL,
  customer_email   TEXT        NOT NULL,
  customer_phone   TEXT,
  customer_address TEXT        NOT NULL,
  payment_method   TEXT        NOT NULL,
  total_price      NUMERIC     NOT NULL,
  status           TEXT        DEFAULT 'nová',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders   ENABLE ROW LEVEL SECURITY;

-- Anyone can read products
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);

-- Service role handles writes (API routes use service key — no policy needed)

-- Anyone can insert an order (checkout)
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Storage
-- ============================================================
-- 1. Go to Supabase Dashboard → Storage → Create bucket
-- 2. Name: product-images
-- 3. Make it PUBLIC
-- 4. Add the following storage policy for uploads (service role uploads via API, so this is optional):
--    INSERT: authenticated users (or just use service role key in API route)
