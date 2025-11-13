/*
  # Remove Small Size Variation from Clothing Items

  1. Removes the "Small" size variation from all products in the 'clothes' category
  2. Keeps Medium, Large, and Extra Large sizes
*/

-- Delete Small size variations from all clothing items
DELETE FROM variations
WHERE name = 'Small'
  AND menu_item_id IN (
    SELECT id FROM menu_items WHERE category = 'clothes'
  );

