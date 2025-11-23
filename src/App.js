// import React, { useState, useEffect, useRef } from 'react';
// import { Home, Users, Calendar, User, MessageCircle, X, MapPin, Clock, Bed, Bath, Square, ChevronRight, Star, Info, Mail, Phone, Instagram, Heart, Loader } from 'lucide-react';
// import GalaxyPage from './GalaxyPage';
// import { propertiesAPI, membersAPI, statsAPI } from './api';

// // Chatbot Component (keeping original)
// const Chatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     { text: "Hi! I'm your RoomersAround assistant. How can I help you find your perfect home in Rome? 🏛️", sender: 'bot' }
//   ]);
//   const [input, setInput] = useState('');

//   const handleSend = () => {
//     if (!input.trim()) return;
    
//     setMessages([...messages, { text: input, sender: 'user' }]);
//     setInput('');
    
//     setTimeout(() => {
//       const responses = [
//         "That's a great question! Let me help you with that.",
//         "I'd recommend checking out our properties in Trastevere for that authentic Roman experience!",
//         "Would you like me to show you apartments in a specific neighborhood?",
//         "Our community members are always happy to share insights about their neighborhoods!"
//       ];
//       const randomResponse = responses[Math.floor(Math.random() * responses.length)];
//       setMessages(prev => [...prev, { text: randomResponse, sender: 'bot' }]);
//     }, 1000);
//   };

//   if (!isOpen) {
//     return (
//       <button 
//         onClick={() => setIsOpen(true)}
//         className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all z-40"
//       >
//         <MessageCircle className="w-6 h-6" />
//       </button>
//     );
//   }

//   return (
//     <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-40 border border-blue-100">
//       <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-t-2xl flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <MessageCircle className="w-5 h-5 text-white" />
//           <h3 className="text-white font-medium">Chat Assistant</h3>
//         </div>
//         <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1 rounded">
//           <X className="w-5 h-5" />
//         </button>
//       </div>
      
//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {messages.map((msg, index) => (
//           <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//             <div className={`max-w-[80%] p-3 rounded-xl ${
//               msg.sender === 'user' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-100 text-gray-800'
//             }`}>
//               {msg.text}
//             </div>
//           </div>
//         ))}
//       </div>
      
//       <div className="p-4 border-t border-gray-100">
//         <div className="flex space-x-2">
//           <input 
//             type="text" 
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//             placeholder="Type your message..." 
//             className="flex-1 bg-gray-50 rounded-lg px-4 py-2 outline-none border border-gray-200 focus:border-blue-400"
//           />
//           <button 
//             onClick={handleSend}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Property Details Modal Component
// const PropertyDetailsModal = ({ property, onClose, resident }) => {
//   if (!property) return null;

//   return (
//     <div 
//       className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
//       onClick={onClose}
//     >
//       <div 
//         className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="relative">
//           <img src={property.image} alt={property.name} className="w-full h-96 object-cover rounded-t-2xl" />
//           <button 
//             onClick={onClose}
//             className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-8">
//           <div className="flex items-start justify-between mb-6">
//             <div>
//               <h2 className="text-4xl font-extralight text-gray-900 mb-2">{property.name}</h2>
//               <div className="flex items-center text-gray-600 mb-2">
//                 <MapPin className="w-5 h-5 mr-2 text-blue-500" />
//                 {property.location}
//               </div>
//               <div className="flex items-center text-gray-600">
//                 <Clock className="w-5 h-5 mr-2 text-blue-500" />
//                 {property.duration}
//               </div>
//             </div>
//             <div className="text-right">
//               <div className="text-4xl font-light text-blue-600 mb-2">€{property.price}</div>
//               <div className="text-gray-600">per month</div>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-xl">
//             <div className="flex items-center space-x-2">
//               <Bed className="w-5 h-5 text-blue-600" />
//               <span className="text-gray-900">{property.beds} Beds</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Bath className="w-5 h-5 text-blue-600" />
//               <span className="text-gray-900">{property.baths} Baths</span>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Square className="w-5 h-5 text-blue-600" />
//               <span className="text-gray-900">{property.sqft} sqft</span>
//             </div>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-2xl font-light text-gray-900 mb-3">Description</h3>
//             <p className="text-gray-700 leading-relaxed">{property.description}</p>
//           </div>

//           <div className="mb-6">
//             <h3 className="text-2xl font-light text-gray-900 mb-3">Amenities</h3>
//             <div className="flex flex-wrap gap-2">
//               {property.amenities.map((amenity, index) => (
//                 <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
//                   {amenity}
//                 </span>
//               ))}
//             </div>
//           </div>

