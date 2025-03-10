import { authService } from './auth';

// API URL - replace with your deployed API URL in production
const API_URL = 'http://localhost:5000/api';

// Types
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface Subscription {
  _id: string;
  userId: string;
  productId: Product;
  discordUsername: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// Product service
export const productService = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/products`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch products');
    }
    
    return response.json();
  },
  
  // Get product by ID
  getProduct: async (id: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch product');
    }
    
    return response.json();
  },
  
  // Create product (admin only)
  createProduct: async (product: Omit<Product, '_id'>): Promise<Product> => {
    return authService.authenticatedRequest<Product>('/products', 'POST', product);
  },
  
  // Update product (admin only)
  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    return authService.authenticatedRequest<Product>(`/products/${id}`, 'PUT', product);
  },
  
  // Delete product (admin only)
  deleteProduct: async (id: string): Promise<void> => {
    return authService.authenticatedRequest<void>(`/products/${id}`, 'DELETE');
  },
};

// Subscription service
export const subscriptionService = {
  // Get user subscriptions
  getUserSubscriptions: async (): Promise<Subscription[]> => {
    return authService.authenticatedRequest<Subscription[]>('/subscriptions');
  },
  
  // Create subscription
  createSubscription: async (
    productId: string,
    discordUsername: string
  ): Promise<Subscription> => {
    return authService.authenticatedRequest<Subscription>(
      '/subscriptions',
      'POST',
      { productId, discordUsername }
    );
  },
  
  // Cancel subscription
  cancelSubscription: async (id: string): Promise<Subscription> => {
    return authService.authenticatedRequest<Subscription>(
      `/subscriptions/${id}/cancel`,
      'PUT'
    );
  },
  
  // Admin: Get all subscriptions
  getAllSubscriptions: async (): Promise<Subscription[]> => {
    return authService.authenticatedRequest<Subscription[]>('/admin/subscriptions');
  },
}; 