/*
  # Add Size Variations to Clothing Items

  1. Adds size variations (Small, Medium, Large, Extra Large) to all products in the 'clothes' category
  2. All size variations have price = 0, so they don't add to the base price
  3. Uses WHERE NOT EXISTS to prevent duplicate variations if migration is run multiple times
*/

-- Insert size variations for all clothing items
INSERT INTO variations (menu_item_id, name, price)
SELECT 
  mi.id,
  size_name,
  0 as price
FROM menu_items mi
CROSS JOIN (
  SELECT 'Small' as size_name
  UNION ALL SELECT 'Medium'
  UNION ALL SELECT 'Large'
  UNION ALL SELECT 'Extra Large'
) AS sizes
WHERE mi.category = 'clothes'
  AND NOT EXISTS (
    SELECT 1 
    FROM variations v 
    WHERE v.menu_item_id = mi.id 
      AND v.name = sizes.size_name
  );

