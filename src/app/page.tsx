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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat min-h-screen bg-gray-800" 
               style={{ backgroundImage: 'url("/A1 Tips hero.png")' }}>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center pt-96">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={isAuthenticated ? "/vip" : "/login"}
                className="bg-black hover:bg-gray-800 text-green-400 font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
              >
                Join VIP
              </Link>
              <Link
                href={isAuthenticated ? "/predictions" : "/login"}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <FaTelegram className="w-5 h-5" />
                Join Telegram
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Free Tips & Predictions Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Free Tips & Predictions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get our latest free predictions and match analysis
            </p>
          </div>

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

          {/* Match Predictions Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-500 to-green-600">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    TEAMS
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    TIPS
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    RESULTS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getMatchesForDate(selectedDate).map((match, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900">
                      {match.teams}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-700">
                      {match.tip}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-center">
                      {match.result === 'won' ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                          <span className="text-white font-bold text-lg">✓</span>
                        </div>
                      ) : match.result === 'lost' ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
                          <span className="text-white font-bold text-lg">✗</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full">
                          <span className="text-white font-bold text-sm">?</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900">
                    Barcelona vs Real Madrid
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base text-gray-700">
                    BTTS - Yes
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
                      <span className="text-white font-bold text-lg">✗</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900">
                    Manchester City vs Napoli
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base text-gray-700">
                    Over 1.5 Goals
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                      <span className="text-white font-bold text-lg">✓</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900">
                    Eintracht Frankfurt vs Galatasaray
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base text-gray-700">
                    Away Win
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full">
                      <span className="text-white font-bold text-sm">?</span>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900">
                    Newcastle United vs FC Barcelona
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base text-gray-700">
                    Over 1.5 Goals
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                      <span className="text-white font-bold text-lg">✓</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Booking and View All Predictions Buttons */}
          <div className="text-center mt-8 space-y-4">
            {/* Booking Button with Dropdown */}
            <div className="relative inline-block" ref={bookingDropdownRef}>
              <button
                onClick={handleBookingToggle}
                className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
              >
                Booking
              </button>
              
              {/* Booking Dropdown */}
              {showBookingDropdown && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Codes</h3>
                    <div className="space-y-2">
                      {bookingCodes.map((booking, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900">
                            {booking.platform}:{booking.code}
                          </div>
                          <button
                            onClick={() => copyToClipboard(`${booking.platform}:${booking.code}`, index)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors min-w-[40px] text-center"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === index ? (
                              <span className="text-sm font-semibold">Copied!</span>
                            ) : (
                              <FaCopy className="w-4 h-4" />
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
            <div className="mt-4">
              <Link
                href={isAuthenticated ? "/predictions" : "/login"}
                className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
              >
                View All Predictions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose A1Tips?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the most accurate and profitable betting tips in the industry
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">{winRate}%</div>
              <div className="text-lg text-black">Win Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">
                {userCount >= 1000 ? `${(userCount / 1000).toFixed(0)}K+` : userCount}
              </div>
              <div className="text-lg text-black">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">{userRating}★</div>
              <div className="text-lg text-black">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Winning?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join A1Tips today and get access to our premium betting tips and predictions
          </p>
          <div className="flex justify-center">
            <Link
              href={isAuthenticated ? "/vip" : "/login"}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              {isAuthenticated ? "Access VIP" : "Get Started"}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
