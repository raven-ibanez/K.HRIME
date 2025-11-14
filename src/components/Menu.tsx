import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      preloadImages(menuItems);
    }
  }, [menuItems]);

  // Filter items based on selected category
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Get category name for display
  const getCategoryName = () => {
    if (selectedCategory === 'all') {
      return 'All Products';
    }
    const category = categories.find(cat => cat.id === selectedCategory);
    return category?.name || 'Products';
  };

  return (
    <main className="bg-white min-h-screen pb-8">
      {/* Page Title with Result Count */}
      <div className="px-4 pt-6 pb-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-black">
          {getCategoryName()} ({filteredItems.length} {filteredItems.length === 1 ? 'Result' : 'Results'})
        </h1>
      </div>

      {/* Horizontal Category Filters */}
      <div className="px-4 pb-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'text-black border-b-2 border-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid - Responsive Layout */}
      <div className="px-4 max-w-7xl mx-auto pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredItems.map((item) => {
            const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
            return (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                quantity={cartItem?.quantity || 0}
                onUpdateQuantity={updateQuantity}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Menu;