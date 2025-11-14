import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Brand Name */}
          <button 
            onClick={onMenuClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <img 
                  src={siteSettings?.site_logo || "/logo.png"} 
                  alt={siteSettings?.site_name || "KHRIME"}
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/logo.png";
                  }}
                />
                <span className="text-xl font-semibold text-black">
                  {siteSettings?.site_name || "KHRIME"}
                </span>
              </>
            )}
          </button>

          {/* Cart Button */}
          <button 
            onClick={onCartClick}
            className="relative p-2 text-black hover:text-gray-600 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-black text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;