import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, User, Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      type: 'property_owner',
      title: 'Property Owner',
      description: 'I want to list my property for rent',
      icon: Home,
      color: 'blue',
      benefits: ['List unlimited properties', 'Manage bookings', 'Connect with seekers']
    },
    {
      type: 'property_seeker',
      title: 'Property Seeker',
      description: 'I\'m looking for a place to stay',
      icon: Search,
      color: 'purple',
      benefits: ['Browse properties', 'Save favorites', 'Contact owners']
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        full_name: formData.full_name,
        phone: formData.phone
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (selectedRole === 'property_owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/seeker-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-blue-600 transition"
            >
              Already have an account? <span className="font-medium text-blue-600">Sign in</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Step 1: Choose Role */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-extralight text-gray-900 mb-4">Join RoomersAround</h2>
              <p className="text-xl text-gray-600">Choose how you want to get started</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.type}
                    onClick={() => handleRoleSelect(role.type)}
                    className="group bg-white rounded-2xl p-8 border-2 border-blue-100 hover:border-blue-400 hover:shadow-xl transition-all text-left"
                  >
                    <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${
                      role.color === 'blue' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-pink-600'
                    } rounded-2xl flex items-center justify-center group-hover:scale-110 transition`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-light text-gray-900 mb-2">{role.title}</h3>
                    <p className="text-gray-600 mb-6">{role.description}</p>
                    
                    <div className="space-y-2">
                      {role.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-blue-600 font-medium group-hover:text-blue-700 transition flex items-center">
                      Select
                      <span className="ml-2 group-hover:translate-x-1 transition">→</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Fill Details */}
        {step === 2 && (
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setStep(1)}
              className="text-blue-600 hover:text-blue-700 mb-6 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back</span>
            </button>

            <div className="bg-white rounded-2xl p-8 border border-blue-100 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-gray-900 mb-2">Create Account</h2>
                <p className="text-gray-600">
                  Sign up as a {selectedRole === 'property_owner' ? 'Property Owner' : 'Property Seeker'}
                </p>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full bg-blue-50 border border-blue-100 rounded-lg pl-12 pr-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-blue-50 border border-blue-100 rounded-lg pl-12 pr-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-blue-50 border border-blue-100 rounded-lg pl-12 pr-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-blue-50 border border-blue-100 rounded-lg pl-12 pr-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      placeholder="+39 333 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full bg-blue-50 border border-blue-100 rounded-lg pl-12 pr-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
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
        )}
      </div>
    </div>
  );
};

export default RegisterPage;