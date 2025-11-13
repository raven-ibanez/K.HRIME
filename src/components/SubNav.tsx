import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <div className="sticky top-16 z-40 bg-khrime-black/95 backdrop-blur-md border-b border-khrime-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4 overflow-x-auto py-3 scrollbar-hide">
          {loading ? (
            <div className="flex space-x-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-8 w-20 bg-khrime-gray-800 rounded-none animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => onCategoryClick('all')}
                className={`px-4 py-2 rounded-none text-sm transition-colors duration-200 border-2 font-gothic uppercase tracking-wider ${
                  selectedCategory === 'all'
                    ? 'bg-white text-khrime-black border-white'
                    : 'bg-transparent text-khrime-gray-300 border-khrime-gray-700 hover:border-white hover:text-white'
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCategoryClick(c.id)}
                  className={`px-4 py-2 rounded-none text-sm transition-colors duration-200 border-2 flex items-center space-x-2 font-gothic uppercase tracking-wider ${
                    selectedCategory === c.id
                      ? 'bg-white text-khrime-black border-white'
                      : 'bg-transparent text-khrime-gray-300 border-khrime-gray-700 hover:border-white hover:text-white'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNav;


