import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface DepositComponentProps {
  gameType: string;
  email: string;
  amount?: number;
  vipamount?: number;
}

function DepositComponent({ gameType, email, vipamount}: DepositComponentProps) {
  const [amount, setAmount] = useState<number>(vipamount || 1);
  const [countryCode, setCountryCode] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string>(email);
  const [purchaseGameType, setPurchaseGameType] = useState<string>(gameType);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showPaymentMethodSelection, setShowPaymentMethodSelection] = useState<boolean>(false);
  const [showAccruePayment, setShowAccruePayment] = useState<boolean>(false);
  const [showCashrampPayment, setShowCashrampPayment] = useState<boolean>(false);
  const [displayAmount, setDisplayAmount] = useState<number | undefined>(amount);
  const [displayCurrency, setDisplayCurrency] = useState<string>('USD');

  const handleBuyNow = () => {
    setShowLocationModal(true);
  };

  const handleLocationSelect = (location: string) => {
    setShowLocationModal(false);
    if (location === 'ghana') {
      // Ghana users - no payment options, just close
      setCountryCode('GH');
      setShowAccruePayment(false);
      setShowCashrampPayment(false);
    } else {
      // For non-Ghana users, show payment method selection
      setCountryCode('');
      setShowPaymentMethodSelection(true);
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    setShowPaymentMethodSelection(false);
    if (method === 'accrue') {
      setShowAccruePayment(true);
    } else if (method === 'cashramp') {
      setShowCashrampPayment(true);
    }
  };

  const getCurrencyInfo = (countryCode: string) => {
    const currencyMap: { [key: string]: { symbol: string; code: string; rate: number } } = {
      'NG': { symbol: '₦', code: 'NGN', rate: 45.2 }, // 1 GHS = 45.2 NGN
      'US': { symbol: '$', code: 'USD', rate: 0.065 }, // 1 GHS = 0.065 USD
      'UK': { symbol: '£', code: 'GBP', rate: 0.051 }, // 1 GHS = 0.051 GBP
      'CA': { symbol: 'C$', code: 'CAD', rate: 0.089 }, // 1 GHS = 0.089 CAD
      'GH': { symbol: '₵', code: 'GHS', rate: 1.0 }, // 1 GHS = 1.0 GHS
      'KE': { symbol: 'KSh', code: 'KES', rate: 8.5 }, // 1 GHS = 8.5 KES
      'ZA': { symbol: 'R', code: 'ZAR', rate: 1.2 }, // 1 GHS = 1.2 ZAR
      'EG': { symbol: 'E£', code: 'EGP', rate: 2.0 }, // 1 GHS = 2.0 EGP
      'MA': { symbol: 'MAD', code: 'MAD', rate: 0.65 }, // 1 GHS = 0.65 MAD
      'TZ': { symbol: 'TSh', code: 'TZS', rate: 160.0 }, // 1 GHS = 160.0 TZS
    };
    return currencyMap[countryCode] || { symbol: '$', code: 'USD', rate: 0.065 };
  };

  const handleCountryCodeChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    if (newCountryCode.length === 2) {
      const currencyInfo = getCurrencyInfo(newCountryCode);
      setDisplayCurrency(currencyInfo.symbol);
      
      // Convert amount from GHS to the selected currency
      if (amount) {
        // Use mock value for NG (Nigeria) as requested
        if (newCountryCode === 'NG') {
          setDisplayAmount(45.20);
        } else {
          const convertedAmount = (amount * currencyInfo.rate).toFixed(2);
          setDisplayAmount(parseFloat(convertedAmount));
        }
      }
    }
  };

  // NOTE: Customer details should come from your application's user session
  const customerDetails = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
  };

  const initiateDeposit = async () => {
    setLoading(true);
    setError(null);

    const depositData = {
      amount: amount,
      countryCode: countryCode,
      email: userEmail,
      gameType: purchaseGameType,
    };

    try {
      // 1. Call the FastAPI endpoint
      const response = await fetch('http://localhost:8000/api/v1/create-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(depositData),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.detail || 'Failed to create deposit link.');
      }

      const data = await response.json();
      const { hostedLink } = data;

      // 2. Redirect the user to the Cashramp Hosted Ramp
      if (hostedLink) {
        // Use window.location.replace() to prevent the user from returning 
        // to this page with the back button after payment.
        window.location.replace(hostedLink);
      } else {
        throw new Error('No hosted link received from the server.');
      }

    } catch (err) {
      console.error('Deposit initiation failed:', err);
      setError(err.message);
    } finally {
      // If the redirect is successful, this line is not reached, 
      // but it's important for error cases.
      setLoading(false); 
    }
  };


  const initiateAccruePayment = async () => {
    setLoading(true);
    setError(null);

    const accrueData = {
      amount: amount,
      email: userEmail,
      gameType: purchaseGameType,
      currency: 'USD', // Default currency for Accrue
    };

    try {
      // Call Accrue API endpoint
      const response = await fetch('http://localhost:8000/api/v1/create-accrue-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accrueData),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.detail || 'Failed to create Accrue payment link.');
      }

      const data = await response.json();
      const { paymentUrl } = data;

      // Redirect to Accrue payment page
      if (paymentUrl) {
        window.location.replace(paymentUrl);
      } else {
        throw new Error('No payment URL received from Accrue.');
      }

    } catch (err) {
      console.error('Accrue payment initiation failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePayment = () => {
    setShowPaymentMethodSelection(false);
    setShowAccruePayment(false);
    setShowCashrampPayment(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClosePayment();
    }
  };

  return (
    <div className="relative">
      {/* Buy Now Button */}
      <button
        onClick={handleBuyNow}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg transition-colors"
      >
        Buy Now
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
                aria-label="Close location selection modal"
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

      {/* Payment Method Selection - Other Countries */}
      {showPaymentMethodSelection && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg p-4 w-full max-w-sm mx-4 relative">
            {/* Close Button */}
              <button
              onClick={handleClosePayment}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close payment method selection"
              >
              <FaTimes className="w-4 h-4" />
              </button>

            <h3 className="text-blue-600 font-bold text-base mb-4 text-center">🌍 Choose Payment Method</h3>

            <div className="space-y-3">
              <button
                onClick={() => handlePaymentMethodSelect('accrue')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2"
              >
                <span>💳</span>
                <span>Pay with Accrue</span>
              </button>

              <button
                onClick={() => handlePaymentMethodSelect('cashramp')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors flex items-center justify-center space-x-2"
              >
                <span>💳</span>
                <span>Pay with Cashramp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cashramp Payment Form - Other Countries */}
      {showCashrampPayment && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg p-4 w-full max-w-sm mx-4 relative">
            {/* Close Button */}
            <button
              onClick={handleClosePayment}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close payment form"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            <h3 className="text-green-600 font-bold text-base mb-3">💳 Cashramp Payment</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{userEmail}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{countryCode && countryCode.length === 2 ? `${displayCurrency}${displayAmount || amount}` : `₵${amount} GHS`}</span>
              </div>

              {countryCode && countryCode.length === 2 && displayAmount && (
                <div className="bg-green-50 p-2 rounded text-xs text-green-800">
                  💱 Converted: {amount} GHS = {displayCurrency}{displayAmount} {getCurrencyInfo(countryCode).code}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Country Code:
                </label>
                <input
                  type="text"
                  value={countryCode}
                  onChange={(e) => handleCountryCodeChange(e.target.value.toUpperCase())}
                  maxLength={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="NG, US, UK, CA, etc."
                />
                <p className="text-xs text-gray-500 mt-1">Enter 2-letter country code (e.g., NG, US, UK, CA)</p>
              </div>

              <button 
                onClick={initiateDeposit} 
                disabled={loading || !amount || !countryCode || countryCode.length !== 2}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
              >
                {loading ? 'Processing...' : countryCode && countryCode.length === 2 ? `Pay ${displayCurrency}${displayAmount || amount}` : 'Enter Country Code'}
              </button>

              {error && <p className="text-red-500 text-xs">Error: {error}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Accrue Payment Form - Other Countries */}
      {showAccruePayment && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg p-4 w-full max-w-sm mx-4 relative">
            {/* Close Button */}
            <button
              onClick={handleClosePayment}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close payment form"
            >
              <FaTimes className="w-4 h-4" />
            </button>

            <h3 className="text-blue-600 font-bold text-base mb-3">💳 Accrue Payment</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{userEmail}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{displayCurrency}{amount}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Game:</span>
                <span className="font-medium">{purchaseGameType}</span>
              </div>

              <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                💡 Supports credit cards, bank transfers, and digital wallets
              </div>

              <button 
                onClick={initiateAccruePayment} 
                disabled={loading || !amount}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
              >
                {loading ? 'Processing...' : 'Pay with Accrue'}
              </button>

              {error && <p className="text-red-500 text-xs">Error: {error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepositComponent;