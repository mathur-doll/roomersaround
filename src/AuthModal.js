import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Briefcase, MapPin } from 'lucide-react';
import { useAuth } from './AuthContext';

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState(defaultMode); // 'login', 'register-seeker', 'register-owner'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    // Seeker specific
    age: '',
    nationality: '',
    profession: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    } else {
      // Registration
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const role = mode === 'register-seeker' ? 'seeker' : 'owner';
      const result = await register({
        email: formData.email,
        password: formData.password,
        role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : undefined,
        nationality: formData.nationality,
        profession: formData.profession,
        bio: formData.bio
      });

      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    }

    setLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-light text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 
               mode === 'register-seeker' ? 'Find Your Home' : 'List Your Property'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-400 focus:bg-white outline-none transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-400 focus:bg-white outline-none transition"
              />
            </div>
          </div>

          {/* Registration Fields */}
          {mode !== 'login' && (
            <>
              <div>
                <label className="block text-gray-700 text-sm mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-400 focus:bg-white outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-400 focus:bg-white outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                    className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-400 focus:bg-white outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+39 333 123 4567"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-400 focus:bg-white outline-none transition"
                  />
                </div>
              </div>

              {/* Seeker specific fields */}
              {mode === 'register-seeker' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-2">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="25"
                        className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-400 focus:bg-white outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-2">Nationality</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        placeholder="Italian"
                        className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-400 focus:bg-white outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Profession</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        placeholder="Software Engineer"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-400 focus:bg-white outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-400 focus:bg-white outline-none transition"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : 
             mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {/* Mode Switcher */}
          <div className="text-center space-y-2">
            {mode === 'login' ? (
              <>
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('register-seeker')}
                    className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Register as Seeker
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    type="button"
                    onClick={() => setMode('register-owner')}
                    className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Register as Owner
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;