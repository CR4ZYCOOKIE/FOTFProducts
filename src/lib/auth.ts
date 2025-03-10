import { useState, useEffect } from 'react';

// API URL - replace with your deployed API URL in production
const API_URL = 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Local storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Authentication service
export const authService = {
  // Sign up a new user
  signup: async (username: string, password: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to sign up');
    }

    return response.json();
  },

  // Login with username and password
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    const data = await response.json();
    
    // Store auth data in local storage
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    
    return data;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    return JSON.parse(userJson);
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return !!user?.isAdmin;
  },

  // Make authenticated API request
  authenticatedRequest: async <T>(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<T> => {
    const token = authService.getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    
    const config: RequestInit = {
      method,
      headers,
    };
    
    if (body) {
      config.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return response.json();
  },
};

// Auth hook for components
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing user on mount
    setUser(authService.getCurrentUser());
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(username, password);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.signup(username, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };
}; 