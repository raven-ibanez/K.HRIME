/*
  # Add Clothing Items to Database

  1. New Category
    - Add "clothes" category for clothing items

  2. New Menu Items
    - Various t-shirts and clothing items based on uploaded images
    - All items priced at ₱299
    - Each item will need its image_url updated with the actual uploaded image URL
    
  3. Note
    - Image URLs are set to NULL initially
    - Update image_url for each item using the Admin Dashboard or run an UPDATE query
    - Image URLs should follow pattern: https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/{filename}
*/

-- First, add the clothes category
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
  ('clothes', 'Clothes', '👕', 7, true)
ON CONFLICT (id) DO NOTHING;

-- Insert Clothing Items (₱299 each)
-- NOTE: Update image_url values with your actual uploaded image URLs from Supabase Storage
INSERT INTO menu_items (name, description, base_price, category, popular, available, image_url)
SELECT * FROM (VALUES
  ('BAPE Ape Head Logo T-Shirt - White', 'Classic white t-shirt featuring the iconic BAPE ape head logo in reddish-brown on the back. Premium cotton fabric with crew neck design.', 299, 'clothes', false, true, NULL),
  
  ('BAPE Camo Star T-Shirt - White', 'White t-shirt with BAPE ape head and blue camouflage star design on the front. Bold streetwear style with iconic BAPE branding.', 299, 'clothes', true, true, NULL),
  
  ('Chrome Hearts Emblem T-Shirt - Dark Grey', 'Dark grey t-shirt featuring Chrome Hearts circular emblem with colorful crosses. Gothic-style branding with premium design.', 299, 'clothes', false, true, NULL),
  
  ('Organic Pattern T-Shirt - White', 'White t-shirt with unique organic thorny vine pattern on the back. Abstract natural design in green, brown, and tan colors.', 299, 'clothes', false, true, NULL),
  
  ('BAPE Green Camo Star T-Shirt - White', 'White t-shirt with BAPE ape head and green camouflage star design. Classic streetwear with torn star effect.', 299, 'clothes', true, true, NULL),
  
  ('Chrome Hearts Cross T-Shirt - White', 'White t-shirt with Chrome Hearts gothic text and cross design on the back. Alternating black, red, and blue lettering in circular arrangement.', 299, 'clothes', false, true, NULL),
  
  ('BAPE STA T-Shirt - Black', 'Black t-shirt featuring "BAPE STA" in blue and white camouflage pattern. Bold lettering with iconic BAPE branding.', 299, 'clothes', false, true, NULL),
  
  ('Chrome Hearts Banner T-Shirt - White', 'White t-shirt with Chrome Hearts green cross and banner design on the back. Gothic-style cross with scroll banner text.', 299, 'clothes', false, true, NULL),
  
  ('BAPE By Bathing Ape T-Shirt - White', 'White t-shirt with "BY BATHING APE®" text in blue camouflage pattern on the back. Wavy lettering effect with trademark symbol.', 299, 'clothes', false, true, NULL),
  
  ('Chrome Hearts Colorful Crosses T-Shirt - White', 'White t-shirt with Chrome Hearts circular emblem featuring colorful crosses (green, pink, yellow) and gothic text banner.', 299, 'clothes', false, true, NULL),
  
  ('Chrome Hearts Design T-Shirt - Black', 'Black t-shirt with Chrome Hearts design on the back. White circular outline with gothic text and colorful cross motifs.', 299, 'clothes', false, true, NULL),
  
  ('BAPE Japan Ape T-Shirt - Black', 'Black t-shirt with "JAPAN" and "APE" text featuring red ape head logo. Collegiate-style font with iconic BAPE branding.', 299, 'clothes', true, true, NULL),
  
  ('BAPE Camo Star Lightning T-Shirt - Black', 'Black t-shirt with blue camouflage star and lightning bolt design on the back. Dynamic streetwear design with BAPE branding.', 299, 'clothes', false, true, NULL),
  
  ('Chrome Hearts Crosses T-Shirt - White', 'White t-shirt with Chrome Hearts circular design featuring three colorful crosses (green, pink, yellow) and gothic text.', 299, 'clothes', false, true, NULL),
  
  ('BAPE Ape Head T-Shirt - White', 'White t-shirt with classic BAPE ape head logo on the back. Yellow-orange facial features on brown ape head design.', 299, 'clothes', false, true, NULL),
  
  ('Chrome Hearts Design T-Shirt - Black', 'Black t-shirt with Chrome Hearts horseshoe design and colorful crosses. Gothic text with green, pink, and yellow cross motifs.', 299, 'clothes', false, true, NULL),
  
  ('B@BY MILO Dia de los Muertos T-Shirt - White', 'White t-shirt featuring B@BY MILO Dia de los Muertos design with bear and sugar skull characters. Colorful dripping font text.', 299, 'clothes', true, true, NULL),
  
  ('Chrome Hearts Green Cross T-Shirt - White', 'White t-shirt with prominent green Chrome Hearts cross design on the front. Gothic-style cross with black outline.', 299, 'clothes', false, true, NULL),
  
  ('Chrome Hearts Emblem T-Shirt - Dark Grey', 'Dark grey t-shirt with Chrome Hearts circular emblem on the chest. Four colorful crosses (green, pink, yellow, teal) with gothic text banner.', 299, 'clothes', false, true, NULL),
  
  ('BAPE Colorful Text T-Shirt - Black', 'Black t-shirt with "A BATHING APE" in colorful letters (yellow, blue, white, red) and stylized ape head logo. Vibrant streetwear design.', 299, 'clothes', true, true, NULL),
  
  ('Chrome Hearts Red Logo T-Shirt - White', 'White t-shirt with red Chrome Hearts circular logo on the front. Gothic-style cross and text in vibrant red color.', 299, 'clothes', false, true, NULL),
  
  ('BAPE Green Camo Ape T-Shirt - White', 'White t-shirt with green camouflage BAPE ape head logo on the front. Classic BAPE design with trademark symbol.', 299, 'clothes', true, true, NULL),
  
  ('BAPE Red Ape Head T-Shirt - Black', 'Black t-shirt with large red BAPE ape head logo on the back. Iconic streetwear design with white outlined features.', 299, 'clothes', false, true, NULL)
) AS v(name, description, base_price, category, popular, available, image_url)
WHERE NOT EXISTS (
  SELECT 1 FROM menu_items WHERE menu_items.name = v.name
);

