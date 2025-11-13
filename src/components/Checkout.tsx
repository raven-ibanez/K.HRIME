import React, { useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { CartItem, PaymentMethod, ServiceType } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pickupTime, setPickupTime] = useState('5-10');
  const [customTime, setCustomTime] = useState('');
  // Dine-in specific state
  const [partySize, setPartySize] = useState(1);
  const [dineInTime, setDineInTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const timeInfo = serviceType === 'pickup' 
      ? (pickupTime === 'custom' ? customTime : `${pickupTime} minutes`)
      : '';
    
    const dineInInfo = serviceType === 'dine-in' 
      ? `👥 Party Size: ${partySize} person${partySize !== 1 ? 's' : ''}\n🕐 Preferred Time: ${new Date(dineInTime).toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`
      : '';
    
    const orderDetails = `
🛒 K.HRIME ORDER

👤 Customer: ${customerName}
📞 Contact: ${contactNumber}
📍 Service: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
${serviceType === 'delivery' ? `🏠 Address: ${address}${landmark ? `\n🗺️ Landmark: ${landmark}` : ''}` : ''}
${serviceType === 'pickup' ? `⏰ Pickup Time: ${timeInfo}` : ''}
${serviceType === 'dine-in' ? dineInInfo : ''}


📋 ORDER DETAILS:
${cartItems.map(item => {
  let itemDetails = `• ${item.name}`;
  if (item.selectedVariation) {
    itemDetails += ` (${item.selectedVariation.name})`;
  }
  if (item.selectedAddOns && item.selectedAddOns.length > 0) {
    itemDetails += ` + ${item.selectedAddOns.map(addOn => 
      addOn.quantity && addOn.quantity > 1 
        ? `${addOn.name} x${addOn.quantity}`
        : addOn.name
    ).join(', ')}`;
  }
  itemDetails += ` x${item.quantity} - ₱${item.totalPrice * item.quantity}`;
  return itemDetails;
}).join('\n')}

💰 TOTAL: ₱${totalPrice}
${serviceType === 'delivery' ? `🛵 DELIVERY FEE:` : ''}

💳 Payment: ${selectedPaymentMethod?.name || paymentMethod}
📸 Payment Screenshot: Please attach your payment receipt screenshot

${notes ? `📝 Notes: ${notes}` : ''}

Please confirm this order to proceed. Thank you for choosing K.HRIME! 🥟
    `.trim();

    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/717422941447530?text=${encodedMessage}`;
    
    window.open(messengerUrl, '_blank');
    
  };

  const isDetailsValid = customerName && contactNumber && 
    (serviceType !== 'delivery' || address) && 
    (serviceType !== 'pickup' || (pickupTime !== 'custom' || customTime)) &&
    (serviceType !== 'dine-in' || (partySize > 0 && dineInTime));

  if (step === 'details') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-khrime-gray-400 hover:text-white transition-colors duration-200 font-gothic"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cart</span>
          </button>
          <h1 className="text-3xl font-gothic-decorative font-bold text-white ml-8 uppercase tracking-wider">Order Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-khrime-gray-900 border-2 border-khrime-gray-800 rounded-none p-6">
            <h2 className="text-2xl font-gothic font-semibold text-white mb-6 uppercase tracking-wider">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-khrime-gray-800">
                  <div>
                    <h4 className="font-gothic font-semibold text-white uppercase tracking-wide">{item.name}</h4>
                    {item.selectedVariation && (
                      <p className="text-sm text-khrime-gray-400 font-gothic">Size: {item.selectedVariation.name}</p>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-sm text-khrime-gray-400 font-gothic">
                        Add-ons: {item.selectedAddOns.map(addOn => addOn.name).join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-khrime-gray-400 font-gothic">₱{item.totalPrice} x {item.quantity}</p>
                  </div>
                  <span className="font-gothic font-semibold text-white">₱{item.totalPrice * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-khrime-gray-800 pt-4">
              <div className="flex items-center justify-between text-2xl font-gothic font-bold text-white">
                <span>Total:</span>
                <span>₱{totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="bg-khrime-gray-900 border-2 border-khrime-gray-800 rounded-none p-6">
            <h2 className="text-2xl font-gothic font-semibold text-white mb-6 uppercase tracking-wider">Customer Information</h2>
            
            <form className="space-y-6">
              {/* Customer Information */}
              <div>
                <label className="block text-sm font-gothic font-medium text-white mb-2 uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 bg-khrime-black border-2 border-khrime-gray-700 rounded-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 text-white font-gothic placeholder-khrime-gray-600"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-gothic font-medium text-white mb-2 uppercase tracking-wider">Contact Number *</label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-khrime-black border-2 border-khrime-gray-700 rounded-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 text-white font-gothic placeholder-khrime-gray-600"
                  placeholder="09XX XXX XXXX"
                  required
                />
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-gothic font-medium text-white mb-3 uppercase tracking-wider">Service Type *</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'dine-in', label: 'Dine In', icon: '🪑' },
                    { value: 'pickup', label: 'Pickup', icon: '🚶' },
                    { value: 'delivery', label: 'Delivery', icon: '🛵' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setServiceType(option.value as ServiceType)}
                      className={`p-4 rounded-none border-2 transition-all duration-200 font-gothic uppercase tracking-wider ${
                        serviceType === option.value
                          ? 'border-white bg-white text-khrime-black'
                          : 'border-khrime-gray-700 bg-khrime-black text-khrime-gray-400 hover:border-white hover:text-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-sm font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dine-in Details */}
              {serviceType === 'dine-in' && (
                <>
                  <div>
                    <label className="block text-sm font-gothic font-medium text-white mb-2 uppercase tracking-wider">Party Size *</label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => setPartySize(Math.max(1, partySize - 1))}
                        className="w-10 h-10 rounded-none border-2 border-khrime-gray-700 flex items-center justify-center text-white hover:border-white hover:bg-khrime-gray-800 transition-all duration-200"
                      >
                        -
                      </button>
                      <span className="text-2xl font-gothic font-semibold text-white min-w-[3rem] text-center">{partySize}</span>
                      <button
                        type="button"
                        onClick={() => setPartySize(Math.min(20, partySize + 1))}
                        className="w-10 h-10 rounded-none border-2 border-khrime-gray-700 flex items-center justify-center text-white hover:border-white hover:bg-khrime-gray-800 transition-all duration-200"
                      >
                        +
                      </button>
                      <span className="text-sm text-khrime-gray-400 ml-2 font-gothic">person{partySize !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-gothic font-medium text-white mb-2 uppercase tracking-wider">Preferred Time *</label>
                    <input
                      type="datetime-local"
                      value={dineInTime}
                      onChange={(e) => setDineInTime(e.target.value)}
                      className="w-full px-4 py-3 bg-khrime-black border-2 border-khrime-gray-700 rounded-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 text-white font-gothic placeholder-khrime-gray-600"
                      required
                    />
                    <p className="text-xs text-khrime-gray-500 mt-1 font-gothic">Please select your preferred dining time</p>
                  </div>
                </>
              )}

              {/* Pickup Time Selection */}
              {serviceType === 'pickup' && (
                <div>
                  <label className="block text-sm font-gothic font-medium text-white mb-3 uppercase tracking-wider">Pickup Time *</label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: '5-10', label: '5-10 minutes' },
                        { value: '15-20', label: '15-20 minutes' },
                        { value: '25-30', label: '25-30 minutes' },
                        { value: 'custom', label: 'Custom Time' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPickupTime(option.value)}
                          className={`p-3 rounded-none border-2 transition-all duration-200 text-sm font-gothic uppercase tracking-wider ${
                            pickupTime === option.value
                              ? 'border-white bg-white text-khrime-black'
                              : 'border-khrime-gray-700 bg-khrime-black text-khrime-gray-400 hover:border-white hover:text-white'
                          }`}
                        >
                          <Clock className="h-4 w-4 mx-auto mb-1" />
                          {option.label}
                        </button>
                      ))}
                    </div>
                    
                    {pickupTime === 'custom' && (
                      <input
                        type="text"
                        value={customTime}
                        onChange={(e) => setCustomTime(e.target.value)}
                        className="w-full px-4 py-3 bg-khrime-black border-2 border-khrime-gray-700 rounded-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 text-white font-gothic placeholder-khrime-gray-600"
                        placeholder="e.g., 45 minutes, 1 hour, 2:30 PM"
                        required
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {serviceType === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-gothic font-medium text-white mb-2 uppercase tracking-wider">Delivery Address *</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-khrime-black border-2 border-khrime-gray-700 rounded-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 text-white font-gothic placeholder-khrime-gray-600"
                      placeholder="Enter your complete delivery address"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-gothic font-medium text-white mb-2 uppercase tracking-wider">Landmark</label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-4 py-3 bg-khrime-black border-2 border-khrime-gray-700 rounded-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 text-white font-gothic placeholder-khrime-gray-600"
                      placeholder="e.g., Near McDonald's, Beside 7-Eleven, In front of school"
                    />
                  </div>
                </>
              )}

              {/* Special Notes */}
              <div>
                <label className="block text-sm font-gothic font-medium text-white mb-2 uppercase tracking-wider">Special Instructions</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-khrime-black border-2 border-khrime-gray-700 rounded-none focus:ring-2 focus:ring-white focus:border-white transition-all duration-200 text-white font-gothic placeholder-khrime-gray-600"
                  placeholder="Any special requests or notes..."
                  rows={3}
                />
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className={`w-full py-4 rounded-none font-gothic font-semibold text-lg transition-all duration-200 transform border-2 border-white uppercase tracking-wider ${
                  isDetailsValid
                    ? 'bg-white text-khrime-black hover:bg-khrime-gray-200 hover:scale-[1.02]'
                    : 'bg-khrime-gray-800 text-khrime-gray-600 cursor-not-allowed border-khrime-gray-700'
                }`}
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setStep('details')}
          className="flex items-center space-x-2 text-khrime-gray-400 hover:text-white transition-colors duration-200 font-gothic"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Details</span>
        </button>
        <h1 className="text-3xl font-gothic-decorative font-bold text-white ml-8 uppercase tracking-wider">Payment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Selection */}
        <div className="bg-khrime-gray-900 border-2 border-khrime-gray-800 rounded-none p-6">
          <h2 className="text-2xl font-gothic font-semibold text-white mb-6 uppercase tracking-wider">Choose Payment Method</h2>
          
          <div className="grid grid-cols-1 gap-4 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`p-4 rounded-none border-2 transition-all duration-200 flex items-center space-x-3 font-gothic uppercase tracking-wider ${
                  paymentMethod === method.id
                    ? 'border-white bg-white text-khrime-black'
                    : 'border-khrime-gray-700 bg-khrime-black text-khrime-gray-400 hover:border-white hover:text-white'
                }`}
              >
                <span className="text-2xl">💳</span>
                <span className="font-medium">{method.name}</span>
              </button>
            ))}
          </div>

          {/* Payment Details with QR Code */}
          {selectedPaymentMethod && (
            <div className="bg-khrime-gray-800 border-2 border-khrime-gray-700 rounded-none p-6 mb-6">
              <h3 className="font-gothic font-semibold text-white mb-4 uppercase tracking-wider">Payment Details</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-khrime-gray-400 mb-1 font-gothic">{selectedPaymentMethod.name}</p>
                  <p className="font-mono text-white font-gothic font-semibold">{selectedPaymentMethod.account_number}</p>
                  <p className="text-sm text-khrime-gray-400 mb-3 font-gothic">Account Name: {selectedPaymentMethod.account_name}</p>
                  <p className="text-xl font-gothic font-semibold text-white">Amount: ₱{totalPrice}</p>
                </div>
                <div className="flex-shrink-0">
                  <img 
                    src={selectedPaymentMethod.qr_code_url} 
                    alt={`${selectedPaymentMethod.name} QR Code`}
                    className="w-32 h-32 rounded-none border-2 border-khrime-gray-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                    }}
                  />
                  <p className="text-xs text-khrime-gray-400 text-center mt-2 font-gothic">Scan to pay</p>
                </div>
              </div>
            </div>
          )}

          {/* Reference Number */}
          <div className="bg-khrime-gray-800 border-2 border-khrime-gray-700 rounded-none p-4">
            <h4 className="font-gothic font-semibold text-white mb-2 uppercase tracking-wider">📸 Payment Proof Required</h4>
            <p className="text-sm text-khrime-gray-400 font-gothic">
              After making your payment, please take a screenshot of your payment receipt and attach it when you send your order via Messenger. This helps us verify and process your order quickly.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-khrime-gray-900 border-2 border-khrime-gray-800 rounded-none p-6">
          <h2 className="text-2xl font-gothic font-semibold text-white mb-6 uppercase tracking-wider">Final Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="bg-khrime-gray-800 border-2 border-khrime-gray-700 rounded-none p-4">
              <h4 className="font-gothic font-semibold text-white mb-2 uppercase tracking-wider">Customer Details</h4>
              <p className="text-sm text-khrime-gray-400 font-gothic">Name: {customerName}</p>
              <p className="text-sm text-khrime-gray-400 font-gothic">Contact: {contactNumber}</p>
              <p className="text-sm text-khrime-gray-400 font-gothic">Service: {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</p>
              {serviceType === 'delivery' && (
                <>
                  <p className="text-sm text-khrime-gray-400 font-gothic">Address: {address}</p>
                  {landmark && <p className="text-sm text-khrime-gray-400 font-gothic">Landmark: {landmark}</p>}
                </>
              )}
              {serviceType === 'pickup' && (
                <p className="text-sm text-khrime-gray-400 font-gothic">
                  Pickup Time: {pickupTime === 'custom' ? customTime : `${pickupTime} minutes`}
                </p>
              )}
              {serviceType === 'dine-in' && (
                <>
                  <p className="text-sm text-khrime-gray-400 font-gothic">
                    Party Size: {partySize} person{partySize !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-khrime-gray-400 font-gothic">
                    Preferred Time: {dineInTime ? new Date(dineInTime).toLocaleString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    }) : 'Not selected'}
                  </p>
                </>
              )}
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-khrime-gray-800">
                <div>
                  <h4 className="font-gothic font-semibold text-white uppercase tracking-wide">{item.name}</h4>
                  {item.selectedVariation && (
                    <p className="text-sm text-khrime-gray-400 font-gothic">Size: {item.selectedVariation.name}</p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-sm text-khrime-gray-400 font-gothic">
                      Add-ons: {item.selectedAddOns.map(addOn => 
                        addOn.quantity && addOn.quantity > 1 
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                  <p className="text-sm text-khrime-gray-400 font-gothic">₱{item.totalPrice} x {item.quantity}</p>
                </div>
                <span className="font-gothic font-semibold text-white">₱{item.totalPrice * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-khrime-gray-800 pt-4 mb-6">
            <div className="flex items-center justify-between text-2xl font-gothic font-bold text-white">
              <span>Total:</span>
              <span>₱{totalPrice}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full py-4 rounded-none font-gothic font-semibold text-lg transition-all duration-200 transform bg-white text-khrime-black hover:bg-khrime-gray-200 hover:scale-[1.02] border-2 border-white uppercase tracking-wider"
          >
            Place Order via Messenger
          </button>
          
          <p className="text-xs text-khrime-gray-400 text-center mt-3 font-gothic">
            You'll be redirected to Facebook Messenger to confirm your order. Don't forget to attach your payment screenshot!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;