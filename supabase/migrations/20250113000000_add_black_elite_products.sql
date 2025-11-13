/*
  # Add BLACK ELITE Vape Products and Flavors

  1. New Categories
    - Add separate categories for BLACK ELITE 8000 and BLACK ELITE 12000

  2. New Menu Items
    - BLACK ELITE 8000 (₱349) - 11 flavors
    - BLACK ELITE 12000 (₱379) - 13 flavors
    
  3. Features
    - Each flavor is a separate menu item for individual menu cards
    - Proper pricing for each product type
    - Detailed descriptions for each flavor
    - Available and ready for purchase
*/

-- First, add the separate categories for BLACK ELITE products
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('black-elite-8000', 'BLACK ELITE 8000', '💨', 5, true),
  ('black-elite-12000', 'BLACK ELITE 12000', '💨', 6, true)
ON CONFLICT (id) DO NOTHING;

-- Insert BLACK ELITE 8000 Flavors (₱349)
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url)
SELECT * FROM (VALUES
  ('BLACK ELITE 8000 - Watermelon Red Pulp', 'Refreshing watermelon flavor with red pulp essence. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 8000 - Grapes Trouble Purple', 'Bold purple grape flavor with a trouble twist. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 8000 - Lemon Cola Sparkle Squeeze', 'Zesty lemon cola with a sparkling squeeze sensation. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 8000 - Banana Ice Monkey', 'Cool banana ice flavor with a playful monkey twist. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 8000 - Strawberry Very Baguio', 'Sweet strawberry flavor inspired by Baguio freshness. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', true, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 8000 - Black Currant Black Wave', 'Intense black currant flavor with a wave of richness. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 8000 - Lychee Cheer Blast', 'Exotic lychee flavor with a cheerful blast of sweetness. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 8000 - Peach Pitch Perfect', 'Perfectly balanced peach flavor with pitch-perfect taste. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 8000 - Blueberry Blue Freeze', 'Cool blueberry flavor with a refreshing freeze effect. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 8000 - Mixed Berries Very More', 'Delicious mix of berries with extra flavor intensity. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 8000 - Yakult Bacteria Monster', 'Unique Yakult-inspired flavor with a monster twist. BLACK ELITE 8000 disposable vape device.', 349, 'black-elite-8000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png')
) AS v(name, description, base_price, category, popular, available, image_url)
WHERE NOT EXISTS (
  SELECT 1 FROM menu_items WHERE menu_items.name = v.name
);

-- Insert BLACK ELITE 12000 Flavors (₱379)
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url)
SELECT * FROM (VALUES
  ('BLACK ELITE 12000 - Watermelon Red Pulp', 'Refreshing watermelon flavor with red pulp essence. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Mango Yellow Summer', 'Tropical mango flavor bringing summer vibes. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', true, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Kool-Aid Rainbow Punch', 'Colorful rainbow punch flavor inspired by Kool-Aid. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Strawberry Very Baguio', 'Sweet strawberry flavor inspired by Baguio freshness. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', true, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Matcha Green Tokyo', 'Authentic matcha green tea flavor with Tokyo inspiration. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Yakult Bacteria Monster', 'Unique Yakult-inspired flavor with a monster twist. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Grapes Trouble Purple', 'Bold purple grape flavor with a trouble twist. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Mixedberries Very More', 'Delicious mix of berries with extra flavor intensity. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Green Apple Sweet Forest', 'Crisp green apple flavor with sweet forest notes. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Lemon Lime Yellow Green', 'Tangy lemon lime combination with yellow-green freshness. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Black Currant Black Wave', 'Intense black currant flavor with a wave of richness. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Banana Yellow Monkey', 'Cool banana flavor with a playful yellow monkey twist. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'),
  
  ('BLACK ELITE 12000 - Melon Round Melo', 'Sweet melon flavor with a round, mellow taste. BLACK ELITE 12000 disposable vape device with extended capacity.', 379, 'black-elite-12000', false, true, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png')
) AS v(name, description, base_price, category, popular, available, image_url)
WHERE NOT EXISTS (
  SELECT 1 FROM menu_items WHERE menu_items.name = v.name
);

