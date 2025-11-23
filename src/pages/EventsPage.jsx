import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users as UsersIcon, X, Plus, Trash2, Star, Sparkles } from 'lucide-react';
import { eventsAPI } from '../api';

const EventsPage = ({ isAuthenticated, user, members }) => {
  const [events, setEvents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, official, community

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await eventsAPI.getAll();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    if (!isAuthenticated) {
      alert('Please login to join events');
      return;
    }
    try {
      await eventsAPI.join(eventId);
      fetchEvents();
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await eventsAPI.delete(eventId);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const officialEvents = events.filter(e => e.is_official);
  const communityEvents = events.filter(e => !e.is_official);

  const filteredEvents = filter === 'all' ? events : 
                        filter === 'official' ? officialEvents : 
                        communityEvents;

  if (loading) {
    return <div className="text-center py-12">Loading events...</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-4xl font-extralight text-gray-900 mb-2">Events in Rome</h2>
          <p className="text-gray-600">Discover and join amazing experiences in the eternal city</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Host Community Gathering</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-8 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-3 font-medium transition border-b-2 ${
            filter === 'all' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-blue-600'
          }`}
        >
          All Events ({events.length})
        </button>
        <button
          onClick={() => setFilter('official')}
          className={`px-6 py-3 font-medium transition border-b-2 ${
            filter === 'official' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-blue-600'
          }`}
        >
          <Star className="w-4 h-4 inline mr-1" />
          Official Events ({officialEvents.length})
        </button>
        <button
          onClick={() => setFilter('community')}
          className={`px-6 py-3 font-medium transition border-b-2 ${
            filter === 'community' 
              ? 'border-purple-600 text-purple-600' 
              : 'border-transparent text-gray-600 hover:text-purple-600'
          }`}
        >
          <Sparkles className="w-4 h-4 inline mr-1" />
          Community Gatherings ({communityEvents.length})
        </button>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="bg-blue-50 rounded-xl p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'community' ? "Be the first to host a community gathering!" : "Check back soon for exciting events!"}
          </p>
          {isAuthenticated && filter === 'community' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition"
            >
              Host Community Gathering
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              members={members}
              isAuthenticated={isAuthenticated}
              user={user}
              onJoin={handleJoinEvent}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
};

// Event Card Component
const EventCard = ({ event, members, isAuthenticated, user, onJoin, onDelete }) => {
  const isCreator = user?.id === event.creator_id;
  const isAdmin = user?.role === 'superuser';
  const hasJoined = event.attendees?.includes(user?.id);
  const attendeesList = event.attendees?.map(id => members.find(m => m.id === id)).filter(Boolean) || [];
  const isOfficial = event.is_official;

  return (
    <div className={`bg-white rounded-2xl p-6 border-2 ${
      isOfficial 
        ? 'border-blue-200 bg-gradient-to-r from-blue-50/50 to-transparent' 
        : 'border-purple-200 bg-gradient-to-r from-purple-50/50 to-transparent'
    } hover:shadow-xl transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Event Badge */}
          <div className="flex items-center space-x-3 mb-3">
            {isOfficial ? (
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Official Event</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Community Gathering</span>
              </div>
            )}
            <span className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
              {event.category}
            </span>
          </div>

          <h3 className="text-2xl font-light text-gray-900 mb-3">{event.title}</h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-3 text-blue-500" />
              <span>
                {new Date(event.event_date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3 text-blue-500" />
              <span>{event.location}</span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>

          {!isOfficial && (
            <p className="text-sm text-gray-500 italic mb-4">
              Hosted by: {event.creator_full_name || event.creator_name}
            </p>
          )}

          {/* Attendees */}
          <div className="flex items-center space-x-2 mb-4">
            <UsersIcon className="w-5 h-5 text-gray-600" />
            <div className="flex items-center -space-x-2">
              {attendeesList.slice(0, 5).map(attendee => (
                <img
                  key={attendee.id}
                  src={attendee.avatar}
                  alt={attendee.name}
                  className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  title={attendee.name}
                />
              ))}
            </div>
            <span className="text-gray-600 text-sm ml-2">
              {attendeesList.length} {attendeesList.length === 1 ? 'person' : 'people'} attending
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="ml-6 flex flex-col space-y-3">
          {isAuthenticated && !hasJoined && (
            <button
              onClick={() => onJoin(event.id)}
              className={`px-6 py-3 rounded-full text-white font-medium hover:shadow-lg transition ${
                isOfficial 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-blue-500/30'
                  : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-purple-500/30'
              }`}
            >
              Join Event
            </button>
          )}
          
          {hasJoined && (
            <div className="px-6 py-3 bg-green-100 text-green-700 rounded-full text-center font-medium">
              ✓ Joined
            </div>
          )}

          {!isAuthenticated && (
            <div className="px-6 py-3 bg-gray-100 text-gray-600 rounded-full text-center text-sm">
              Login to join
            </div>
          )}

          {(isCreator || isAdmin) && (
            <button
              onClick={() => onDelete(event.id)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-full text-sm flex items-center space-x-1 justify-center"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Event Modal
const CreateEventModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    category: 'Social',
    max_attendees: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Social',
    'Food & Drink', 
    'Sports & Fitness',
    'Arts & Culture',
    'Networking',
    'Language Exchange',
    'Outdoor Adventure',
    'Music & Entertainment',
    'Workshop & Learning',
    'Volunteer & Charity'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await eventsAPI.create(formData);
      onSuccess();
    } catch (error) {
      alert('Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-light text-gray-900 mb-1">Host a Community Gathering</h3>
            <p className="text-sm text-gray-600">Share an experience with fellow RoomersAround members</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Coffee & Chat in Trastevere"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              rows="4"
              placeholder="Tell people what to expect from this gathering..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time *</label>
            <input
              type="datetime-local"
              required
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              className="w-full bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Bar del Fico, Via della Pace 34"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees (optional)</label>
            <input
              type="number"
              value={formData.max_attendees}
              onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value })}
              className="w-full bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-gray-900 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Leave empty for unlimited"
              min="2"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 6-12 people for intimate gatherings</p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating...' : 'Host Gathering'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventsPage;