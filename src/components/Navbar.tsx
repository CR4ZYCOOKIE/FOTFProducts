import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Shield, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgotPassword'>('signin');

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-500" />
              <span className="ml-2 text-xl font-bold text-white">DayZ Premium</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Products
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setIsAuthModalOpen(true);
                    }}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setIsAuthModalOpen(true);
                    }}
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button className="text-gray-400 hover:text-white p-2">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
      />
    </nav>
  );
};

export default Navbar;