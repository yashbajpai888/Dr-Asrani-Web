import React, { createContext, useState, useEffect } from 'react';

// Create Context
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔗 Backend Base URL
  const BASE_URL = '/api/users';

  // ✅ Load user info from localStorage on first render
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) setUserInfo(JSON.parse(storedUser));
    } catch (err) {
      console.error('Error loading stored user:', err);
    }
  }, []);

  // 🧩 LOGIN FUNCTION
  const login = async (email, password) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(20000)
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Invalid server response format');
      }

      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      return data;
    } catch (err) {
      console.warn('⚠️ API login failed, switching to fallback users', err);

      // Local fallback authentication (for dev/offline)
      const fallbackUsers = [
        { _id: '1', name: 'Admin', email: 'admin@drasrani.in', password: 'admin123', role: 'admin' },
        { _id: '2', name: 'John Doe', email: 'john@drasrani.in', password: 'patient123', role: 'patient' },
        { _id: '3', name: 'Dr. Smith', email: 'doctor@drasrani.in', password: 'doctor123', role: 'doctor' },
        { _id: '4', name: 'Diksha Kore', email: 'korediksha30@gmail.com', password: 'diksha123', role: 'doctor' }
      ];

      const user = fallbackUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        setError('Invalid email or password');
        throw new Error('Invalid email or password');
      }

      const userData = { ...user, token: 'demo-token-123' };
      localStorage.setItem('userInfo', JSON.stringify(userData));
      setUserInfo(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 REGISTER FUNCTION
  const register = async (userData) => {
    setIsLoading(true);
    setError('');

    try {
      const simplifiedData = {
        name: userData.name,
        email: userData.email.trim(),
        password: userData.password,
        role: userData.role || 'patient',
        ...(userData.profilePic && userData.profilePic.length < 500000 && { profilePic: userData.profilePic })
      };

      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(simplifiedData),
        signal: AbortSignal.timeout(20000)
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUserInfo(data);
      return data;
    } catch (err) {
      console.warn('⚠️ API registration failed, switching to fallback', err);

      // Mock fallback registration
      const mockUser = {
        _id: Math.random().toString(36).substring(2, 10),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'patient',
        token: 'fallback-jwt-token'
      };
      localStorage.setItem('userInfo', JSON.stringify(mockUser));
      setUserInfo(mockUser);
      return mockUser;
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 LOAD PROFILE (protected route)
  const loadProfile = async () => {
    if (!userInfo?.token) return null;

    try {
      const response = await fetch(`${BASE_URL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  // 🧩 LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  // 🧩 UPDATE PROFILE FUNCTION
  const updateProfile = async (updates) => {
    if (!userInfo?.token) {
      setError('Not authenticated');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const updatedData = await response.json();
      localStorage.setItem('userInfo', JSON.stringify(updatedData));
      setUserInfo(updatedData);
      return updatedData;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Profile update failed');
    }
  };

  // Provide all auth data/functions globally
  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isLoading,
        error,
        login,
        register,
        logout,
        loadProfile,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
