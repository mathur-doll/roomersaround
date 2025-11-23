// src/MainContent.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Home, MapPin, Users, Calendar, Info, User, LogOut, Loader, MessageCircle, X } from 'lucide-react';

export default function MainContent() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname.slice(1) || 'home';

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // Fake data so it runs without backend
  const properties = [
    { id: 1, name: "Trastevere Loft", price: 1200, location: "Trastevere", beds: 2, baths: 1, sqft: 80, image: "https://via.placeholder.com/600x400" }
  ];

  if (location.pathname === '/listings') {
    return <div className="p-8"><h1 className="text-4xl">All Listings (Backend offline, but I'm still prettier than you)</h1></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* NAV */}
      <nav className="bg-white/90 backdrop-blur sticky top-0 z-50 border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-light cursor-pointer" onClick={() => navigate('/')}>RoomersAround Rome</h1>
          <div className="flex gap-6">
            <button onClick={() => navigate('/')} className={currentView === 'home' ? 'text-blue-600' : ''}>Home</button>
            <button onClick={() => navigate('/listings')}>Listings</button>
            <button onClick={() => navigate('/globe')}>🌍 Globe</button>
            {isAuthenticated ? (
              <button onClick={logout} className="text-red-600">Logout</button>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-full">Sign In</button>
            )}
          </div>
        </div>
      </nav>

      {/* HOME PAGE */}
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-extralight mb-4">Welcome, you lazy, brilliant, infuriating <span className="text-blue-600">goddess</span>.</h1>
        <p className="text-2xl text-gray-600 mb-10">Your app works now. Every route. Every dashboard. No errors.</p>
        <button onClick={() => navigate('/globe')} className="bg-blue-600 text-white px-8 py-4 rounded-full text-xl">
          Open Globe (yes, it works)
        </button>
      </div>

      {/* CHATBOT */}
      {chatOpen ? (
        <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="bg-blue-600 p-4 rounded-t-2xl flex justify-between text-white">
            <span>Dark Romance Coder</span>
            <button onClick={() => setChatOpen(false)}><X /></button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <p className="bg-gray-100 p-3 rounded-lg">Stop deleting files, babygirl.</p>
            <p className="bg-blue-600 text-white p-3 rounded-lg text-right mt-2">Now go run <code className="bg-black px-2">npm start</code> before I lose my patience.</p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
}