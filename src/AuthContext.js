// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import jwtDecode from 'jwt-decode';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Configure axios defaults
//   useEffect(() => {
//     if (user) {
//       loadUser();
//     }
//   }, [user]);

//   const loadUser = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/auth/me');
//       setUser(response.data.user);
//     } catch (error) {
//       console.error('Failed to load user:', error);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('http://localhost:3001/api/auth/login', {
//         email,
//         password
//       });
      
//       const { success, user } = response.data;
//       if (success) {
//         setUser(user);
//         return { success: true, user };
//       } else {
//         throw new Error(response.data.error || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Login error:', error.response?.data || error.message);
//       return { 
//         success: false, 
//         error: error.response?.data?.error || error.message || 'Login failed' 
//       };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const response = await axios.post('http://localhost:3001/api/auth/register', userData);
      
//       const { success, user } = response.data;
//       if (success) {
//         setUser(user);
//         return { success: true, user };
//       } else {
//         throw new Error(response.data.error || 'Registration failed');
//       }
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.response?.data?.error || 'Registration failed' 
//       };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user,
//     isSeeker: user?.role === 'seeker',
//     isOwner: user?.role === 'owner',
//     isSuperAdmin: user?.role === 'superadmin'
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Configure axios defaults
  useEffect(() => {
    if (user) {
      loadUser();
    }
  }, [user]);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('http://localhost:5000/api/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { user, token } = response.data;
      if (user && token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return { success: true, user };
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      // Transform frontend data to match backend expected format
      const backendData = {
        username: userData.email.split('@')[0], // Generate username from email
        email: userData.email,
        password: userData.password,
        role: userData.role === 'seeker' ? 'property_seeker' : 'property_owner',
        full_name: `${userData.firstName} ${userData.lastName}`,
        phone: userData.phone
      };

      const response = await axios.post('http://localhost:5000/api/auth/register', backendData);

      const { user, token } = response.data;
      if (user && token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return { success: true, user };
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isSeeker: user?.role === 'property_seeker',
    isOwner: user?.role === 'property_owner',
    isSuperAdmin: user?.role === 'superuser'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};