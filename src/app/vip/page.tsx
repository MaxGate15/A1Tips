'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import PaymentDropdown from '../../components/PaymentDropdown';

export default function VIP() {
  const [selectedDate, setSelectedDate] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [vipAvailability, setVipAvailability] = useState({
    'VIP 1': true,
    'VIP 2': true,
    'VIP 3': true
  });
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Check VIP availability from localStorage
  useEffect(() => {
    const checkVipAvailability = () => {
      const storedStatuses = localStorage.getItem('vipPlanStatuses');
      if (storedStatuses) {
        try {
          const parsedStatuses = JSON.parse(storedStatuses);
          setVipAvailability(parsedStatuses);
        } catch (error) {
          console.error('Error parsing VIP statuses:', error);
        }
      }
    };

    checkVipAvailability();
    
    // Listen for storage changes (when admin updates VIP status)
    const handleStorageChange = () => checkVipAvailability();
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
  };

  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment successful:', reference);
    // Here you would typically update the user's purchased packages
    // For now, we'll just show an alert
    alert(`Payment successful! Reference: ${reference}`);
  };

  const handlePaymentClose = () => {
    console.log('Payment cancelled');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };


  const dates = [
    { id: 'yesterday', label: 'Yesterday', date: '2024-01-14' },
    { id: 'today', label: 'Today', date: '2024-01-15' },
    { id: 'tomorrow', label: 'Tomorrow', date: '2024-01-16' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">VIP Packages</h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Premium betting tips and predictions from our experts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

        {/* Date Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleDateSelect('yesterday')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDate === 'yesterday' 
                  ? 'bg-green-500 hover:bg-green-600 text-white font-semibold' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Yesterday
            </button>
            <button 
              onClick={() => handleDateSelect('today')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDate === 'today' 
                  ? 'bg-green-500 hover:bg-green-600 text-white font-semibold' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Today
            </button>
            <button 
              onClick={() => handleDateSelect('tomorrow')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDate === 'tomorrow' 
                  ? 'bg-green-500 hover:bg-green-600 text-white font-semibold' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Tomorrow
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="date"
              id="dateFilter"
              value={dateFilter}
              onChange={handleDateChange}
              className="px-4 py-2 border-2 border-green-500 text-green-500 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            />
          </div>
        </div>

        {/* VIP Packages */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Premium VIP Packages
            </h2>
            <p className="text-gray-600">
              Get access to our most accurate predictions and betting tips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* VIP Package 1 */}
            <div className={`bg-white border rounded-lg shadow-lg p-6 transition-shadow ${
              vipAvailability['VIP 1'] 
                ? 'border-gray-200 hover:shadow-xl' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">VIP 1</h3>
                <div className="mb-4 text-left">
                  <ul className="space-y-2">
                    <li className="text-gray-900 font-semibold">Olympiacos vs Pafos FC</li>
                    <li className="text-gray-900 font-semibold">Ajax vs Inter</li>
                    <li className="text-gray-900 font-semibold">Bayern Munich vs Chelsea</li>
                    <li className="text-gray-900 font-semibold">Liverpool vs Atletico Madrid</li>
                  </ul>
                </div>
                {vipAvailability['VIP 1'] ? (
                  <PaymentDropdown
                    packageName="VIP 1"
                    price="GHS 20"
                    priceInGHS={20}
                    priceInUSD={3}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentClose={handlePaymentClose}
                  />
                ) : (
                  <div className="bg-red-500 text-white py-3 px-4 rounded-lg font-bold text-lg">
                    SOLD OUT
                  </div>
                )}
              </div>
            </div>

            {/* VIP Package 2 */}
            <div className={`bg-white border rounded-lg shadow-lg p-6 transition-shadow ${
              vipAvailability['VIP 2'] 
                ? 'border-gray-200 hover:shadow-xl' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">VIP 2</h3>
                <div className="mb-4 text-left">
                  <ul className="space-y-2">
                    <li className="text-gray-900 font-semibold">Arsenal vs Chelsea</li>
                    <li className="text-gray-900 font-semibold">Barcelona vs Real Madrid</li>
                    <li className="text-gray-900 font-semibold">PSG vs Bayern Munich</li>
                    <li className="text-gray-900 font-semibold">Manchester City vs Liverpool</li>
                  </ul>
                </div>
                {vipAvailability['VIP 2'] ? (
                  <PaymentDropdown
                    packageName="VIP 2"
                    price="GHS 35"
                    priceInGHS={35}
                    priceInUSD={5}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentClose={handlePaymentClose}
                  />
                ) : (
                  <div className="bg-red-500 text-white py-3 px-4 rounded-lg font-bold text-lg">
                    SOLD OUT
                  </div>
                )}
              </div>
            </div>

            {/* VIP Package 3 - Results Uploaded */}
            <div className={`bg-white border rounded-lg shadow-lg p-6 transition-shadow ${
              vipAvailability['VIP 3'] 
                ? 'border-gray-200 hover:shadow-xl' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">VIP 3</h3>
                <div className="mb-6 text-left space-y-4">
                  {/* Match 1 - Win */}
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-gray-900 font-semibold mb-2">Juventus vs AC Milan</h4>
                    <div className="text-sm text-gray-600 mb-2">Prediction: Home</div>
                    <div className="text-sm text-gray-600 mb-2">Odds: 1.45</div>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Option: Home</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Odds: 1.45</span>
                      <span className="ml-auto">
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                      </span>
                    </div>
                  </div>

                  {/* Match 2 - Win */}
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-gray-900 font-semibold mb-2">Inter Milan vs Napoli</h4>
                    <div className="text-sm text-gray-600 mb-2">Prediction: Away</div>
                    <div className="text-sm text-gray-600 mb-2">Odds: 1.78</div>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Option: Away</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Odds: 1.78</span>
                      <span className="ml-auto">
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                      </span>
                    </div>
                  </div>

                  {/* Match 3 - Loss */}
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-gray-900 font-semibold mb-2">Atletico Madrid vs Sevilla</h4>
                    <div className="text-sm text-gray-600 mb-2">Prediction: Home</div>
                    <div className="text-sm text-gray-600 mb-2">Odds: 1.71</div>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Option: Home</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Odds: 1.71</span>
                      <span className="ml-auto">
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                          <span className="text-white font-bold text-sm">✗</span>
                        </div>
                      </span>
                    </div>
                  </div>

                  {/* Match 4 - Win */}
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-2">Newcastle vs FC Barcelona</h4>
                    <div className="text-sm text-gray-600 mb-2">Prediction: Home</div>
                    <div className="text-sm text-gray-600 mb-2">Odds: 1.55</div>
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Option: Home</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Odds: 1.55</span>
                      <span className="ml-auto">
                        <div className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                          <span className="text-white font-bold text-sm">✓</span>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
                {/* No Buy Now button - results are uploaded */}
                {!vipAvailability['VIP 3'] && (
                  <div className="bg-red-500 text-white py-3 px-4 rounded-lg font-bold text-lg mt-4">
                    SOLD OUT
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}