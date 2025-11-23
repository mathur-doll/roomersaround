import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Home, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardRoute = () => {
    if (user?.role === 'superuser') return '/admin-dashboard';
    if (user?.role === 'property_owner') return '/owner-dashboard';
    if (user?.role === 'property_seeker') return '/seeker-dashboard';
    return '/';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user?.full_name || user?.username}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {user?.role?.replace('_', ' ')}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="font-medium text-gray-900">{user?.full_name || user?.username}</div>
            <div className="text-sm text-gray-600">{user?.email}</div>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              navigate(getDashboardRoute());
            }}
            className="w-full px-4 py-3 text-left hover:bg-blue-50 transition flex items-center space-x-3 text-gray-700"
          >
            <Home className="w-5 h-5 text-blue-600" />
            <span>My Dashboard</span>
          </button>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full px-4 py-3 text-left hover:bg-red-50 transition flex items-center space-x-3 text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;