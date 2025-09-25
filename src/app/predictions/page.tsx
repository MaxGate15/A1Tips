'use client';

import { useState, useEffect,useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaCrown, FaFire, FaTrophy, FaClock, FaCopy } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import PaymentDropdown from '../../components/PaymentDropdown';

export default function Predictions() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedSport, setSelectedSport] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [vipAvailability, setVipAvailability] = useState({
    'VIP 1': false,
    'VIP 2': false,
    'VIP 3': false
  });
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<{teams: string, tip: string, result: string}[]>([]);
  const [bookingCodes, setBookingCodes] = useState<{platform: string, code: string}[]>([]);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [vipPackages, setVipPackages] = useState<{
    category: string;
    id: number;
    price: string;
    booking_code: string;
    games: {home_team: string, away_team: string, prediction: string, odds: number, match_status: string}[];
  }[]>([]);
  const [isLoadingVipPackages, setIsLoadingVipPackages] = useState(true);
  const [showBookingDropdown, setShowBookingDropdown] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const bookingDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bookingDropdownRef.current && !bookingDropdownRef.current.contains(event.target as Node)) {
        setShowBookingDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

   const fetchMatchesForDate = useCallback(async (date: string) => {
      setIsLoadingMatches(true);
      try {
        let endpoint = '';
        const today = new Date().toISOString().split('T')[0];
        
        // Determine which API to call based on date
        if (date === 'today') {
          endpoint = 'https://coral-app-l62hg.ondigitalocean.app/games/free-bookings';
        } else {
          // Convert date string to actual date for API
          let apiDate = today; // default to today
          
          if (date === 'yesterday') {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            apiDate = yesterday.toISOString().split('T')[0];
          } else if (date === 'tomorrow') {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            apiDate = tomorrow.toISOString().split('T')[0];
          } else if (dateFilter) {
            // Use custom date from date picker
            apiDate = dateFilter;
          }
          
          endpoint = `https://coral-app-l62hg.ondigitalocean.app/games/other-games?date=${apiDate}`;
        }
  
        console.log('Fetching matches from:', endpoint);
        const response = await fetch(endpoint);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch matches: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched matches data:', data);
        
        // Transform API response to match UI format
        const transformedMatches: {teams: string, tip: string, result: string}[] = [];
        const codes: {platform: string, code: string}[] = [];
        
        data.forEach((booking: {booking_code: string, games: {home_team: string, away_team: string, prediction: string, match_status: string}[]}) => {
          // Extract booking codes
          if (booking.booking_code) {
            codes.push(
              { platform: 'Sporty', code: booking.booking_code },
              { platform: 'MSport', code: booking.booking_code }
            );
          }
          
          // Transform games to match UI format
          booking.games.forEach((game) => {
            transformedMatches.push({
              teams: `${game.home_team} vs ${game.away_team}`,
              tip: game.prediction,
              result: game.match_status // 'pending', 'won', 'lost'
            });
          });
        });
        
        setMatches(transformedMatches);
        setBookingCodes(codes.length > 0 ? codes : [
          { platform: 'Sporty', code: 'No codes available' },
          { platform: 'MSport', code: 'No codes available' }
        ]);
        
      } catch (error) {
        console.error('Error fetching matches:', error);
        
        // Fallback to empty data on error
        setMatches([]);
        setBookingCodes([
          { platform: 'Sporty', code: 'Error loading' },
          { platform: 'MSport', code: 'Error loading' }
        ]);
      } finally {
        setIsLoadingMatches(false);
      }
    }, [dateFilter]);
  
    // Fetch matches when component mounts or date changes
    useEffect(() => {
      fetchMatchesForDate(selectedDate);
    }, [selectedDate, fetchMatchesForDate]);
  
    // Fetch matches when custom date filter changes
    useEffect(() => {
      if (dateFilter) {
        fetchMatchesForDate('custom');
      }
    }, [dateFilter, fetchMatchesForDate]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Fetch VIP availability from API
  useEffect(() => {
    const fetchVipAvailability = async () => {
      try {
        console.log('Fetching VIP availability from API...');
        const response = await fetch('https://coral-app-l62hg.ondigitalocean.app/games/vip-list');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch VIP availability: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched VIP availability data:', data);
        
        // Transform API response to match expected state shape
        const transformedAvailability = {
          'VIP 1': false,
          'VIP 2': false,
          'VIP 3': false
        };
        
        data.forEach((vip: {id: number, name: string, amount: number, available: boolean}) => {
          // Transform name format: VIP1 -> "VIP 1", VIP2 -> "VIP 2", etc.
          const formattedName = vip.name.replace(/VIP(\d+)/, 'VIP $1');
          if (formattedName === 'VIP 1' || formattedName === 'VIP 2' || formattedName === 'VIP 3') {
            transformedAvailability[formattedName as keyof typeof transformedAvailability] = vip.available;
          }
        });
        
        console.log('Transformed VIP availability:', transformedAvailability);
        setVipAvailability(transformedAvailability);
        
      } catch (error) {
        console.error('Error fetching VIP availability:', error);
        // Keep default state (all false) on error
        console.log('Using default VIP availability state due to error');
      }
    };

    fetchVipAvailability();
    
    // Also check localStorage for any admin updates (fallback/secondary source)
    const checkLocalStorage = () => {
      const storedStatuses = localStorage.getItem('vipPlanStatuses');
      if (storedStatuses) {
        try {
          const parsedStatuses = JSON.parse(storedStatuses);
          console.log('Found localStorage VIP statuses:', parsedStatuses);
          // Only use localStorage if API data is not available
          setVipAvailability(prevState => {
            // Merge with API data, prioritizing API data over localStorage
            return { ...parsedStatuses, ...prevState };
          });
        } catch (error) {
          console.error('Error parsing VIP statuses from localStorage:', error);
        }
      }
    };

    // Listen for storage changes (when admin updates VIP status)
    const handleStorageChange = () => {
      console.log('Storage changed, checking for VIP status updates...');
      checkLocalStorage();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch VIP packages for today
  useEffect(() => {
    const fetchVipPackages = async () => {
      setIsLoadingVipPackages(true);
      try {
        console.log('Fetching VIP packages from API...');
        const response = await fetch('https://coral-app-l62hg.ondigitalocean.app/games/vip-for-today');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch VIP packages: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Fetched VIP packages data:', data);
        
        setVipPackages(data);
        
      } catch (error) {
        console.error('Error fetching VIP packages:', error);
        // Keep empty array on error
        setVipPackages([]);
      } finally {
        setIsLoadingVipPackages(false);
      }
    };

    fetchVipPackages();
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

  const handleBookingToggle = () => {
    setShowBookingDropdown(!showBookingDropdown);
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Helper function to get VIP package data by category
  const getVipPackageByCategory = (category: string) => {
    return vipPackages.find(pkg => pkg.category === category);
  };

  // Helper function to format category name for display
  const formatCategoryName = (category: string) => {
    return category.replace(/VIP(\d+)/, 'VIP $1');
  };

  const dates = [
    { id: 'yesterday', label: 'Yesterday', date: '2024-01-14' },
    { id: 'today', label: 'Today', date: '2024-01-15' },
    { id: 'tomorrow', label: 'Tomorrow', date: '2024-01-16' },
  ];

  const sports = [
    { id: 'all', label: 'All Sports' },
    { id: 'football', label: 'Football' },
    { id: 'basketball', label: 'Basketball' },
    { id: 'tennis', label: 'Tennis' },
  ];

  const predictions = [
    {
      id: 1,
      sport: 'Football',
      league: 'Premier League',
      match: 'Manchester United vs Liverpool',
      prediction: 'Over 2.5 Goals',
      odds: '1.85',
      confidence: 'High',
      time: '15:30',
      status: 'Live',
      isVip: false,
    },
    {
      id: 2,
      sport: 'Football',
      league: 'La Liga',
      match: 'Barcelona vs Real Madrid',
      prediction: 'Barcelona Win',
      odds: '2.10',
      confidence: 'Very High',
      time: '18:00',
      status: 'Upcoming',
      isVip: true,
    },
    {
      id: 3,
      sport: 'Basketball',
      league: 'NBA',
      match: 'Lakers vs Warriors',
      prediction: 'Lakers -5.5',
      odds: '1.90',
      confidence: 'High',
      time: '21:00',
      status: 'Upcoming',
      isVip: false,
    },
    {
      id: 4,
      sport: 'Tennis',
      league: 'ATP',
      match: 'Djokovic vs Nadal',
      prediction: 'Djokovic Win',
      odds: '1.75',
      confidence: 'Very High',
      time: '14:00',
      status: 'Live',
      isVip: true,
    },
  ];

  const vipPlans = [
    {
      name: 'Basic VIP',
      price: '$29',
      period: '/month',
      features: ['5 tips per day', 'Email support', 'Basic analytics'],
      popular: false,
    },
    {
      name: 'Premium VIP',
      price: '$59',
      period: '/month',
      features: ['15 tips per day', 'Priority support', 'Advanced analytics', 'Live chat'],
      popular: true,
    },
    {
      name: 'Elite VIP',
      price: '$99',
      period: '/month',
      features: ['Unlimited tips', '24/7 support', 'Full analytics', 'Personal tipster'],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Predictions</h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Get the best betting tips and predictions from our experts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

        {/* Date Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedDate('yesterday')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDate === 'yesterday' 
                  ? 'bg-green-500 hover:bg-green-600 text-white font-semibold' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Yesterday
            </button>
            <button 
              onClick={() => setSelectedDate('today')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDate === 'today' 
                  ? 'bg-green-500 hover:bg-green-600 text-white font-semibold' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Today
            </button>
            <button 
              onClick={() => setSelectedDate('tomorrow')}
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

        {/* Predictions Table */}
       <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 overflow-x-auto">
            <div className="min-w-full">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gradient-to-r from-green-500 to-green-600">
                  <tr>
                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      TEAMS
                    </th>
                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      TIPS
                    </th>
                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      RESULTS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingMatches ? (
                    <tr>
                      <td colSpan={3} className="px-4 sm:px-6 lg:px-8 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                          <span className="ml-2 text-gray-600">Loading matches...</span>
                        </div>
                      </td>
                    </tr>
                  ) : matches.length > 0 ? (
                    matches.map((match, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base font-semibold text-gray-900">
                          <div className="break-words">{match.teams}</div>
                        </td>
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base text-gray-700">
                          <div className="break-words">{match.tip}</div>
                        </td>
                        <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-center">
                          {match.result === 'won' ? (
                            <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full">
                              <span className="text-white font-bold text-sm sm:text-lg">✓</span>
                            </div>
                          ) : match.result === 'lost' ? (
                            <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full">
                              <span className="text-white font-bold text-sm sm:text-lg">✗</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full">
                              <span className="text-white font-bold text-xs sm:text-sm">?</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 sm:px-6 lg:px-8 py-8 text-center">
                        <div className="text-gray-600">No matches available for this date.</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Booking and View All Predictions Buttons */}
          <div className="text-center mt-6 sm:mt-8 space-y-3 sm:space-y-4 px-4">
            {/* Booking Button with Dropdown */}
            <div className="relative inline-block" ref={bookingDropdownRef}>
              <button
                onClick={handleBookingToggle}
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
              >
                Booking
              </button>
              
              {/* Booking Dropdown */}
              {showBookingDropdown && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 sm:left-0 sm:transform-none mt-2 w-56 sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Booking Codes</h3>
                    <div className="space-y-2">
                      {bookingCodes.map((booking, index) => (
                        <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base">
                            <span className="break-all">{booking.platform}:{booking.code}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(`${booking.platform}:${booking.code}`, index)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors min-w-[40px] text-center flex-shrink-0"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === index ? (
                              <span className="text-xs sm:text-sm font-semibold">Copied!</span>
                            ) : (
                              <FaCopy className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        {/* Match Prediction Cards */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Today's Featured Matches
            </h2>
            <p className="text-gray-600">
              Premium predictions with high confidence ratings
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
                  {isLoadingVipPackages ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                      <span className="ml-2 text-gray-600">Loading matches...</span>
                    </div>
                  ) : getVipPackageByCategory('VIP1') ? (
                    <ul className="space-y-2">
                      {getVipPackageByCategory('VIP1')!.games.map((game, index) => (
                        <li key={index} className="text-gray-900 font-semibold">
                          {game.home_team} vs {game.away_team}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-600 text-center py-4">
                      No matches available
                    </div>
                  )}
                </div>
                {vipAvailability['VIP 1'] ? (
                  getVipPackageByCategory('VIP1') ? (
                    <PaymentDropdown
                      packageName="VIP 1"
                      price={`GHS ${getVipPackageByCategory('VIP1')!.price}`}
                      priceInGHS={Number(getVipPackageByCategory('VIP1')!.price)}
                      priceInUSD={Math.round(Number(getVipPackageByCategory('VIP1')!.price) * 0.15)}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentClose={handlePaymentClose}
                    />
                  ) : (
                    <div className="bg-gray-500 text-white py-3 px-4 rounded-lg font-bold text-lg">
                      NOT AVAILABLE
                    </div>
                  )
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
                  {isLoadingVipPackages ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                      <span className="ml-2 text-gray-600">Loading matches...</span>
                    </div>
                  ) : getVipPackageByCategory('VIP2') ? (
                    <ul className="space-y-2">
                      {getVipPackageByCategory('VIP2')!.games.map((game, index) => (
                        <li key={index} className="text-gray-900 font-semibold">
                          {game.home_team} vs {game.away_team}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-600 text-center py-4">
                      No matches available
                    </div>
                  )}
                </div>
                {vipAvailability['VIP 2'] ? (
                  getVipPackageByCategory('VIP2') ? (
                    <PaymentDropdown
                      packageName="VIP 2"
                      price={`GHS ${getVipPackageByCategory('VIP2')!.price}`}
                      priceInGHS={Number(getVipPackageByCategory('VIP2')!.price)}
                      priceInUSD={Math.round(Number(getVipPackageByCategory('VIP2')!.price) * 0.15)}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentClose={handlePaymentClose}
                    />
                  ) : (
                    <div className="bg-gray-500 text-white py-3 px-4 rounded-lg font-bold text-lg">
                      NOT AVAILABLE
                    </div>
                  )
                ) : (
                  <div className="bg-red-500 text-white py-3 px-4 rounded-lg font-bold text-lg">
                    SOLD OUT
                  </div>
                )}
              </div>
            </div>

            {/* VIP Package 3 */}
            <div className={`bg-white border rounded-lg shadow-lg p-6 transition-shadow ${
              vipAvailability['VIP 3'] 
                ? 'border-gray-200 hover:shadow-xl' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">VIP 3</h3>
                <div className="mb-6 text-left space-y-4">
                  {isLoadingVipPackages ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                      <span className="ml-2 text-gray-600">Loading matches...</span>
                    </div>
                  ) : getVipPackageByCategory('VIP3') ? (
                    getVipPackageByCategory('VIP3')!.games.map((game, index) => (
                      <div key={index} className={`${index < getVipPackageByCategory('VIP3')!.games.length - 1 ? 'border-b border-gray-100 pb-3' : ''}`}>
                        <h4 className="text-gray-900 font-semibold mb-2">{game.home_team} vs {game.away_team}</h4>
                        <div className="text-sm text-gray-600 mb-2">Prediction: {game.prediction}</div>
                        <div className="text-sm text-gray-600 mb-2">Odds: {game.odds}</div>
                        <div className="flex items-center gap-2">
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Option: {game.prediction}</span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">Odds: {game.odds}</span>
                          <span className="ml-auto">
                            {game.match_status === 'won' ? (
                              <div className="inline-flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                                <span className="text-white font-bold text-sm">✓</span>
                              </div>
                            ) : game.match_status === 'lost' ? (
                              <div className="inline-flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                                <span className="text-white font-bold text-sm">✗</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full">
                                <span className="text-white font-bold text-sm">?</span>
                              </div>
                            )}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-600 text-center py-4">
                      No matches available
                    </div>
                  )}
                </div>
                {/* Show payment button if available and no results yet, otherwise show status */}
                {vipAvailability['VIP 3'] ? (
                  getVipPackageByCategory('VIP3') ? (
                    // Check if any matches have results (won/lost) - if so, don't show payment button
                    getVipPackageByCategory('VIP3')!.games.some(game => game.match_status === 'won' || game.match_status === 'lost') ? (
                      <div className="bg-blue-500 text-white py-3 px-4 rounded-lg font-bold text-lg mt-4">
                        RESULTS UPLOADED
                      </div>
                    ) : (
                      <PaymentDropdown
                        packageName="VIP 3"
                        price={`GHS ${getVipPackageByCategory('VIP3')!.price}`}
                        priceInGHS={Number(getVipPackageByCategory('VIP3')!.price)}
                        priceInUSD={Math.round(Number(getVipPackageByCategory('VIP3')!.price) * 0.15)}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentClose={handlePaymentClose}
                      />
                    )
                  ) : (
                    <div className="bg-gray-500 text-white py-3 px-4 rounded-lg font-bold text-lg">
                      NOT AVAILABLE
                    </div>
                  )
                ) : (
                  <div className="bg-red-500 text-white py-3 px-4 rounded-lg font-bold text-lg">
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
