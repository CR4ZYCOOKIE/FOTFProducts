import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    features: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
    fetchProducts();
  }, [user]);

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
    setLoading(false);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      toast.error('Error fetching products');
      return;
    }

    setProducts(data || []);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...newProduct,
        features: newProduct.features?.filter(f => f.trim() !== '') || [],
      }]);

    if (error) {
      toast.error('Error creating product');
      return;
    }

    toast.success('Product created successfully');
    fetchProducts();
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      features: [],
    });
  };

  const handleProductUpdate = async (id: string, updates: Partial<Product>) => {
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast.error('Error updating product');
      return;
    }

    toast.success('Product updated successfully');
    fetchProducts();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Add New Product Form */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Add New Product</h2>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Price</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                required
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Features (one per line)</label>
              <textarea
                value={newProduct.features?.join('\n')}
                onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value.split('\n') })}
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                rows={4}
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Existing Products</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-white">{product.name}</h3>
                <p className="text-gray-400">{product.description}</p>
                <p className="text-indigo-400">${product.price}</p>
                <ul className="mt-2 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-300">• {feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handleProductUpdate(product.id, { price: product.price + 1 })}
                  className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;