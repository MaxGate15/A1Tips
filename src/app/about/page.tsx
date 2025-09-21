'use client';

import { FaTrophy, FaUsers, FaChartLine, FaGlobe, FaStar, FaShieldAlt, FaClock, FaHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function About() {
  const [winRate, setWinRate] = useState(1);
  const [users, setUsers] = useState(1);
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Animate win rate from 1 to 85
      const winRateInterval = setInterval(() => {
        setWinRate(prev => {
          if (prev >= 85) {
            clearInterval(winRateInterval);
            return 85;
          }
          return prev + 1;
        });
      }, 30);

      // Animate users from 1 to 10000
      const usersInterval = setInterval(() => {
        setUsers(prev => {
          if (prev >= 10000) {
            clearInterval(usersInterval);
            return 10000;
          }
          return prev + 100;
        });
      }, 30);

      // Animate rating from 1 to 5
      const ratingInterval = setInterval(() => {
        setRating(prev => {
          if (prev >= 5) {
            clearInterval(ratingInterval);
            return 5;
          }
          return prev + 0.1;
        });
      }, 50);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-green-500">A1Tips</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your trusted partner in sports betting success. We combine years of 
              betting expertise, market analysis, and insider knowledge to deliver winning tips.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                A1Tips was founded by a team of professional bettors who spent years 
                studying sports markets, analyzing team performance, and understanding 
                the nuances of betting. We know what it takes to win consistently in 
                sports betting.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our team includes former professional sports analysts, experienced 
                tipsters, and successful bettors who have made millions from betting. 
                We share our knowledge and winning strategies with our community.
              </p>
            </div>
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8">
                <div className="text-center">
                  <FaTrophy className="text-6xl text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Proven Track Record</h3>
                  <p className="text-gray-600">
                    Our consistent winning performance speaks for itself. Join thousands of 
                    successful bettors who trust A1Tips for profitable betting.
                  </p>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-500">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">
            Our Mission
          </h2>
          <p className="text-xl md:text-2xl text-black max-w-4xl mx-auto mb-12">
            To provide every sports bettor with winning tips, insider knowledge, 
            and proven betting strategies that generate consistent profits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <FaGlobe className="text-4xl text-black mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-2">Global Markets</h3>
              <p className="text-black">
                Covering major leagues worldwide with expert analysis of all major sports.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <FaShieldAlt className="text-4xl text-black mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-2">Trusted Tips</h3>
              <p className="text-black">
                Our tips are backed by years of betting experience and proven winning strategies.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
              <FaClock className="text-4xl text-black mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-2">24/7 Tips</h3>
              <p className="text-black">
                Daily tips and predictions available around the clock for all major matches.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose A1Tips?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another tipster service. Here's what makes us different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaTrophy className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-gray-600">
                85% win rate with consistent performance across all sports
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaChartLine className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Analysis</h3>
              <p className="text-gray-600">
                Deep sports knowledge and market analysis for profitable betting opportunities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaShieldAlt className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Transparent</h3>
              <p className="text-gray-600">
                Complete transparency with detailed betting analysis and winning strategies
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <FaHeart className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Profit-Focused</h3>
              <p className="text-gray-600">
                Your betting profits are our success. We're committed to your winning journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">{winRate}%</div>
              <div className="text-xl md:text-2xl font-semibold text-black">Win Rate</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">{users >= 1000 ? `${Math.floor(users/1000)}K+` : `${users}+`}</div>
              <div className="text-xl md:text-2xl font-semibold text-black">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">{rating.toFixed(1)}★</div>
              <div className="text-xl md:text-2xl font-semibold text-black">User Rating</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-black mb-2">24/7</div>
              <div className="text-xl md:text-2xl font-semibold text-black">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join Our Winning Community?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your journey to betting profits with A1Tips today. 
            Join thousands of successful bettors who trust our winning tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/vip"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
            >
              Join VIP Now
            </a>
            <a
              href="/predictions"
              className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              View Free Tips
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
