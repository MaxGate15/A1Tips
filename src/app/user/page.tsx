'use client';

import { useState } from 'react';
import { FaUser, FaEdit, FaCrown, FaTrophy, FaChartLine, FaCog, FaBell, FaCopy, FaCheck } from 'react-icons/fa';

export default function User() {
  const [activeTab, setActiveTab] = useState('profile');
  const [copiedCodes, setCopiedCodes] = useState({});

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 2024',
    vipStatus: 'Premium VIP',
    totalWinnings: '$12,450',
    winRate: '85.2%',
    totalTips: 1247,
    avatar: null,
  };

  const stats = [
    { label: 'Total Winnings', value: '$12,450', icon: FaTrophy, color: 'text-green-600' },
    { label: 'Win Rate', value: '85.2%', icon: FaChartLine, color: 'text-blue-600' },
    { label: 'Total Tips', value: '1,247', icon: FaTrophy, color: 'text-purple-600' },
    { label: 'VIP Status', value: 'Premium', icon: FaCrown, color: 'text-yellow-600' },
  ];

  const recentActivity = [
    { action: 'Won bet on Manchester United vs Liverpool', amount: '+$42.50', time: '2 hours ago', type: 'win' },
    { action: 'Placed bet on Barcelona vs Real Madrid', amount: '$100', time: '4 hours ago', type: 'bet' },
    { action: 'Won bet on Lakers vs Warriors', amount: '+$56.25', time: '1 day ago', type: 'win' },
    { action: 'Upgraded to Premium VIP', amount: '$59', time: '3 days ago', type: 'upgrade' },
  ];

  const purchasedGames = [
    {
      id: 1,
      packageName: 'VIP 1',
      gameCount: 4,
      price: 'GHS 20',
      status: 'Active',
      purchaseDate: '2024-01-15',
      sportyCode: 'SP123456',
      msportCode: 'MS789012',
      games: [
        { match: 'Olympiacos vs Pafos FC', prediction: 'Home Win', odds: '1.45', status: 'pending' },
        { match: 'Ajax vs Inter', prediction: 'Over 2.5 Goals', odds: '1.78', status: 'pending' },
        { match: 'Bayern Munich vs Chelsea', prediction: 'BTTS - Yes', odds: '1.65', status: 'pending' },
        { match: 'Liverpool vs Atletico Madrid', prediction: 'Away Win', odds: '2.10', status: 'pending' }
      ]
    },
    {
      id: 2,
      packageName: 'VIP 2',
      gameCount: 3,
      price: 'GHS 35',
      status: 'Active',
      purchaseDate: '2024-01-14',
      sportyCode: 'SP654321',
      msportCode: 'MS210987',
      games: [
        { match: 'Real Madrid vs PSG', prediction: 'Home Win', odds: '1.85', status: 'won' },
        { match: 'Arsenal vs Man City', prediction: 'Over 3.5 Goals', odds: '2.20', status: 'lost' },
        { match: 'Juventus vs AC Milan', prediction: 'BTTS - Yes', odds: '1.90', status: 'pending' }
      ]
    }
  ];

  const copyToClipboard = async (text, codeId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCodes(prev => ({ ...prev, [codeId]: true }));
      setTimeout(() => {
        setCopiedCodes(prev => ({ ...prev, [codeId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-black mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-xl text-black text-opacity-80 mb-4">
                {user.email}
              </p>
              <div className="flex items-center justify-center md:justify-start space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  <FaCrown className="w-4 h-4 mr-1" />
                  {user.vipStatus}
                </span>
                <span className="text-black text-opacity-80">
                  Member since {user.memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'profile', name: 'Profile', icon: FaUser },
              { id: 'purchased', name: 'Purchased Games', icon: FaTrophy },
              { id: 'stats', name: 'Statistics', icon: FaChartLine },
              { id: 'activity', name: 'Activity', icon: FaBell },
              { id: 'settings', name: 'Settings', icon: FaCog },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-6 rounded-md transition-colors">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">VIP Status</span>
                    <span className="font-medium text-yellow-600">Premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">{user.memberSince}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email Verified</span>
                    <span className="font-medium text-green-600">Yes</span>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 text-gray-700">
                    Change Password
                  </button>
                  <button className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 text-gray-700">
                    Download Data
                  </button>
                  <button className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 text-gray-700">
                    Privacy Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchased Games Tab */}
        {activeTab === 'purchased' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Your Purchased Games</h3>
              
              {purchasedGames.map((packageItem) => (
                <div key={packageItem.id} className="mb-8 p-6 bg-gray-50 rounded-lg border">
                  {/* Package Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {packageItem.packageName} ({packageItem.gameCount} games)
                      </h4>
                      <p className="text-sm text-gray-600">Purchased: {packageItem.purchaseDate}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{packageItem.price}</div>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {packageItem.status}
                      </span>
                    </div>
                  </div>

                  {/* Booking Codes Section */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="text-sm font-semibold text-blue-900 mb-2">Booking Codes:</h5>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-blue-700 font-medium">SportyBet:</span>
                        <span className="text-sm font-mono bg-white px-2 py-1 rounded border">{packageItem.sportyCode}</span>
                        <button
                          onClick={() => copyToClipboard(packageItem.sportyCode, `sporty_${packageItem.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {copiedCodes[`sporty_${packageItem.id}`] ? (
                            <FaCheck className="w-4 h-4" />
                          ) : (
                            <FaCopy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-blue-700 font-medium">MSport:</span>
                        <span className="text-sm font-mono bg-white px-2 py-1 rounded border">{packageItem.msportCode}</span>
                        <button
                          onClick={() => copyToClipboard(packageItem.msportCode, `msport_${packageItem.id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {copiedCodes[`msport_${packageItem.id}`] ? (
                            <FaCheck className="w-4 h-4" />
                          ) : (
                            <FaCopy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Games List */}
                  <div>
                    <h5 className="text-sm font-semibold text-gray-900 mb-3">Full Details:</h5>
                    <div className="space-y-3">
                      {packageItem.games.map((game, gameIndex) => (
                        <div key={gameIndex} className="flex justify-between items-center p-3 bg-white rounded border">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{game.match}</div>
                            <div className="text-sm text-gray-600">{game.prediction}</div>
                            <div className="text-sm text-gray-500">Odds: {game.odds}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              game.status === 'won' ? 'bg-green-500' :
                              game.status === 'lost' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`}></div>
                            <span className="text-xs text-gray-500 capitalize">{game.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Performance Chart</h3>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          activity.type === 'win'
                            ? 'bg-green-100 text-green-800'
                            : activity.type === 'bet'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {activity.amount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive tips and updates via email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-500">Receive urgent updates via SMS</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive notifications on your device</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Privacy Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Activity Sharing</p>
                    <p className="text-sm text-gray-500">Share your betting activity with friends</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