//           {resident && (
//             <div className="mb-6 p-6 bg-gray-50 rounded-xl">
//               <h3 className="text-2xl font-light text-gray-900 mb-4">Current Resident</h3>
//               <div className="flex items-center space-x-4">
//                 <img src={resident.avatar} alt={resident.name} className="w-16 h-16 rounded-full object-cover" />
//                 <div>
//                   <h4 className="text-lg font-medium text-gray-900">{resident.name}</h4>
//                   <p className="text-gray-600">{resident.profession}</p>
//                   <p className="text-gray-500 text-sm italic">"{resident.bio}"</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="flex space-x-4">
//             <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition font-light text-lg">
//               Request Tour
//             </button>
//             <button className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl hover:bg-gray-200 transition font-light text-lg">
//               Save Property
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main App Component
// function App() {
//   const [currentView, setCurrentView] = useState('home');
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [isGalaxyMode, setIsGalaxyMode] = useState(false);
  
//   // Backend data states
//   const [properties, setProperties] = useState([]);
//   const [members, setMembers] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch data from backend on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch all data in parallel
//         const [propertiesData, membersData, statsData] = await Promise.all([
//           propertiesAPI.getAll(),
//           membersAPI.getAll(),
//           statsAPI.getStats()
//         ]);

//         setProperties(propertiesData.properties || []);
//         setMembers(membersData.members || []);
//         setStats(statsData);
        
//         console.log('✅ Data loaded from backend:', {
//           properties: propertiesData.properties?.length || 0,
//           members: membersData.members?.length || 0
//         });
//       } catch (err) {
//         console.error('❌ Error fetching data:', err);
//         setError('Failed to load data from backend. Make sure the server is running on http://localhost:3001');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Get resident for a property
//   const getResident = (residentId) => {
//     return members.find(m => m.id === residentId);
//   };

//   // Events data (keeping static for now, can be moved to backend later)
//   const eventsData = [
//     {
//       id: 1,
//       title: "Aperitivo Evening at Trastevere",
//       date: "Saturday, Nov 2 at 7:00 PM",
//       location: "Piazza Trilussa, Trastevere",
//       description: "Join us for a traditional Roman aperitivo! Meet fellow residents, enjoy spritz and cicchetti while watching the sunset over the Tiber.",
//       type: "Social",
//       attendees: [1, 3, 5, 9]
//     },
//     {
//       id: 2,
//       title: "Villa Borghese Morning Run",
//       date: "Sunday, Nov 3 at 8:00 AM",
//       location: "Villa Borghese Gardens",
//       description: "Weekly community run through Rome's most beautiful park. All fitness levels welcome! Coffee afterwards.",
//       type: "Fitness",
//       attendees: [2, 6, 8]
//     },
//     {
//       id: 3,
//       title: "Cooking Class: Perfect Carbonara",
//       date: "Wednesday, Nov 6 at 6:30 PM",
//       location: "Emma's Kitchen, Prati",
//       description: "Learn to make authentic Roman carbonara from our resident chef Emma. Includes dinner and wine!",
//       type: "Food & Drink",
//       attendees: [3, 4, 7, 10, 11]
//     }
//   ];

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading RoomersAround...</p>
//           <p className="text-gray-400 text-sm mt-2">Fetching data from backend</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-6">
//         <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-red-200">
//           <div className="text-center mb-6">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <X className="w-8 h-8 text-red-500" />
//             </div>
//             <h2 className="text-2xl font-light text-gray-900 mb-2">Connection Error</h2>
//             <p className="text-gray-600">{error}</p>
//           </div>
//           <div className="bg-gray-50 rounded-lg p-4 mb-4">
//             <p className="text-sm text-gray-700 mb-2">To fix this:</p>
//             <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
//               <li>Open the backend folder in terminal</li>
//               <li>Run <code className="bg-gray-200 px-2 py-1 rounded">npm install</code></li>
//               <li>Run <code className="bg-gray-200 px-2 py-1 rounded">npm start</code></li>
//               <li>Refresh this page</li>
//             </ol>
//           </div>
//           <button 
//             onClick={() => window.location.reload()}
//             className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
//           >
//             Retry Connection
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Galaxy Mode - Full Screen Component
//   if (isGalaxyMode) {
//     return <GalaxyPage members={members} properties={properties} onClose={() => setIsGalaxyMode(false)} />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
//       {/* Navigation */}
//       <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-30">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
//                 <Home className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-light text-gray-900">RoomersAround</h1>
//                 <p className="text-xs text-gray-500">Rome Edition</p>
//               </div>
//             </div>
            
