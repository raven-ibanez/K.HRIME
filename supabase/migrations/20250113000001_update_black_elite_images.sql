/*
  # Update BLACK ELITE Products with Product Image

  This migration updates all existing BLACK ELITE 8000 and BLACK ELITE 12000 products
  to use the provided product image URL.
*/

-- Update BLACK ELITE 8000 products
UPDATE menu_items
SET image_url = 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'
WHERE category = 'black-elite-8000'
  AND (image_url IS NULL OR image_url = '');

-- Update BLACK ELITE 12000 products
UPDATE menu_items
SET image_url = 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763032933245-35h83ihcx5y.png'
WHERE category = 'black-elite-12000'
  AND (image_url IS NULL OR image_url = '');

