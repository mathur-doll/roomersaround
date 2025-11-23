import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Heart, MapPin, Bed, Bath, Square, LogOut, User, Eye, Home } from 'lucide-react';
import axios from 'axios';

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    beds: '',
    type: '',
    available: true
  });
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchProperties();
  }, [navigate]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/properties');
      setProperties(response.data.properties || []);
      setFilteredProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = properties;

    // Text search
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filters
    if (filters.minPrice) {
      filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(filters.maxPrice));
    }
    if (filters.beds) {
      filtered = filtered.filter(p => p.beds >= parseInt(filters.beds));
    }
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.available) {
      filtered = filtered.filter(p => p.available);
    }

    setFilteredProperties(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, filters, properties]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
<header className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-light">Find Your Perfect Place</h1>
          <p className="text-xs text-purple-100">Property Seeker Dashboard</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition"
        >
          <Home className="w-5 h-5" />
          <span>Back Home</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 text-white hover:bg-white/20 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
</header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, name, or description..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Min Price (€)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                placeholder="500"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Price (€)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                placeholder="2000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Min Beds</label>
              <select
                value={filters.beds}
                onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Property Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="Studio">Studio</option>
                <option value="Loft">Loft</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Availability</label>
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  id="available"
                  checked={filters.available}
                  onChange={(e) => setFilters({ ...filters, available: e.target.checked })}
                  className="w-4 h-4 text-blue-600 mr-2"
                />
                <label htmlFor="available" className="text-sm text-gray-700">
                  Available only
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found <span className="font-bold text-gray-900">{filteredProperties.length}</span> properties
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={() => setSelectedProperty(property)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer">
      <div className="relative" onClick={onViewDetails}>
        <img
          src={property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
          alt={property.name}
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
          property.available 
            ? 'bg-green-500 text-white' 
            : 'bg-orange-500 text-white'
        }`}>
          {property.available ? 'Available' : 'Occupied'}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{property.name}</h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.beds} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.baths} baths</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div>
            <div className="text-2xl font-bold text-blue-600">€{property.price}</div>
            <div className="text-xs text-gray-600">{property.duration || 'per month'}</div>
          </div>

          <button
            onClick={onViewDetails}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Property Detail Modal
const PropertyDetailModal = ({ property, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img
            src={property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
            alt={property.name}
            className="w-full h-80 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            ✕
          </button>
          <span className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-medium ${
            property.available 
              ? 'bg-green-500 text-white' 
              : 'bg-orange-500 text-white'
          }`}>
            {property.available ? 'Available Now' : 'Currently Occupied'}
          </span>
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{property.name}</h2>
          
          <div className="flex items-center text-gray-600 mb-6">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg">{property.location}</span>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">€{property.price}</div>
              <div className="text-sm text-gray-600 mt-1">per month</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Bed className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{property.beds}</div>
              <div className="text-sm text-gray-600">Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Bath className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{property.baths}</div>
              <div className="text-sm text-gray-600">Bathrooms</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Square className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{property.sqft}</div>
              <div className="text-sm text-gray-600">Square Feet</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {property.description || 'No description available'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Property Type</span>
              <span className="font-medium text-gray-900">{property.type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium text-gray-900">{property.duration || 'Flexible'}</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-medium text-lg">
              Contact Owner
            </button>
            <button className="flex-1 border-2 border-blue-600 text-blue-600 py-4 rounded-lg hover:bg-blue-50 transition font-medium text-lg flex items-center justify-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;