'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (in real app, this would check JWT token, cookies, etc.)
    const checkAuth = () => {
      try {
        // Simulate checking localStorage for user data
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          console.log('🔐 Auth: User found in localStorage:', parsedUser);
        } else {
          console.log('🔐 Auth: No user found in localStorage');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        console.log('🔐 Auth: Storage changed, rechecking auth');
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userData: User) => {
    console.log('🔐 Auth: Logging in user:', userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    console.log('🔐 Auth: User state updated, isAuthenticated:', !!userData);
  };

  const logout = () => {
    console.log('🔐 Auth: Logging out user');
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
};
