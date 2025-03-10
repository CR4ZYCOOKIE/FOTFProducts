import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { productService, Product } from '../lib/api';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    features: [],
  });
  const [loading, setLoading] = useState(true);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData = await productService.getProducts();
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price) {
      toast.error('Name and price are required');
      return;
    }
    
    try {
      const productData = {
        name: newProduct.name || '',
        description: newProduct.description || '',
        price: newProduct.price || 0,
        features: newProduct.features || [],
      };
      
      await productService.createProduct(productData);
      toast.success('Product created successfully');
      
      // Reset form and refresh products
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        features: [],
      });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleProductUpdate = async (id: string, updates: Partial<Product>) => {
    try {
      await productService.updateProduct(id, updates);
      toast.success('Product updated successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleProductDelete = async (id: string) => {
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    
    setNewProduct({
      ...newProduct,
      features: [...(newProduct.features || []), featureInput],
    });
    
    setFeatureInput('');
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...(newProduct.features || [])];
    updatedFeatures.splice(index, 1);
    
    setNewProduct({
      ...newProduct,
      features: updatedFeatures,
    });
  };
  
  // Redirect if not admin
  if (!loading && (!user || !isAdmin)) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        
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
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Price</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              step="0.01"
              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300">Features</label>
            <div className="flex mt-1">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                className="block w-full rounded-l-md bg-gray-700 border-gray-600 text-white"
                placeholder="Add a feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
              >
                Add
              </button>
            </div>
            
            <ul className="mt-2 space-y-1">
              {newProduct.features?.map((feature, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded">
                  <span>{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            Add Product
          </button>
        </form>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
        
        {products.length === 0 ? (
          <p className="text-gray-400">No products found</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product._id} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-gray-400">{product.description}</p>
                <p className="text-indigo-400 mt-2">${product.price.toFixed(2)}</p>
                
                <h4 className="font-medium mt-2">Features:</h4>
                <ul className="list-disc list-inside">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-300">{feature}</li>
                  ))}
                </ul>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleProductDelete(product._id)}
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;