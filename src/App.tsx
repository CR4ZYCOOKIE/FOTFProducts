import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './contexts/AuthContext';
import { Shield, Swords, Users } from 'lucide-react';

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

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home products={products} />} />
          <Route path="/products" element={<Products products={products} />} />
          {user && <Route path="/dashboard" element={<Dashboard />} />}
          {user && <Route path="/admin" element={<AdminDashboard />} />}
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App