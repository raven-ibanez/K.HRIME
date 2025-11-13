import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-16 z-40 bg-khrime-black/95 backdrop-blur-sm border-b border-khrime-gray-800 md:hidden shadow-lg">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-none mr-3 transition-all duration-200 border-2 font-gothic uppercase tracking-wider ${
              activeCategory === category.id
                ? 'bg-white text-khrime-black border-white'
                : 'bg-transparent text-khrime-gray-400 border-khrime-gray-700 hover:border-white hover:text-white'
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span className="text-sm font-semibold whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;