//             <div className="hidden md:flex items-center space-x-8">
//               <button 
//                 onClick={() => setCurrentView('home')}
//                 className={`flex items-center space-x-2 transition ${currentView === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
//               >
//                 <Home className="w-5 h-5" />
//                 <span>Home</span>
//               </button>
//               <button 
//                 onClick={() => setCurrentView('listings')}
//                 className={`flex items-center space-x-2 transition ${currentView === 'listings' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
//               >
//                 <MapPin className="w-5 h-5" />
//                 <span>Listings</span>
//               </button>
//               <button 
//                 onClick={() => setIsGalaxyMode(true)}
//                 className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition"
//               >
//                 <Users className="w-5 h-5" />
//                 <span>Galaxy</span>
//               </button>
//               <button 
//                 onClick={() => setCurrentView('events')}
//                 className={`flex items-center space-x-2 transition ${currentView === 'events' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
//               >
//                 <Calendar className="w-5 h-5" />
//                 <span>Events</span>
//               </button>
//               <button 
//                 onClick={() => setCurrentView('about')}
//                 className={`flex items-center space-x-2 transition ${currentView === 'about' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
//               >
//                 <Info className="w-5 h-5" />
//                 <span>About</span>
//               </button>
//               <button 
//                 onClick={() => setCurrentView('profile')}
//                 className={`flex items-center space-x-2 transition ${currentView === 'profile' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
//               >
//                 <User className="w-5 h-5" />
//                 <span>Profile</span>
//               </button>
//             </div>

//             <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition">
//               Sign In
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="container mx-auto px-6 py-12">
//         {currentView === 'home' && (
//           <div>
//             {/* Hero Section */}
//             <div className="text-center mb-16">
//               <h2 className="text-6xl font-extralight text-gray-900 mb-4">
//                 Find Your Home in <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Rome</span>
//               </h2>
//               <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//                 Discover mid to long-term housing while connecting with an amazing community in the eternal city
//               </p>
              
//               {stats && (
//                 <div className="flex justify-center space-x-8 mb-8">
//                   <div className="text-center">
//                     <div className="text-4xl font-light text-blue-600">{stats.totalProperties}</div>
//                     <div className="text-gray-600">Properties</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-4xl font-light text-blue-600">{stats.totalMembers}</div>
//                     <div className="text-gray-600">Members</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-4xl font-light text-blue-600">€{stats.averagePrice}</div>
//                     <div className="text-gray-600">Avg. Price</div>
//                   </div>
//                 </div>
//               )}

//               <div className="flex justify-center space-x-4">
//                 <button 
//                   onClick={() => setCurrentView('listings')}
//                   className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition text-lg"
//                 >
//                   Browse Properties
//                 </button>
//                 <button 
//                   onClick={() => setIsGalaxyMode(true)}
//                   className="bg-white text-gray-900 px-8 py-4 rounded-full border-2 border-blue-200 hover:border-blue-400 transition text-lg"
//                 >
//                   Explore Galaxy
//                 </button>
//               </div>
//             </div>

