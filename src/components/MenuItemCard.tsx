import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToCart, 
  quantity, 
  onUpdateQuantity 
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);
  const [pendingAddOns, setPendingAddOns] = useState<AddOn[]>([]);
  const [pendingVariation, setPendingVariation] = useState<Variation | undefined>(undefined);

  const calculatePrice = () => {
    // Use effective price (discounted or regular) as base
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price = (item.effectivePrice || item.basePrice) + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      // Show quantity modal for simple items
      setSelectedQuantity(1);
      setPendingVariation(undefined);
      setPendingAddOns([]);
      setShowQuantityModal(true);
    }
  };

  const handleCustomizedAddToCart = () => {
    // Convert selectedAddOns back to regular AddOn array for cart
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn => 
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    // Store the customization and show quantity modal
    setPendingVariation(selectedVariation);
    setPendingAddOns(addOnsForCart);
    setSelectedQuantity(1);
    setShowCustomization(false);
    setShowQuantityModal(true);
  };

  const handleConfirmQuantity = () => {
    onAddToCart(item, selectedQuantity, pendingVariation, pendingAddOns);
    setShowQuantityModal(false);
    setSelectedQuantity(1);
    setPendingVariation(undefined);
    setPendingAddOns([]);
    setSelectedAddOns([]);
  };

  const calculateTotalPrice = () => {
    let price = item.effectivePrice || item.basePrice;
    if (pendingVariation) {
      price = (item.effectivePrice || item.basePrice) + pendingVariation.price;
    }
    if (pendingAddOns) {
      pendingAddOns.forEach(addOn => {
        price += addOn.price;
      });
    }
    return price * selectedQuantity;
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdateQuantity(item.id, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);
      
      if (quantity === 0) {
        // Remove add-on if quantity is 0
        return prev.filter(a => a.id !== addOn.id);
      }
      
      if (existingIndex >= 0) {
        // Update existing add-on quantity
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        // Add new add-on with quantity
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className={`bg-khrime-gray-900 rounded-none border-2 border-khrime-gray-800 hover:border-white transition-all duration-300 overflow-hidden group animate-scale-in flex flex-col ${!item.available ? 'opacity-60' : ''}`}>
        {/* Image Container with Badges */}
        <div className="relative aspect-square bg-gradient-to-br from-khrime-black to-khrime-gray-900">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
            <div className="text-6xl opacity-20 text-khrime-gray-600">💨</div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.isOnDiscount && item.discountPrice && (
              <div className="bg-white text-khrime-black text-xs font-bold px-3 py-1.5 rounded-none border-2 border-white shadow-lg animate-pulse font-gothic uppercase tracking-wider">
                SALE
              </div>
            )}
            {item.popular && (
              <div className="bg-white text-khrime-black text-xs font-bold px-3 py-1.5 rounded-none border-2 border-white shadow-lg font-gothic uppercase tracking-wider">
                ⭐ POPULAR
              </div>
            )}
          </div>
          
          {!item.available && (
            <div className="absolute top-3 right-3 bg-khrime-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-none border-2 border-khrime-gray-600 shadow-lg font-gothic uppercase">
              UNAVAILABLE
            </div>
          )}
          
          {/* Discount Percentage Badge */}
          {item.isOnDiscount && item.discountPrice && (
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-khrime-black text-xs font-bold px-2 py-1 rounded-none border border-white shadow-lg font-gothic">
              {Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}% OFF
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-base font-gothic font-semibold text-white leading-tight flex-1 pr-2 uppercase tracking-wide line-clamp-2">{item.name}</h4>
            {item.variations && item.variations.length > 0 && (
              <div className="text-xs text-khrime-gray-400 bg-khrime-gray-800 px-2 py-1 rounded-none border border-khrime-gray-700 whitespace-nowrap font-gothic uppercase flex-shrink-0">
                {item.variations.length} sizes
              </div>
            )}
          </div>
          
          <p className={`text-xs mb-3 leading-relaxed font-gothic line-clamp-2 flex-1 ${!item.available ? 'text-khrime-gray-600' : 'text-khrime-gray-400'}`}>
            {!item.available ? 'Currently Unavailable' : item.description}
          </p>
          
          {/* Pricing Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              {item.isOnDiscount && item.discountPrice ? (
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-white font-gothic">
                      ₱{item.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-khrime-gray-600 line-through">
                      ₱{item.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-khrime-gray-500 font-gothic">
                    Save ₱{(item.basePrice - item.discountPrice).toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-xl font-bold text-white font-gothic">
                  ₱{item.basePrice.toFixed(2)}
                </div>
              )}
              
              {item.variations && item.variations.length > 0 && (
                <div className="text-xs text-khrime-gray-500 mt-1 font-gothic">
                  Starting price
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex-shrink-0">
              {!item.available ? (
                <button
                  disabled
                  className="bg-khrime-gray-800 text-khrime-gray-600 px-4 py-2.5 rounded-none cursor-not-allowed font-gothic font-medium text-sm border-2 border-khrime-gray-700 uppercase"
                >
                  Unavailable
                </button>
              ) : quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-white text-khrime-black px-4 py-2 rounded-none hover:bg-khrime-gray-200 transition-all duration-200 transform hover:scale-105 font-gothic font-semibold text-xs border-2 border-white uppercase tracking-wider whitespace-nowrap"
                >
                  {item.variations?.length || item.addOns?.length ? 'Customize' : 'Add to Cart'}
                </button>
              ) : (
                <div className="flex items-center space-x-2 bg-khrime-gray-800 rounded-none p-1 border-2 border-white">
                  <button
                    onClick={handleDecrement}
                    className="p-2 hover:bg-khrime-gray-700 rounded-none transition-colors duration-200 hover:scale-110"
                  >
                    <Minus className="h-4 w-4 text-white" />
                  </button>
                  <span className="font-bold text-white min-w-[28px] text-center text-sm font-gothic">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-2 hover:bg-khrime-gray-700 rounded-none transition-colors duration-200 hover:scale-110"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add-ons indicator */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-khrime-gray-500 bg-khrime-gray-800 px-2 py-1 rounded-none border border-khrime-gray-700 font-gothic mt-auto">
              <span>+</span>
              <span>{item.addOns.length} add-on{item.addOns.length > 1 ? 's' : ''} available</span>
            </div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-khrime-gray-900 border-2 border-white rounded-none max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-khrime-gray-900 border-b border-khrime-gray-800 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-gothic font-semibold text-white uppercase tracking-wider">Customize {item.name}</h3>
                <p className="text-sm text-khrime-gray-400 mt-1 font-gothic">Choose your preferences</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-khrime-gray-800 rounded-none transition-colors duration-200 border border-khrime-gray-700"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="p-6">
              {/* Size Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-gothic font-semibold text-white mb-4 uppercase tracking-wider">Choose Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-none cursor-pointer transition-all duration-200 ${
                          selectedVariation?.id === variation.id
                            ? 'border-white bg-khrime-gray-800'
                            : 'border-khrime-gray-700 hover:border-white hover:bg-khrime-gray-800'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === variation.id}
                            onChange={() => setSelectedVariation(variation)}
                            className="text-white focus:ring-white"
                          />
                          <span className="font-gothic font-medium text-white uppercase">{variation.name}</span>
                        </div>
                        <span className="text-white font-gothic font-semibold">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-gothic font-semibold text-white mb-4 uppercase tracking-wider">Add-ons</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-4">
                      <h5 className="text-sm font-gothic font-medium text-khrime-gray-400 mb-3 uppercase tracking-wider">
                        {category.replace('-', ' ')}
                      </h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-4 border border-khrime-gray-700 rounded-none hover:border-white hover:bg-khrime-gray-800 transition-all duration-200"
                          >
                            <div className="flex-1">
                              <span className="font-gothic font-medium text-white uppercase">{addOn.name}</span>
                              <div className="text-sm text-khrime-gray-400 font-gothic">
                                {addOn.price > 0 ? `₱${addOn.price.toFixed(2)} each` : 'Free'}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center space-x-2 bg-khrime-gray-800 rounded-none p-1 border-2 border-white">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-1.5 hover:bg-khrime-gray-700 rounded-none transition-colors duration-200"
                                  >
                                    <Minus className="h-3 w-3 text-white" />
                                  </button>
                                  <span className="font-gothic font-semibold text-white min-w-[24px] text-center text-sm">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-1.5 hover:bg-khrime-gray-700 rounded-none transition-colors duration-200"
                                  >
                                    <Plus className="h-3 w-3 text-white" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="flex items-center space-x-1 px-4 py-2 bg-white text-khrime-black rounded-none hover:bg-khrime-gray-200 transition-all duration-200 text-sm font-gothic font-semibold border-2 border-white uppercase tracking-wider"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t border-khrime-gray-800 pt-4 mb-6">
                <div className="flex items-center justify-between text-2xl font-gothic font-bold text-white">
                  <span>Total:</span>
                  <span className="text-white">₱{calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full bg-white text-khrime-black py-4 rounded-none hover:bg-khrime-gray-200 transition-all duration-200 font-gothic font-semibold flex items-center justify-center space-x-2 border-2 border-white uppercase tracking-wider transform hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart - ₱{calculatePrice().toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quantity Selection Modal */}
      {showQuantityModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-khrime-gray-900 border-2 border-white rounded-none max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-gothic font-semibold text-white uppercase tracking-wider">Select Quantity</h3>
                  <p className="text-sm text-khrime-gray-400 mt-1 font-gothic">{item.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowQuantityModal(false);
                    setSelectedQuantity(1);
                    setPendingVariation(undefined);
                    setPendingAddOns([]);
                  }}
                  className="p-2 hover:bg-khrime-gray-800 rounded-none transition-colors duration-200 border border-khrime-gray-700"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-gothic font-medium text-white mb-4 uppercase tracking-wider">
                  Quantity
                </label>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="p-3 bg-khrime-gray-800 hover:bg-khrime-gray-700 rounded-none transition-colors duration-200 border-2 border-white"
                  >
                    <Minus className="h-5 w-5 text-white" />
                  </button>
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={selectedQuantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setSelectedQuantity(Math.max(1, Math.min(99, val)));
                      }}
                      className="w-20 text-center text-3xl font-gothic font-bold text-white bg-khrime-gray-800 border-2 border-white rounded-none py-2 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <span className="text-xs text-khrime-gray-400 mt-2 font-gothic">Max: 99</span>
                  </div>
                  <button
                    onClick={() => setSelectedQuantity(Math.min(99, selectedQuantity + 1))}
                    className="p-3 bg-khrime-gray-800 hover:bg-khrime-gray-700 rounded-none transition-colors duration-200 border-2 border-white"
                  >
                    <Plus className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t border-khrime-gray-800 pt-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-khrime-gray-400 font-gothic">
                    <span>Unit Price:</span>
                    <span>₱{(() => {
                      let price = item.effectivePrice || item.basePrice;
                      if (pendingVariation) {
                        price += pendingVariation.price;
                      }
                      if (pendingAddOns) {
                        pendingAddOns.forEach(addOn => {
                          price += addOn.price;
                        });
                      }
                      return price.toFixed(2);
                    })()}</span>
                  </div>
                  {pendingVariation && (
                    <div className="flex items-center justify-between text-xs text-khrime-gray-500 font-gothic pl-4">
                      <span>+ {pendingVariation.name}</span>
                      <span>₱{pendingVariation.price.toFixed(2)}</span>
                    </div>
                  )}
                  {pendingAddOns && pendingAddOns.length > 0 && (
                    <div className="flex items-center justify-between text-xs text-khrime-gray-500 font-gothic pl-4">
                      <span>+ {pendingAddOns.length} add-on{pendingAddOns.length > 1 ? 's' : ''}</span>
                      <span>₱{pendingAddOns.reduce((sum, a) => sum + a.price, 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-khrime-gray-500 font-gothic pl-4">
                    <span>× {selectedQuantity}</span>
                  </div>
                  <div className="flex items-center justify-between text-2xl font-gothic font-bold text-white pt-2 border-t border-khrime-gray-800">
                    <span>Total:</span>
                    <span className="text-white">₱{calculateTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmQuantity}
                className="w-full bg-white text-khrime-black py-4 rounded-none hover:bg-khrime-gray-200 transition-all duration-200 font-gothic font-semibold flex items-center justify-center space-x-2 border-2 border-white uppercase tracking-wider transform hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add {selectedQuantity} to Cart - ₱{calculateTotalPrice().toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;