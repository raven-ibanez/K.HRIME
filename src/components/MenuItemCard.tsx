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
      setSelectedQuantity(1);
      setPendingVariation(undefined);
      setPendingAddOns([]);
      setShowQuantityModal(true);
    }
  };

  const handleCustomizedAddToCart = () => {
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn => 
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
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
        return prev.filter(a => a.id !== addOn.id);
      }
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
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

  // Generate color swatches from variations (if they have color names)
  const colorSwatches = item.variations?.slice(0, 2).map((variation, index) => {
    // Simple color mapping - you can enhance this
    const colors = ['#808080', '#22C55E', '#000000', '#FFFFFF', '#EF4444'];
    return {
      id: variation.id,
      color: colors[index % colors.length],
      name: variation.name
    };
  }) || [];

  return (
    <>
      <div 
        className="bg-white flex flex-col cursor-pointer"
        onClick={handleAddToCart}
      >
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-gray-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-4xl opacity-20">📦</div>
            </div>
          )}
          
          {/* Tags */}
          <div className="absolute top-0 left-0 p-2 flex flex-col gap-1">
            {item.isOnDiscount && item.discountPrice && (
              <span className="bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5">
                Promo Exclusion
              </span>
            )}
            {item.popular && (
              <span className="bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5">
                Bestseller
              </span>
            )}
          </div>
        </div>

        {/* Color Swatches */}
        {colorSwatches.length > 0 && (
          <div className="flex items-center gap-1.5 px-2 pt-2">
            {colorSwatches.map((swatch) => (
              <div
                key={swatch.id}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: swatch.color }}
                title={swatch.name}
              />
            ))}
          </div>
        )}

        {/* Product Info */}
        <div className="px-2 pt-2 pb-3 flex flex-col flex-1">
          <h3 className="text-sm font-medium text-black mb-1 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {item.description}
          </p>
          <div className="mt-auto">
            <p className="text-sm font-medium text-black">
              ₱{item.isOnDiscount && item.discountPrice ? item.discountPrice.toFixed(2) : item.basePrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCustomization(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-black">Customize {item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Choose your preferences</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-black" />
              </button>
            </div>

            <div className="p-6">
              {item.variations && item.variations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-black mb-4">Choose Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedVariation?.id === variation.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === variation.id}
                            onChange={() => setSelectedVariation(variation)}
                            className="text-black focus:ring-black"
                          />
                          <span className="font-medium text-black">{variation.name}</span>
                        </div>
                        <span className="text-black font-semibold">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-black mb-4">Add-ons</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-4">
                      <h5 className="text-sm font-medium text-gray-600 mb-3">
                        {category.replace('-', ' ')}
                      </h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-all"
                          >
                            <div className="flex-1">
                              <span className="font-medium text-black">{addOn.name}</span>
                              <div className="text-sm text-gray-600">
                                {addOn.price > 0 ? `₱${addOn.price.toFixed(2)} each` : 'Free'}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1 border border-gray-300">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    <Minus className="h-3 w-3 text-black" />
                                  </button>
                                  <span className="font-semibold text-black min-w-[24px] text-center text-sm">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                  >
                                    <Plus className="h-3 w-3 text-black" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="flex items-center space-x-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-semibold"
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

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between text-2xl font-bold text-black">
                  <span>Total:</span>
                  <span>₱{calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-all font-semibold flex items-center justify-center space-x-2"
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
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowQuantityModal(false);
              setSelectedQuantity(1);
              setPendingVariation(undefined);
              setPendingAddOns([]);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-black">Select Quantity</h3>
                  <p className="text-sm text-gray-600 mt-1">{item.name}</p>
                </div>
                <button
                  onClick={() => {
                    setShowQuantityModal(false);
                    setSelectedQuantity(1);
                    setPendingVariation(undefined);
                    setPendingAddOns([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-black" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-4">
                  Quantity
                </label>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border-2 border-gray-300"
                  >
                    <Minus className="h-5 w-5 text-black" />
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
                      className="w-20 text-center text-3xl font-bold text-black bg-white border-2 border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <span className="text-xs text-gray-500 mt-2">Max: 99</span>
                  </div>
                  <button
                    onClick={() => setSelectedQuantity(Math.min(99, selectedQuantity + 1))}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border-2 border-gray-300"
                  >
                    <Plus className="h-5 w-5 text-black" />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600">
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
                    <div className="flex items-center justify-between text-xs text-gray-500 pl-4">
                      <span>+ {pendingVariation.name}</span>
                      <span>₱{pendingVariation.price.toFixed(2)}</span>
                    </div>
                  )}
                  {pendingAddOns && pendingAddOns.length > 0 && (
                    <div className="flex items-center justify-between text-xs text-gray-500 pl-4">
                      <span>+ {pendingAddOns.length} add-on{pendingAddOns.length > 1 ? 's' : ''}</span>
                      <span>₱{pendingAddOns.reduce((sum, a) => sum + a.price, 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500 pl-4">
                    <span>× {selectedQuantity}</span>
                  </div>
                  <div className="flex items-center justify-between text-2xl font-bold text-black pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>₱{calculateTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmQuantity}
                className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-all font-semibold flex items-center justify-center space-x-2"
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
