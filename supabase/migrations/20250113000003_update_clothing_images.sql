/*
  # Update Clothing Items with Image URLs

  1. Updates all clothing items in the 'clothes' category with the provided image URLs
  2. Images are assigned sequentially based on the order items were created (created_at)
  3. Uses ROW_NUMBER() to handle duplicate product names correctly
  
  Note: This script assigns images in chronological order. 
  If you need to match specific images to specific products, use the Bulk Image Upload feature in the Admin Dashboard instead.
*/

-- Update clothing items with image URLs in order of creation
UPDATE menu_items
SET image_url = (
  SELECT url FROM (
    VALUES 
      (1, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036337138-u13nlruvpqk.jpg'),
      (2, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036339188-ucciyzv4q5f.jpg'),
      (3, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036339481-n2lmn4zou0d.jpg'),
      (4, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036339789-dhnrjcy34ue.jpg'),
      (5, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036340251-xrg92ho9xgf.jpg'),
      (6, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036340536-i86kea4hgcb.jpg'),
      (7, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036340864-4tqa0ewtf19.jpg'),
      (8, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036341207-yzx54s8zoon.jpg'),
      (9, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036341707-17wuyapsjyxi.jpg'),
      (10, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036341964-u5jolr6lrlq.jpg'),
      (11, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036342256-vb6z922h9ve.jpg'),
      (12, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036342631-dmb66jnqrf.jpg'),
      (13, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036342927-xd1cgec05wb.jpg'),
      (14, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036343239-xhg2ww8hebn.jpg'),
      (15, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036343511-oyl918h035q.jpg'),
      (16, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036343768-t046j00inbt.jpg'),
      (17, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036344051-v4kip1hzwq8.jpg'),
      (18, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036344468-jgefwz52cba.jpg'),
      (19, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036344759-13ulb9arju18.jpg'),
      (20, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036345027-797hypibnt3.jpg'),
      (21, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036345275-5czz4khxofy.jpg'),
      (22, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036345530-cc9q95hardf.jpg'),
      (23, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036346461-f1mmxoaic2.jpg'),
      (24, 'https://xivtfxolxrewkowfenzd.supabase.co/storage/v1/object/public/menu-images/1763036346692-us82i4yqon8.jpg')
  ) AS image_map(row_num, url)
  WHERE image_map.row_num = (
    SELECT row_num FROM (
      SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
      FROM menu_items
      WHERE category = 'clothes' AND (image_url IS NULL OR image_url = '')
    ) AS numbered
    WHERE numbered.id = menu_items.id
  )
)
WHERE category = 'clothes'
  AND (image_url IS NULL OR image_url = '');

