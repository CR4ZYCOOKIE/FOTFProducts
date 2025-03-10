import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogIn, LogOut, UserCircle } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgotPassword'>('signin');

  const handleSignOut = async () => {
    logout();
    toast.success('Successfully signed out');
  };

  const openAuthModal = (mode: 'signin' | 'signup' | 'forgotPassword') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">FOTF Products</Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">Home</Link>
          <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
          {user && (
            <Link to="/dashboard" className="text-white hover:text-gray-300">Dashboard</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-white hover:text-gray-300">Admin</Link>
          )}
        </div>
        
        {/* Authentication */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">{user.username}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center text-white hover:text-gray-300"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => openAuthModal('signin')}
                className="flex items-center text-white hover:text-gray-300"
              >
                <LogIn className="h-5 w-5 mr-1" />
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                <UserCircle className="h-5 w-5 mr-1" />
                Sign Up
              </button>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 p-4 mt-2">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="text-white hover:text-gray-300">Home</Link>
            <Link to="/products" className="text-white hover:text-gray-300">Products</Link>
            {user && (
              <Link to="/dashboard" className="text-white hover:text-gray-300">Dashboard</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-white hover:text-gray-300">Admin</Link>
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center text-white hover:text-gray-300"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Sign Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="flex items-center text-white hover:text-gray-300"
                >
                  <LogIn className="h-5 w-5 mr-1" />
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="flex items-center text-white hover:text-gray-300"
                >
                  <UserCircle className="h-5 w-5 mr-1" />
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </nav>
  );
};

export default Navbar;