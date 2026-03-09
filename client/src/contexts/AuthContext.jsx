import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Login failed. Please try again.'
        };
      }

      if (data.success && data.data) {
        const { user, token } = data.data;

        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setUser(user);

        return { success: true, user };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Unable to connect to server. Please try again.'
      };
    }
  };

  const signup = async (email, password, role = 'student') => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.errors?.[0]?.message || 'Signup failed. Please try again.'
        };
      }

      if (data.success && data.data) {
        const { user, token } = data.data;

        // Store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        setUser(user);

        return { success: true, user };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'Unable to connect to server. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
