import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Home, AlertCircle } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      const role = response.data.user.role;
      if (role === 'superuser') {
        navigate('/admin-dashboard');
      } else if (role === 'property_owner') {
        navigate('/owner-dashboard');
      } else if (role === 'property_seeker') {
        navigate('/seeker-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-gray-900">RoomersAround</h1>
                <p className="text-xs text-gray-500">Rome Edition</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Don't have an account? <span className="font-medium text-blue-600">Sign up</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-extralight text-gray-900 mb-4">Welcome Back</h2>
            <p className="text-xl text-gray-600">Sign in to your account</p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-blue-100 shadow-xl">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-blue-50 border border-blue-100 rounded-lg pl-12 pr-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full bg-blue-50 border border-blue-100 rounded-lg pl-12 pr-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign up
              </button>
            </div>
          </div>

          {/* Test Accounts */}
          <div className="mt-8 bg-white rounded-xl p-6 border border-blue-100">
            <p className="text-xs text-gray-500 mb-3 text-center font-medium">Test Accounts</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="font-medium text-gray-900 mb-1">Admin</div>
                <div>Email: admin@roomersaround.com</div>
                <div>Password: admin123</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="font-medium text-gray-900 mb-1">Property Owner</div>
                <div>Email: maria.rossi@example.com</div>
                <div>Password: password</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="font-medium text-gray-900 mb-1">Property Seeker</div>
                <div>Email: john.doe@example.com</div>
                <div>Password: password</div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;