'use client';

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface PaymentDropdownProps {
  packageName: string;
  price: string;
  priceInGHS: number;
  priceInUSD: number;
  onPaymentSuccess: (reference: string) => void;
  onPaymentClose: () => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaymentDropdown({
  packageName,
  price,
  priceInGHS,
  priceInUSD,
  onPaymentSuccess,
  onPaymentClose
}: PaymentDropdownProps) {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<'ghana' | 'other'>('ghana');

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_51234567890abcdef";

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onSuccess = (reference: string) => {
    console.log('Payment successful:', reference);
    onPaymentSuccess(reference);
    setShowLocationModal(false);
  };

  const onClose = () => {
    console.log('Payment closed');
    onPaymentClose();
    setShowLocationModal(false);
  };

  const handleBuyNow = () => {
    setShowLocationModal(true);
  };

  const handleLocationSelect = (country: 'ghana' | 'other') => {
    setSelectedCountry(country);
    setShowLocationModal(false);
    
    // Initialize Paystack payment
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: 'test@example.com',
      amount: country === 'ghana' ? priceInGHS * 100 : priceInUSD * 100,
      currency: country === 'ghana' ? 'GHS' : 'USD',
      channels: country === 'ghana' 
        ? ['card', 'mobile_money', 'bank_transfer'] 
        : ['card'],
      metadata: {
        package: packageName,
        customer_name: 'Test User',
        custom_fields: []
      },
      callback: (response: any) => {
        onSuccess(response.reference);
      },
      onClose: () => {
        onClose();
      }
    });
    
    handler.openIframe();
  };

  return (
    <div className="relative">
      {/* Buy Now Button */}
      <button
        onClick={handleBuyNow}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg transition-colors"
      >
        Buy Now {price}
      </button>

      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-gray-200 border-2 border-green-500 rounded-lg p-6 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-green-600 font-bold text-lg">SELECT LOCATION</h3>
              <button
                onClick={() => setShowLocationModal(false)}
                className="text-black hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Location Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleLocationSelect('ghana')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-bold text-lg transition-colors"
              >
                IN GHANA
              </button>
              <button
                onClick={() => handleLocationSelect('other')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-bold text-lg transition-colors"
              >
                NOT IN GHANA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
