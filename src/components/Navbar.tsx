'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaBell, FaUser, FaTachometerAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout, user } = useAuth();
  const showAuthedUI = isAuthenticated || isAdmin;

  // Check admin status from localStorage
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('is_admin');
    if (adminLoggedIn === '1') {
      setIsAdmin(true);
    }
  }, [isAuthenticated]); // Re-check when authentication state changes

  // Debug authentication state
  useEffect(() => {
    console.log('🧭 Navbar: Authentication state changed - isAuthenticated:', isAuthenticated, 'user:', user, 'isAdmin:', isAdmin);
  }, [isAuthenticated, user, isAdmin]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-green-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-black">
              A1Tips
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-black hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/predictions"
                className="text-black hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Predictions
              </Link>
              <Link
                href="/about"
                className="text-black hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About Us
              </Link>
              {/* Admin button - only show if user is admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-black hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right side - Notifications and Profile (only for authenticated users) */}
          {showAuthedUI && (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                  <FaBell className="h-5 w-5" />
                </button>
                <div className="ml-3 relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <FaUser className="h-5 w-5" />
                  </button>
                  
                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaTachometerAlt className="mr-3 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FaCog className="mr-3 h-4 w-4" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          // Clear any admin-related flags as well
                          try {
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('username');
                            localStorage.removeItem('email');
                            localStorage.removeItem('is_admin');
                            localStorage.removeItem('token_type');
                            localStorage.removeItem('adminLoggedIn');
                            localStorage.removeItem('adminUser');
                          } catch {}
                          logout();
                        }}
                      >
                        <FaSignOutAlt className="mr-3 h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Login/Register buttons for non-authenticated users */}
          {!showAuthedUI && (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <Link
                  href="/login"
                  className="text-black hover:bg-green-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-black hover:bg-gray-800 text-green-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-green-400 inline-flex items-center justify-center p-2 rounded-md text-black hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            >
              {isMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-green-400">
            <Link
              href="/"
              className="text-black hover:bg-green-500 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/predictions"
              className="text-black hover:bg-green-500 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Predictions
            </Link>
            <Link
              href="/about"
              className="text-black hover:bg-green-500 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            
            {/* Admin button - only show if user is admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className="bg-red-600 hover:bg-red-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            
            {/* Mobile authentication options */}
            {!showAuthedUI ? (
              <>
                <hr className="my-2 border-gray-300" />
                <Link
                  href="/login"
                  className="text-black hover:bg-green-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-black text-green-400 hover:bg-gray-800 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <hr className="my-2 border-gray-300" />
                <Link
                  href="/dashboard"
                  className="text-black hover:bg-green-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-black hover:bg-green-500 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="text-red-600 hover:bg-red-50 w-full text-left block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => {
                    setIsMenuOpen(false);
                    try {
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('username');
                      localStorage.removeItem('email');
                      localStorage.removeItem('is_admin');
                      localStorage.removeItem('token_type');
                      localStorage.removeItem('adminLoggedIn');
                      localStorage.removeItem('adminUser');
                    } catch {}
                    logout();
                  }}
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
