import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💨</div>
          <h2 className="text-2xl font-gothic-decorative font-bold text-white mb-2 uppercase tracking-wider">Your cart is empty</h2>
          <p className="text-khrime-gray-400 mb-6 font-gothic">Add some items to get started!</p>
          <button
            onClick={onContinueShopping}
            className="bg-white text-khrime-black px-6 py-3 rounded-none hover:bg-khrime-gray-200 transition-all duration-200 border-2 border-white font-gothic font-semibold uppercase tracking-wider"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onContinueShopping}
          className="flex items-center space-x-2 text-khrime-gray-400 hover:text-white transition-colors duration-200 font-gothic"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Continue Shopping</span>
        </button>
        <h1 className="text-3xl font-gothic-decorative font-bold text-white uppercase tracking-wider">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-khrime-gray-400 hover:text-white transition-colors duration-200 font-gothic uppercase tracking-wider"
        >
          Clear All
        </button>
      </div>

      <div className="bg-khrime-gray-900 border-2 border-khrime-gray-800 rounded-none overflow-hidden mb-8">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-6 ${index !== cartItems.length - 1 ? 'border-b border-khrime-gray-800' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-gothic font-semibold text-white mb-1 uppercase tracking-wide">{item.name}</h3>
                {item.selectedVariation && (
                  <p className="text-sm text-khrime-gray-400 mb-1 font-gothic">Size: {item.selectedVariation.name}</p>
                )}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <p className="text-sm text-khrime-gray-400 mb-1 font-gothic">
                    Add-ons: {item.selectedAddOns.map(addOn => 
                      addOn.quantity && addOn.quantity > 1 
                        ? `${addOn.name} x${addOn.quantity}`
                        : addOn.name
                    ).join(', ')}
                  </p>
                )}
                <p className="text-lg font-gothic font-semibold text-white">₱{item.totalPrice} each</p>
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                <div className="flex items-center space-x-3 bg-khrime-gray-800 rounded-none p-1 border-2 border-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-khrime-gray-700 rounded-none transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4 text-white" />
                  </button>
                  <span className="font-gothic font-semibold text-white min-w-[32px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-khrime-gray-700 rounded-none transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-gothic font-semibold text-white">₱{item.totalPrice * item.quantity}</p>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-khrime-gray-400 hover:text-white hover:bg-khrime-gray-800 rounded-none transition-all duration-200 border border-khrime-gray-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-khrime-gray-900 border-2 border-khrime-gray-800 rounded-none p-6">
        <div className="flex items-center justify-between text-2xl font-gothic font-bold text-white mb-6">
          <span>Total:</span>
          <span>₱{parseFloat(getTotalPrice() || 0).toFixed(2)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-white text-khrime-black py-4 rounded-none hover:bg-khrime-gray-200 transition-all duration-200 transform hover:scale-[1.02] font-gothic font-semibold text-lg border-2 border-white uppercase tracking-wider"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;