//             {/* Featured Properties */}
//             <div className="mb-16">
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h3 className="text-4xl font-extralight text-gray-900 mb-2">Featured Properties</h3>
//                   <p className="text-gray-600">Handpicked homes in Rome's best neighborhoods</p>
//                 </div>
//                 <button 
//                   onClick={() => setCurrentView('listings')}
//                   className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
//                 >
//                   <span>View All</span>
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {properties.filter(p => p.available).slice(0, 6).map(property => {
//                   const resident = getResident(property.resident);
//                   return (
//                     <div 
//                       key={property.id}
//                       onClick={() => setSelectedProperty(property)}
//                       className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-50 hover:border-blue-200"
//                     >
//                       <div className="relative">
//                         <img src={property.image} alt={property.name} className="w-full h-64 object-cover" />
//                         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
//                           €{property.price}/mo
//                         </div>
//                         {property.rating && (
//                           <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 flex items-center">
//                             <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
//                             {property.rating}
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-6">
//                         <h3 className="text-2xl font-light text-gray-900 mb-2">{property.name}</h3>
//                         <div className="flex items-center text-gray-600 mb-4">
//                           <MapPin className="w-4 h-4 mr-2 text-blue-500" />
//                           {property.location}
//                         </div>

//                         <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
//                           <div className="flex items-center">
//                             <Bed className="w-4 h-4 mr-1" />
//                             {property.beds}
//                           </div>
//                           <div className="flex items-center">
//                             <Bath className="w-4 h-4 mr-1" />
//                             {property.baths}
//                           </div>
//                           <div className="flex items-center">
//                             <Square className="w-4 h-4 mr-1" />
//                             {property.sqft} sqft
//                           </div>
//                         </div>

//                         {resident && (
//                           <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
//                             <img src={resident.avatar} alt={resident.name} className="w-10 h-10 rounded-full object-cover" />
//                             <div className="flex-1">
//                               <p className="text-sm font-medium text-gray-900">{resident.name}</p>
//                               <p className="text-xs text-gray-500">{resident.profession}</p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}

//         {currentView === 'listings' && (
//           <div>
//             <h2 className="text-4xl font-extralight text-gray-900 mb-4">All Properties in Rome</h2>
//             <p className="text-gray-600 mb-12">Browse {properties.length} available homes</p>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {properties.map(property => {
//                 const resident = getResident(property.resident);
//                 return (
//                   <div 
//                     key={property.id}
//                     onClick={() => setSelectedProperty(property)}
//                     className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-50"
//                   >
//                     <div className="relative">
//                       <img src={property.image} alt={property.name} className="w-full h-64 object-cover" />
//                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
//                         €{property.price}/mo
//                       </div>
//                       {!property.available && (
//                         <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                           Not Available
//                         </div>
//                       )}
//                     </div>

//                     <div className="p-6">
//                       <h3 className="text-2xl font-light text-gray-900 mb-2">{property.name}</h3>
//                       <div className="flex items-center text-gray-600 mb-4">
//                         <MapPin className="w-4 h-4 mr-2 text-blue-500" />
//                         {property.location}
//                       </div>

//                       <div className="flex items-center space-x-4 text-sm text-gray-600">
//                         <div className="flex items-center">
//                           <Bed className="w-4 h-4 mr-1" />
//                           {property.beds}
//                         </div>
//                         <div className="flex items-center">
//                           <Bath className="w-4 h-4 mr-1" />
//                           {property.baths}
//                         </div>
//                         <div className="flex items-center">
//                           <Square className="w-4 h-4 mr-1" />
//                           {property.sqft}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {currentView === 'events' && (
//           <div>
//             <h2 className="text-4xl font-extralight text-gray-900 mb-4">Community Events in Rome</h2>
//             <p className="text-gray-600 mb-12">Join activities and meet new friends</p>
//             <div className="space-y-6">
//               {eventsData.map(event => (
//                 <div key={event.id} className="bg-white rounded-xl p-6 border border-blue-100 hover:border-blue-300 transition">
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-3 mb-2">
//                         <Calendar className="w-5 h-5 text-blue-500" />
//                         <h3 className="text-2xl font-light text-gray-900">{event.title}</h3>
//                       </div>
//                       <p className="text-gray-600 mb-3">{event.date}</p>
//                       <div className="flex items-center text-gray-600 mb-3">
//                         <MapPin className="w-4 h-4 mr-2 text-blue-400" />
//                         {event.location}
//                       </div>
//                       <p className="text-gray-700 mb-4">{event.description}</p>
//                       <div className="flex items-center space-x-2">
//                         {event.attendees.map(attendeeId => {
//                           const attendee = members.find(r => r.id === attendeeId);
//                           return attendee ? (
//                             <img 
//                               key={attendeeId} 
//                               src={attendee.avatar} 
//                               alt={attendee.name}
//                               className="w-10 h-10 rounded-full border-2 border-white object-cover"
//                               title={attendee.name}
//                             />
//                           ) : null;
//                         })}
//                         <span className="text-gray-600 text-sm ml-2">+{event.attendees.length} attending</span>
//                       </div>
//                     </div>
//                     <div className="text-right ml-4">
//                       <span className="px-4 py-2 rounded-full text-sm font-light text-blue-700 bg-blue-50 inline-block mb-3">
//                         {event.type}
//                       </span>
//                       <button className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition text-sm">
//                         Join Event
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {currentView === 'about' && (
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-4xl font-extralight text-gray-900 mb-8 text-center">About RoomersAround</h2>
//             <div className="bg-white rounded-xl p-8 border border-blue-100 mb-8">
//               <p className="text-gray-700 leading-relaxed mb-6 text-lg">
//                 Welcome to <span className="font-medium text-blue-600">RoomersAround</span>, Rome's premier platform for finding mid-term and long-term housing while building meaningful connections in the eternal city.
//               </p>
//               <p className="text-gray-700 leading-relaxed mb-6">
//                 We believe that finding a place to live is about more than just four walls and a roof. It's about discovering a community, making friends, and creating memories that last a lifetime. That's why we've created a unique platform that combines beautiful housing with social connection.
//               </p>
//               <h3 className="text-2xl font-light text-gray-900 mb-4">Our Mission</h3>
//               <p className="text-gray-700 leading-relaxed mb-6">
//                 To help travelers, digital nomads, students, and professionals find their perfect home in Rome while connecting them with like-minded individuals who share their passions and interests.
//               </p>
//               <h3 className="text-2xl font-light text-gray-900 mb-4">Why Choose RoomersAround?</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-blue-50 rounded-lg p-6">
//                   <h4 className="font-medium text-gray-900 mb-2">🏛️ Rome-Focused</h4>
//                   <p className="text-gray-700 text-sm">Every property is carefully selected in Rome's best neighborhoods</p>
//                 </div>
//                 <div className="bg-blue-50 rounded-lg p-6">
//                   <h4 className="font-medium text-gray-900 mb-2">🌟 Community First</h4>
//                   <p className="text-gray-700 text-sm">Meet residents before moving in through our Galaxy feature</p>
//                 </div>
//                 <div className="bg-blue-50 rounded-lg p-6">
//                   <h4 className="font-medium text-gray-900 mb-2">🎉 Social Events</h4>
//                   <p className="text-gray-700 text-sm">Regular community events to help you feel at home</p>
//                 </div>
//                 <div className="bg-blue-50 rounded-lg p-6">
//                   <h4 className="font-medium text-gray-900 mb-2">✨ Verified Listings</h4>
//                   <p className="text-gray-700 text-sm">All properties are verified and visited by our team</p>
//                 </div>
//               </div>
//             </div>
//             <div className="text-center">
//               <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition">
//                 Join Our Community
//               </button>
//             </div>
//           </div>
//         )}

//         {currentView === 'profile' && (
//           <div className="max-w-2xl mx-auto">
//             <h2 className="text-4xl font-extralight text-gray-900 mb-8 text-center">Your Profile</h2>
//             <div className="bg-white rounded-xl p-8 border border-blue-100">
//               <div className="text-center mb-8">
//                 <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mx-auto mb-4 flex items-center justify-center">
//                   <User className="w-16 h-16 text-blue-600" />
//                 </div>
//                 <button className="text-blue-600 text-sm hover:text-blue-700">Upload Photo</button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">Full Name</label>
//                   <input type="text" placeholder="Your name" className="w-full bg-blue-50 text-gray-900 rounded-lg px-4 py-3 outline-none border border-blue-100 focus:border-blue-400" />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">Profession</label>
//                   <input type="text" placeholder="What do you do?" className="w-full bg-blue-50 text-gray-900 rounded-lg px-4 py-3 outline-none border border-blue-100 focus:border-blue-400" />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">Age</label>
//                   <input type="number" placeholder="Your age" className="w-full bg-blue-50 text-gray-900 rounded-lg px-4 py-3 outline-none border border-blue-100 focus:border-blue-400" />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">Bio</label>
//                   <textarea placeholder="Tell us about yourself..." className="w-full bg-blue-50 text-gray-900 rounded-lg px-4 py-3 outline-none border border-blue-100 focus:border-blue-400 h-32"></textarea>
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 text-sm mb-2">Interests (separate with commas)</label>
//                   <input type="text" placeholder="Art, Travel, Food, Music..." className="w-full bg-blue-50 text-gray-900 rounded-lg px-4 py-3 outline-none border border-blue-100 focus:border-blue-400" />
//                 </div>
//                 <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full font-light hover:shadow-lg hover:shadow-blue-500/30 transition">
//                   Save Profile
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {selectedProperty && (
//         <PropertyDetailsModal 
//           property={selectedProperty} 
//           resident={getResident(selectedProperty.resident)}
//           onClose={() => setSelectedProperty(null)} 
//         />
//       )}

//       {!isGalaxyMode && <Chatbot />}
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, User, MessageCircle, X, MapPin, Clock, Bed, Bath, Square, ChevronRight, Star, Info, Mail, Phone, Instagram, Heart, Loader, LogOut } from 'lucide-react';
import EnhancedBlueprintGlobe from './EnhancedBlueprintGlobe';
import { propertiesAPI, membersAPI, statsAPI } from './api';
import { AuthProvider, useAuth } from './AuthContext';
import AuthModal from './AuthModal';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import OwnerDashboard from './pages/OwnerDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import EventsPage from './pages/EventsPage';
import UserDropdown from './components/UserDropdown';

// Chatbot Component
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your RoomersAround assistant. How can I help you find your perfect home in Rome? 🏛️", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "I'd recommend checking out our properties in Trastevere for that authentic Roman experience!",
        "Would you like me to show you apartments in a specific neighborhood?",
        "Our community members are always happy to share insights about their neighborhoods!"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { text: randomResponse, sender: 'bot' }]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-40 border border-blue-100">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-white" />
          <h3 className="text-white font-medium">Chat Assistant</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${
              msg.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex space-x-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..." 
            className="flex-1 bg-gray-50 rounded-lg px-4 py-2 outline-none border border-gray-200 focus:border-blue-400"
          />
          <button 
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Property Details Modal
const PropertyDetailsModal = ({ property, onClose, resident }) => {
  if (!property) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img src={property.image} alt={property.name} className="w-full h-96 object-cover rounded-t-2xl" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-4xl font-extralight text-gray-900 mb-2">{property.name}</h2>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                {property.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                {property.duration}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-light text-blue-600 mb-2">€{property.price}</div>
              <div className="text-gray-600">per month</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center space-x-2">
              <Bed className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900">{property.beds} Beds</span>
            </div>
            <div className="flex items-center space-x-2">
              <Bath className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900">{property.baths} Baths</span>
            </div>
            <div className="flex items-center space-x-2">
              <Square className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900">{property.sqft} sqft</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-light text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-light text-gray-900 mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {property.amenities && property.amenities.map((amenity, index) => (
                <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {resident && (
            <div className="mb-6 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Current Resident</h3>
              <div className="flex items-center space-x-4">
                <img src={resident.avatar} alt={resident.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{resident.name}</h4>
                  <p className="text-gray-600">{resident.profession}</p>
                  <p className="text-gray-500 text-sm italic">"{resident.bio}"</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition font-light text-lg">
              Request Tour
            </button>
            <button className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-xl hover:bg-gray-200 transition font-light text-lg">
              Save Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Globe Route Component
function GlobeRoute() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, propertiesData] = await Promise.all([
          membersAPI.getAll(),
          propertiesAPI.getAll()
        ]);
        setMembers(membersData.members || []);
        setProperties(propertiesData.properties || []);
      } catch (err) {
        console.error('Error loading globe data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <EnhancedBlueprintGlobe 
      onClose={() => navigate('/')}
      properties={properties}
      members={members}
    />
  );
}

// Main Content Component
function MainContent() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [properties, setProperties] = useState([]);
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Determine current view from URL
  const currentView = location.pathname.slice(1) || 'home';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [propertiesData, membersData, statsData] = await Promise.all([
          propertiesAPI.getAll(),
          membersAPI.getAll(),
          statsAPI.getStats()
        ]);

        setProperties(propertiesData.properties || []);
        setMembers(membersData.members || []);
        setStats(statsData);
        
        console.log('✅ Data loaded:', {
          properties: propertiesData.properties?.length || 0,
          members: membersData.members?.length || 0
        });
      } catch (err) {
        console.error('❌ Error fetching data:', err);
        setError('Failed to load data from backend. Make sure the server is running on http://localhost:3001');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getResident = (residentId) => {
    return members.find(m => m.id === residentId);
  };

  const eventsData = [
    {
      id: 1,
      title: "Aperitivo Evening at Trastevere",
      date: "Saturday, Nov 2 at 7:00 PM",
      location: "Piazza Trilussa, Trastevere",
      description: "Join us for a traditional Roman aperitivo! Meet fellow residents, enjoy spritz and cicchetti while watching the sunset over the Tiber.",
      type: "Social",
      attendees: [1, 3, 5, 9]
    },
    {
      id: 2,
      title: "Villa Borghese Morning Run",
      date: "Sunday, Nov 3 at 8:00 AM",
      location: "Villa Borghese Gardens",
      description: "Weekly community run through Rome's most beautiful park. All fitness levels welcome! Coffee afterwards.",
      type: "Fitness",
      attendees: [2, 6, 8]
    },
    {
      id: 3,
      title: "Cooking Class: Perfect Carbonara",
      date: "Wednesday, Nov 6 at 6:30 PM",
      location: "Emma's Kitchen, Prati",
      description: "Learn to make authentic Roman carbonara from our resident chef Emma. Includes dinner and wine!",
      type: "Food & Drink",
      attendees: [3, 4, 7, 10, 11]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading RoomersAround...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-red-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-light text-gray-900">RoomersAround</h1>
                <p className="text-xs text-gray-500">Rome Edition</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/')}
                className={`flex items-center space-x-2 transition ${currentView === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button 
                onClick={() => navigate('/listings')}
                className={`flex items-center space-x-2 transition ${currentView === 'listings' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                <MapPin className="w-5 h-5" />
                <span>Listings</span>
              </button>
              <button 
                onClick={() => navigate('/globe')}
                className={`flex items-center space-x-2 transition ${currentView === 'globe' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                <Users className="w-5 h-5" />
                <span>🌍 Globe</span>
              </button>
              <button 
                onClick={() => navigate('/events')}
                className={`flex items-center space-x-2 transition ${currentView === 'events' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                <Calendar className="w-5 h-5" />
                <span>Events</span>
              </button>
              <button 
                onClick={() => navigate('/about')}
                className={`flex items-center space-x-2 transition ${currentView === 'about' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                <Info className="w-5 h-5" />
                <span>About</span>
              </button>
            </div>
<div className="flex items-center space-x-3">
  {isAuthenticated ? (
    <UserDropdown user={user} onLogout={logout} />
  ) : (
    <button 
      onClick={() => navigate('/login')}
      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition"
    >
      Sign In
    </button>
  )}
</div>
          </div>
        </div>
      </nav>

      {/* Main Content - Render based on route */}
      <div className="container mx-auto px-6 py-12">
        <Routes>
          <Route path="/" element={
            <div>
              {/* Hero Section */}
              <div className="text-center mb-16">
                <h2 className="text-6xl font-extralight text-gray-900 mb-4">
                  Find Your Home in <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Rome</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Discover mid to long-term housing while connecting with an amazing community in the eternal city
                </p>
                
                {stats && (
                  <div className="flex justify-center space-x-8 mb-8">
                    <div className="text-center">
                      <div className="text-4xl font-light text-blue-600">{stats.totalProperties}</div>
                      <div className="text-gray-600">Properties</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-light text-blue-600">{stats.totalMembers}</div>
                      <div className="text-gray-600">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-light text-blue-600">€{stats.averagePrice}</div>
                      <div className="text-gray-600">Avg. Price</div>
                    </div>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={() => navigate('/listings')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition text-lg"
                  >
                    Browse Properties
                  </button>
                  <button 
                    onClick={() => navigate('/globe')}
                    className="bg-white text-gray-900 px-8 py-4 rounded-full border-2 border-blue-200 hover:border-blue-400 transition text-lg"
                  >
                    🌍 Explore Globe
                  </button>
                </div>

                {!isAuthenticated && (
                  <div className="mt-8 p-6 bg-blue-50 rounded-xl max-w-2xl mx-auto">
                    <p className="text-gray-700 mb-4 font-medium">Join RoomersAround to unlock all features!</p>
                    <div className="flex justify-center space-x-4">
<button
  onClick={() => navigate('/register')}
  className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition border border-blue-200 font-medium"
>
  🏠 Find a Home
</button>
<button
  onClick={() => navigate('/register')}
  className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition border border-blue-200 font-medium"
>
  🏘️ List Property
</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Featured Properties */}
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-4xl font-extralight text-gray-900 mb-2">Featured Properties</h3>
                    <p className="text-gray-600">Handpicked homes in Rome's best neighborhoods</p>
                  </div>
                  <button 
                    onClick={() => navigate('/listings')}
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.filter(p => p.available).slice(0, 6).map(property => {
                    const resident = getResident(property.resident);
                    return (
                      <div 
                        key={property.id}
                        onClick={() => setSelectedProperty(property)}
                        className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-50 hover:border-blue-200"
                      >
                        <div className="relative">
                          <img src={property.image} alt={property.name} className="w-full h-64 object-cover" />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                            €{property.price}/mo
                          </div>
                          {property.rating && (
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              {property.rating}
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          <h3 className="text-2xl font-light text-gray-900 mb-2">{property.name}</h3>
                          <div className="flex items-center text-gray-600 mb-4">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                            {property.location}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              {property.beds}
                            </div>
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              {property.baths}
                            </div>
                            <div className="flex items-center">
                              <Square className="w-4 h-4 mr-1" />
                              {property.sqft} sqft
                            </div>
                          </div>

                          {resident && (
                            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                              <img src={resident.avatar} alt={resident.name} className="w-10 h-10 rounded-full object-cover" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{resident.name}</p>
                                <p className="text-xs text-gray-500">{resident.profession}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          } />

          <Route path="/listings" element={
            <div>
              <h2 className="text-4xl font-extralight text-gray-900 mb-4">All Properties in Rome</h2>
              <p className="text-gray-600 mb-12">Browse {properties.length} available homes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map(property => {
                  const resident = getResident(property.resident);
                  return (
                    <div 
                      key={property.id}
                      onClick={() => setSelectedProperty(property)}
                      className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-50"
                    >
                      <div className="relative">
                        <img src={property.image} alt={property.name} className="w-full h-64 object-cover" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                          €{property.price}/mo
                        </div>
                        {!property.available && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Not Available
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-2xl font-light text-gray-900 mb-2">{property.name}</h3>
                        <div className="flex items-center text-gray-600 mb-4">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                          {property.location}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            {property.beds}
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            {property.baths}
                          </div>
                          <div className="flex items-center">
                            <Square className="w-4 h-4 mr-1" />
                            {property.sqft}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          } />

<Route path="/events" element={
  <EventsPage 
    isAuthenticated={isAuthenticated}
    user={user}
    members={members}
  />
} />

          <Route path="/about" element={
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-extralight text-gray-900 mb-8 text-center">About RoomersAround</h2>
              <div className="bg-white rounded-xl p-8 border border-blue-100 mb-8">
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  Welcome to <span className="font-medium text-blue-600">RoomersAround</span>, Rome's premier platform for finding mid-term and long-term housing while building meaningful connections in the eternal city.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We believe that finding a place to live is about more than just four walls and a roof. It's about discovering a community, making friends, and creating memories that last a lifetime. That's why we've created a unique platform that combines beautiful housing with social connection.
                </p>
                <h3 className="text-2xl font-light text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  To help travelers, digital nomads, students, and professionals find their perfect home in Rome while connecting them with like-minded individuals who share their passions and interests.
                </p>
                <h3 className="text-2xl font-light text-gray-900 mb-4">Why Choose RoomersAround?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">🏛️ Rome-Focused</h4>
                    <p className="text-gray-700 text-sm">Every property is carefully selected in Rome's best neighborhoods</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">🌟 Community First</h4>
                    <p className="text-gray-700 text-sm">Meet residents before moving in through our Globe feature</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">🎉 Social Events</h4>
                    <p className="text-gray-700 text-sm">Regular community events to help you feel at home</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-2">✨ Verified Listings</h4>
                    <p className="text-gray-700 text-sm">All properties are verified and visited by our team</p>
                  </div>
                </div>
              </div>
              <div className="text-center">
<button 
  onClick={() => !isAuthenticated && navigate('/register')}
  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full hover:shadow-lg hover:shadow-blue-500/30 transition"
>
  {isAuthenticated ? 'Welcome!' : 'Join Our Community'}
</button>
              </div>
            </div>
          } />

          <Route path="/profile" element={
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-extralight text-gray-900 mb-8 text-center">Your Profile</h2>
              <div className="bg-white rounded-xl p-8 border border-blue-100">
                <div className="text-center mb-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mx-auto mb-4 flex items-center justify-center">
                    <User className="w-16 h-16 text-blue-600" />
                  </div>
                  <button className="text-blue-600 text-sm hover:text-blue-700">Upload Photo</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Full Name</label>
                    <input type="text" placeholder="Your name" className="w-full bg-blue-50 text-gray-900 rounded-lg px-4 py-3 outline-none border border-blue-100 focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Profession</label>
                    <input type="text" placeholder="What do you do?" className="w-full bg-blue-50 text-gray-900 rounded-lg px-4 py-3 outline-none border border-blue-100 focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Age</label>
                    <input type="number" placeholder="Your age" className="w-full bg-blue-50 text-gray-900 rounded-lg px-4 py-3 outline-none border border-blue-100 focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Bio</label>
                    <textarea placeholder="Tell us about yourself..." className="w-full bg-blue-50 text-gray-900 rounded-lg px-4 py-3 outline-none border border-blue-100 focus:border-blue-400 h-32"></textarea>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Interests (separate with commas)</label>
                    <input type="text" placeholder="Art, Travel, Food, Music..." className="w-full bg-blue-50 text-gray-900 rounded-lg px-4 py-3 outline-none border border-blue-100 focus:border-blue-400" />
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-full font-light hover:shadow-lg hover:shadow-blue-500/30 transition">
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>

      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          resident={getResident(selectedProperty.resident)}
          onClose={() => setSelectedProperty(null)} 
        />
      )}

      <Chatbot />
    </div>
  );
}

// App with Router - FIXED VERSION
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Globe Route */}
          <Route path="/globe" element={<GlobeRoute />} />
          
          {/* Authentication Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Dashboard Routes */}
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/seeker-dashboard" element={<SeekerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          
          {/* Main Content (home, listings, events, about, profile) */}
          <Route path="/*" element={<MainContent />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}