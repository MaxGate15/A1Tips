import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaTelegram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-green-400 mb-4">A1Tips</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner for premium sports betting tips and predictions. 
              Join thousands of successful bettors who trust A1Tips for their winning strategies.
            </p>
            <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FaFacebook className="h-6 w-6" />
              </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FaTwitter className="h-6 w-6" />
              </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FaInstagram className="h-6 w-6" />
              </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                <FaTelegram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/predictions" className="text-gray-300 hover:text-green-400 transition-colors">
                  Predictions
                </Link>
              </li>
              <li>
                <Link href="/vip" className="text-gray-300 hover:text-green-400 transition-colors">
                  VIP Plans
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-gray-300 hover:text-green-400 transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-green-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-green-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-green-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-green-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 A1Tips. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Responsible Gaming • 18+ Only
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
