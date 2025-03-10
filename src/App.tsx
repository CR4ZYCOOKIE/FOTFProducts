import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './contexts/AuthContext';
import { Shield, Swords, Users } from 'lucide-react';
import { supabase } from './lib/supabase';

const products = [
  {
    id: 1,
    name: 'Basic Access',
    price: 9.99,
    features: [
      'Basic server access',
      'Standard loot tables',
      'Community Discord access'
    ],
    icon: Shield
  },
  {
    id: 2,
    name: 'Premium Access',
    price: 19.99,
    features: [
      'Premium server access',
      'Enhanced loot tables',
      'Priority support',
      'Custom spawn locations'
    ],
    icon: Swords
  },
  {
    id: 3,
    name: 'VIP Access',
    price: 29.99,
    features: [
      'VIP server access',
      'Elite loot tables',
      '24/7 Priority support',
      'Custom spawn locations',
      'Private Discord channels',
      'Server events participation'
    ],
    icon: Users
  }
];

function App() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }

      setIsAdmin(!!data?.is_admin);
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/products" element={<Products products={products} />} />
          {user && <Route path="/dashboard" element={<Dashboard />} />}
          {user && isAdmin ? (
            <Route path="/admin" element={<AdminDashboard />} />
          ) : (
            <Route path="/admin" element={<Navigate to="/" />} />
          )}
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App