'use client';

import Link from 'next/link';
import { FaTrophy, FaChartLine, FaCrown, FaUsers, FaStar, FaTelegram, FaCopy } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [dateFilter, setDateFilter] = useState('');
  const [showBookingDropdown, setShowBookingDropdown] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [winRate, setWinRate] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const { isAuthenticated } = useAuth();
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

  // Animate counters on page load
  useEffect(() => {
    const animateCounter = (setter: (value: number) => void, target: number, duration: number = 2000) => {
      const startTime = Date.now();
      const startValue = 0;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
        
        setter(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };

    // Start animations with slight delays for staggered effect
    setTimeout(() => animateCounter(setWinRate, 85), 500);
    setTimeout(() => animateCounter(setUserCount, 10000), 800);
    setTimeout(() => animateCounter(setUserRating, 5), 1100);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateFilter(e.target.value);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
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

  // Booking codes for different platforms
  const bookingCodes = [
    { platform: 'Sporty', code: 'hdhd' },
    { platform: 'MSport', code: 'mspt' },
  ];

  // Sample matches data for different dates
  const getMatchesForDate = (date: string) => {
    const matches = {
      yesterday: [
        { teams: 'Manchester United vs Arsenal', tip: 'Over 2.5 Goals', result: 'won' },
        { teams: 'Chelsea vs Liverpool', tip: 'Home Win', result: 'lost' },
        { teams: 'Tottenham vs Manchester City', tip: 'BTTS - Yes', result: 'won' },
      ],
      today: [
        { teams: 'Arsenal vs Chelsea', tip: 'Home Win', result: 'won' },
        { teams: 'Manchester United vs Liverpool', tip: 'Over 2.5 Goals', result: 'pending' },
        { teams: 'Barcelona vs Real Madrid', tip: 'BTTS - Yes', result: 'lost' },
        { teams: 'Manchester City vs Napoli', tip: 'Over 1.5 Goals', result: 'won' },
        { teams: 'Eintracht Frankfurt vs Galatasaray', tip: 'Away Win', result: 'pending' },
        { teams: 'Newcastle United vs FC Barcelona', tip: 'Over 1.5 Goals', result: 'won' },
      ],
      tomorrow: [
        { teams: 'Juventus vs AC Milan', tip: 'Home Win', result: 'pending' },
        { teams: 'PSG vs Bayern Munich', tip: 'Over 3.5 Goals', result: 'pending' },
        { teams: 'Inter Milan vs Napoli', tip: 'Away Win', result: 'pending' },
      ]
    };
    return matches[date as keyof typeof matches] || matches.today;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-green-100 overflow-hidden lg:min-h-screen lg:bg-cover lg:bg-center lg:bg-no-repeat lg:bg-gray-800" 
               style={{ backgroundImage: 'url("/A1 Tips hero.png")' }}>
        {/* Mobile Image Container - Only visible on mobile/tablet */}
        <div className="w-full max-w-4xl mx-auto overflow-hidden lg:hidden">
          <img 
            className="w-full h-auto object-contain object-center"
            src="/A1 Tips hero.png"
            alt="AI TIPS - Sports Betting Tips Hero"
          />
        </div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-green-200 bg-opacity-20 lg:bg-black lg:bg-opacity-40"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 lg:max-w-7xl">
          <div className="flex flex-col justify-center lg:justify-end lg:h-full lg:min-h-screen">
            <div className="text-center pt-6 sm:pt-8 lg:pt-0 lg:pb-8 lg:pb-16 lg:pb-20">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-2">
                <Link
                  href={isAuthenticated ? "/vip" : "/login"}
                  className="w-full sm:w-auto bg-black hover:bg-gray-800 text-green-400 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors shadow-lg text-center"
                >
                  Join VIP
                </Link>
                <Link
                  href="https://t.me/+9ABbjlg7wpM1Mzc0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <FaTelegram className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Join </span>Telegram
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Tips & Predictions Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Free Tips & Predictions
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Get our latest free predictions and match analysis
            </p>
          </div>

                  {/* Date Navigation */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-4">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button 
                        onClick={() => handleDateSelect('yesterday')}
                        className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                          selectedDate === 'yesterday' 
                            ? 'bg-green-500 hover:bg-green-600 text-white font-semibold' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        Yesterday
                      </button>
                      <button 
                        onClick={() => handleDateSelect('today')}
                        className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                          selectedDate === 'today' 
                            ? 'bg-green-500 hover:bg-green-600 text-white font-semibold' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        Today
                      </button>
                      <button 
                        onClick={() => handleDateSelect('tomorrow')}
                        className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
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
                        className="px-3 sm:px-4 py-2 border-2 border-green-500 text-green-500 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer text-sm sm:text-base"
                      />
                    </div>
                  </div>

          {/* Match Predictions Table */}
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
                  {getMatchesForDate(selectedDate).map((match, index) => (
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
                  ))}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base font-semibold text-gray-900">
                      <div className="break-words">Barcelona vs Real Madrid</div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base text-gray-700">
                      <div className="break-words">BTTS - Yes</div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-center">
                      <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full">
                        <span className="text-white font-bold text-sm sm:text-lg">✗</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base font-semibold text-gray-900">
                      <div className="break-words">Manchester City vs Napoli</div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base text-gray-700">
                      <div className="break-words">Over 1.5 Goals</div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-center">
                      <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full">
                        <span className="text-white font-bold text-sm sm:text-lg">✓</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base font-semibold text-gray-900">
                      <div className="break-words">Eintracht Frankfurt vs Galatasaray</div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base text-gray-700">
                      <div className="break-words">Away Win</div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-center">
                      <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full">
                        <span className="text-white font-bold text-xs sm:text-sm">?</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base font-semibold text-gray-900">
                      <div className="break-words">Newcastle United vs FC Barcelona</div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base text-gray-700">
                      <div className="break-words">Over 1.5 Goals</div>
                    </td>
                    <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 text-center">
                      <div className="inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full">
                        <span className="text-white font-bold text-sm sm:text-lg">✓</span>
                      </div>
                    </td>
                  </tr>
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

            {/* View All Predictions Button */}
            <div className="mt-3 sm:mt-4">
              <Link
                href={isAuthenticated ? "/predictions" : "/login"}
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
              >
                View All Predictions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose A1Tips?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              We provide the most accurate and profitable betting tips in the industry
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-green-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="py-4 sm:py-0">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">{winRate}%</div>
              <div className="text-base sm:text-lg text-black">Win Rate</div>
            </div>
            <div className="py-4 sm:py-0">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">
                {userCount >= 1000 ? `${(userCount / 1000).toFixed(0)}K+` : userCount}
              </div>
              <div className="text-base sm:text-lg text-black">Happy Users</div>
            </div>
            <div className="py-4 sm:py-0">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2">{userRating}★</div>
              <div className="text-base sm:text-lg text-black">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Start Winning?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
            Join A1Tips today and get access to our premium betting tips and predictions
          </p>
          <div className="flex justify-center">
            <Link
              href={isAuthenticated ? "/vip" : "/login"}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg text-base sm:text-lg transition-colors shadow-lg"
            >
              {isAuthenticated ? "Access VIP" : "Get Started"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
