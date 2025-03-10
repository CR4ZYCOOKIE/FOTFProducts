import React, { useState } from 'react';
import { Shield, Swords, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { createSubscription } from '../lib/stripe';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/AuthModal';

interface Product {
  id: number;
  name: string;
  price: number;
  features: string[];
  icon: React.ElementType;
}

interface ProductsProps {
  products: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const { user } = useAuth();
  const [discordUsername, setDiscordUsername] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSubscribe = async (product: Product) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!discordUsername.trim()) {
      toast.error('Please enter your Discord username');
      return;
    }

    try {
      setSelectedProduct(product);
      // Note: You'll need to replace 'price_id' with actual Stripe price IDs
      await createSubscription(`price_${product.id}`, discordUsername);
      toast.success('Redirecting to payment...');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to create subscription. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Choose Your Access Level
          </h2>
          <p className="mt-4 text-xl text-gray-400">
            Select the plan that best fits your gaming needs
          </p>
        </div>

        <div className="mt-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center">
                    <product.icon className="h-12 w-12 text-indigo-500" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-white text-center">
                    {product.name}
                  </h3>
                  <p className="mt-4 text-3xl font-extrabold text-white text-center">
                    ${product.price}
                    <span className="text-xl font-normal text-gray-400">/month</span>
                  </p>
                  <ul className="mt-6 space-y-4">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 pb-6">
                  <input
                    type="text"
                    placeholder="Enter Discord Username"
                    className="w-full mb-4 px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                  />
                  <button
                    onClick={() => handleSubscribe(product)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Subscribe Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            All subscriptions include automatic monthly billing and can be canceled anytime from your dashboard.
          </p>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode="signup"
      />
    </div>
  );
};

export default Products;