import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface DepositComponentProps {
  gameType: string;
  email: string;
  amount?: number;
  vipamount?: number;
}

function DepositComponent({ gameType, email, vipamount}: DepositComponentProps) {
  const [amount, setAmount] = useState<number | undefined>(vipamount);
  const [countryCode, setCountryCode] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string>(email);
  const [purchaseGameType, setPurchaseGameType] = useState<string>(gameType);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);

  const handleBuyNow = () => {
    setShowLocationModal(true);
  };

  const handleLocationSelect = (location: string) => {
    setShowLocationModal(false);
    if (location === 'ghana') {
      setCountryCode('GH');
    } else {
      // For non-Ghana users, allow them to enter their country code
      setCountryCode('');
    }
    setShowPaymentForm(true);
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

  return (
    <div className="relative">
      {/* Buy Now Button */}
      <button
        onClick={handleBuyNow}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-bold text-lg transition-colors"
      >
        Buy Now {amount ? `$${amount}` : ''}
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

      {/* Payment Form */}
      {showPaymentForm && (
        <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
          <h3>Initiate Cashramp Deposit</h3>

          <p>Customer email: {userEmail}</p>

          <br/>

          <label>
            Country Code (e.g., NG):
            <input
              type="text"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
              maxLength={2}
            />
          </label>
          <br/>

          <button onClick={initiateDeposit} disabled={loading || !amount || !countryCode || countryCode.length !== 2}>
            {loading ? 'Processing...' : 'Start Deposit'}
          </button>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
        </div>
      )}
    </div>
  );
}

export default DepositComponent;