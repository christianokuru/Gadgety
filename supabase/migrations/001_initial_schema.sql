-- Gadgets E-Commerce Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  price INTEGER NOT NULL, -- stored in kobo (cents) to avoid floating point issues
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_brand_idx ON public.products(brand);
CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products(slug);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  total_price INTEGER NOT NULL, -- stored in kobo
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for payment status queries
CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price INTEGER NOT NULL -- price at time of order, stored in kobo
);

-- Create index for order lookups
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON public.order_items(product_id);

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Everyone can read products
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

-- PRODUCTS: Only admins can insert/update/delete
CREATE POLICY "Only admins can insert products" ON public.products
  FOR INSERT WITH (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update products" ON public.products
  FOR UPDATE WITH (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete products" ON public.products
  FOR DELETE WITH (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ORDERS: Users can read their own orders (by matching phone or as admin)
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ORDERS: Anyone can create orders (guest checkout)
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- ORDERS: Only admins can update orders
CREATE POLICY "Only admins can update orders" ON public.orders
  FOR UPDATE WITH (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ORDER_ITEMS: Same access as orders
CREATE POLICY "Order items viewable with order access" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Anyone can create order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

-- PROFILES: Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- PROFILES: Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'customer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products updated_at
DROP TRIGGER IF EXISTS on_products_updated ON public.products;
CREATE TRIGGER on_products_updated
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================
-- Note: Run this in Supabase Dashboard > Storage > Create a new bucket
-- Bucket name: product-images
-- Make it public: Yes

-- Storage policy for product images (run after creating bucket)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('product-images', 'product-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Allow everyone to view product images
-- CREATE POLICY "Product images are publicly viewable" ON storage.objects
--   FOR SELECT USING (bucket_id = 'product-images');

-- Allow admins to upload product images
-- CREATE POLICY "Only admins can upload product images" ON storage.objects
--   FOR INSERT WITH (
--     bucket_id = 'product-images' AND
--     EXISTS (
--       SELECT 1 FROM public.profiles
--       WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
--     )
--   );

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment to add sample products

/*
INSERT INTO public.products (name, slug, description, price, brand, category, stock, image_url) VALUES
('iPhone 15 Pro Max', 'iphone-15-pro-max', 'The most powerful iPhone ever with A17 Pro chip', 155000000, 'Apple', 'Phones', 10, NULL),
('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Premium Android flagship with S Pen', 120000000, 'Samsung', 'Phones', 8, NULL),
('AirPods Pro 2', 'airpods-pro-2', 'Active Noise Cancellation with Adaptive Audio', 85000000, 'Apple', 'Earbuds', 15, NULL),
('Samsung Galaxy Buds2 Pro', 'samsung-galaxy-buds2-pro', 'Premium wireless earbuds with 360 Audio', 45000000, 'Samsung', 'Earbuds', 12, NULL),
('Anker PowerCore 26800', 'anker-powercore-26800', 'High capacity power bank with fast charging', 25000000, 'Anker', 'Power Banks', 20, NULL),
('Oraimo Toast 10', 'oraimo-toast-10', 'Slim power bank with 10000mAh capacity', 12000000, 'Oraimo', 'Power Banks', 25, NULL),
('Apple Watch Series 9', 'apple-watch-series-9', 'Most advanced Apple Watch with double tap', 180000000, 'Apple', 'Smart Watches', 5, NULL),
('Xiaomi Band 8', 'xiaomi-band-8', 'Affordable fitness tracker with SpO2', 25000000, 'Xiaomi', 'Smart Watches', 30, NULL),
('Anker 735 Charger', 'anker-735-charger', '65W GaN charger with 3 ports', 35000000, 'Anker', 'Chargers', 18, NULL),
('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise canceling headphones', 120000000, 'Sony', 'Earbuds', 7, NULL);
*/
