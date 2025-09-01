import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Set axios base URL and withCredentials
  useEffect(() => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Set authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const res = await axios.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Auth error:', err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const register = async (userData) => {
    try {
      const res = await axios.post('/auth/register', userData);
      
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      router.push('/shop');
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const login = async (userData) => {
    try {
      const res = await axios.post('/auth/login', userData);
      
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      
      // Set authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      router.push('/shop');
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
