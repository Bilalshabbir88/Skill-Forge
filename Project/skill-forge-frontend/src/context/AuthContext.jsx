import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('skillforge-token');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          const isExpired = decoded.exp * 1000 < Date.now();
          if (!isExpired) {
            setToken(storedToken);
            const res = await api.get('/auth/me');
            setUser(res.data.data);
          } else {
            localStorage.removeItem('skillforge-token');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('skillforge-token');
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: jwt, user: userData } = res.data.data;
    localStorage.setItem('skillforge-token', jwt);
    setToken(jwt);
    setUser(userData);
    return userData;
  };

  // Called after Google OAuth redirect — token is in URL query param
  const loginWithToken = async (jwtToken) => {
    localStorage.setItem('skillforge-token', jwtToken);
    setToken(jwtToken);
    const res = await api.get('/auth/me');
    setUser(res.data.data);
    return res.data.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (userData.role === 'instructor') {
      return { message: res.data.message };
    }
    const { token: jwt, user: newUser } = res.data.data;
    localStorage.setItem('skillforge-token', jwt);
    setToken(jwt);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('skillforge-token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    const res = await api.put('/users/profile', updatedData);
    setUser(res.data.data);
    return res.data.data;
  };

  const isAuthenticated = () => !!token && !!user;
  const hasRole = (role) => user?.role === role;

  const value = {
    user, token, loading,
    login, loginWithToken, register, logout, updateProfile,
    isAuthenticated, hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
