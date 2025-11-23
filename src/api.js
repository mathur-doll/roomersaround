// import axios from 'axios';

// // API Service for RoomersAround Backend
// const API_BASE_URL = '/api'; // Using relative path because we set up proxy

// // Get token from localStorage
// const getAuthHeader = () => {
//   const token = localStorage.getItem('token');
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// // Generic axios instance with error handling
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// // Properties API
// export const propertiesAPI = {
// //   // Get all properties with optional filters
// //   getAll: async (filters = {}) => {
// //     const queryParams = new URLSearchParams(filters).toString();
// //     const endpoint = queryParams ? `/properties?${queryParams}` : '/properties';
// //     return fetchAPI(endpoint);
// //   },

// //   // Get single property by ID
// //   getById: async (id) => {
// //     return fetchAPI(`/properties/${id}`);
// //   },

// //   // Get featured properties
// //   getFeatured: async () => {
// //     return fetchAPI('/properties/featured/list');
// //   },

// //   // Get members by property
// //   getMembersByProperty: async (propertyId) => {
// //     return fetchAPI(`/properties/${propertyId}/members`);
// //   }
// // };

// // // Members API
// // export const membersAPI = {
// //   // Get all members with optional filters
// //   getAll: async (filters = {}) => {
// //     const queryParams = new URLSearchParams(filters).toString();
// //     const endpoint = queryParams ? `/members?${queryParams}` : '/members';
// //     return fetchAPI(endpoint);
// //   },

// //   // Get single member by ID
// //   getById: async (id) => {
// //     return fetchAPI(`/members/${id}`);
// //   }
// // };

// // // Search API
// // export const searchAPI = {
// //   search: async (query) => {
// //     return fetchAPI(`/search?q=${encodeURIComponent(query)}`);
// //   }
// // };

// // // Stats API
// // export const statsAPI = {
// //   getStats: async () => {
// //     return fetchAPI('/stats');
// //   }
// // };

// // export default {
// //   properties: propertiesAPI,
// //   members: membersAPI,
// //   search: searchAPI,
// //   stats: statsAPI
// // };
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';

// // Get token from localStorage
// const getAuthHeader = () => {
//   const token = localStorage.getItem('token');
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// export const propertiesAPI = {
//   getAll: async () => {
//     const response = await axios.get(`${API_BASE_URL}/properties`);
//     return response.data;
//   },
  
//   getOne: async (id) => {
//     const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
//     return response.data;
//   },

//   create: async (propertyData) => {
//     const response = await axios.post(
//       `${API_BASE_URL}/properties`,
//       propertyData,
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   },

//   update: async (id, propertyData) => {
//     const response = await axios.put(
//       `${API_BASE_URL}/properties/${id}`,
//       propertyData,
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   },

//   delete: async (id) => {
//     const response = await axios.delete(
//       `${API_BASE_URL}/properties/${id}`,
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   },

//   getMyProperties: async () => {
//     const response = await axios.get(
//       `${API_BASE_URL}/my-properties`,
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   }
// };

// export const membersAPI = {
//   getAll: async () => {
//     // For now, return seekers from users
//     const response = await axios.get(`${API_BASE_URL}/properties`);
//     return { members: [] }; // We'll populate this from backend later
//   }
// };

// export const statsAPI = {
//   getStats: async () => {
//     const response = await axios.get(`${API_BASE_URL}/properties`);
//     const properties = response.data.properties || [];
    
//     return {
//       totalProperties: properties.length,
//       totalMembers: 50, // Placeholder
//       averagePrice: Math.round(
//         properties.reduce((sum, p) => sum + p.price, 0) / properties.length
//       )
//     };
//   }
// };

// export const favoritesAPI = {
//   getAll: async () => {
//     const response = await axios.get(
//       `${API_BASE_URL}/favorites`,
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   },

//   add: async (propertyId) => {
//     const response = await axios.post(
//       `${API_BASE_URL}/favorites/${propertyId}`,
//       {},
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   },

//   remove: async (propertyId) => {
//     const response = await axios.delete(
//       `${API_BASE_URL}/favorites/${propertyId}`,
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   }
// };

// export const adminAPI = {
//   getUsers: async () => {
//     const response = await axios.get(
//       `${API_BASE_URL}/admin/users`,
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   },

//   getProperties: async () => {
//     const response = await axios.get(
//       `${API_BASE_URL}/admin/properties`,
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   },

//   getStats: async () => {
//     const response = await axios.get(
//       `${API_BASE_URL}/admin/stats`,
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   },

//   updateUserStatus: async (userId, isActive) => {
//     const response = await axios.patch(
//       `${API_BASE_URL}/admin/users/${userId}/status`,
//       { is_active: isActive },
//       { headers: getAuthHeader() }
//     );
//     return response.data;
//   }
// };
import axios from 'axios';
import fakeData from './fake_data.json'; // Import the local fake data

const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to merge backend properties with fake_data members
const mergePropertiesWithResidents = (backendProperties, fakeDataMembers) => {
  return backendProperties.map(property => {
    const resident = fakeDataMembers.find(m => m.propertyId === property.id);
    return {
      ...property,
      resident: resident || null
    };
  });
};

export const propertiesAPI = {
  getAll: async () => {
    try {
      // Try to get from backend first
      const response = await axios.get(`${API_BASE_URL}/properties`);
      const backendProperties = response.data.properties || [];
      
      // If backend has properties, merge with fake_data members
      if (backendProperties.length > 0) {
        const enrichedProperties = mergePropertiesWithResidents(
          backendProperties,
          fakeData.members
        );
        return { properties: enrichedProperties };
      }
    } catch (error) {
      console.log('Backend not available, using fake_data.json');
    }
    
    // Fallback to fake_data.json
    return { properties: fakeData.properties || [] };
  },
  
  getOne: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
      return response.data;
    } catch (error) {
      // Fallback to fake_data
      const property = fakeData.properties.find(p => p.id === parseInt(id));
      return { property };
    }
  },

  create: async (propertyData) => {
    const response = await axios.post(
      `${API_BASE_URL}/properties`,
      propertyData,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  update: async (id, propertyData) => {
    const response = await axios.put(
      `${API_BASE_URL}/properties/${id}`,
      propertyData,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(
      `${API_BASE_URL}/properties/${id}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getMyProperties: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/my-properties`,
      { headers: getAuthHeader() }
    );
    return response.data;
  }
};

export const membersAPI = {
  getAll: async () => {
    try {
      // Try backend first (if you add a members endpoint later)
      const response = await axios.get(`${API_BASE_URL}/members`);
      return response.data;
    } catch (error) {
      // Use fake_data.json members
      console.log('Using fake_data.json for members');
      return { members: fakeData.members || [] };
    }
  },

  getById: async (id) => {
    const member = fakeData.members.find(m => m.id === parseInt(id));
    return { member };
  },

  getByLocation: async (location) => {
    // Filter members whose properties are in the specified location
    const locationMembers = fakeData.members.filter(member => {
      const property = fakeData.properties.find(p => p.id === member.propertyId);
      return property && property.location.toLowerCase().includes(location.toLowerCase());
    });
    return { members: locationMembers };
  }
};

export const statsAPI = {
  getStats: async () => {
    try {
      const propertiesRes = await axios.get(`${API_BASE_URL}/properties`);
      const properties = propertiesRes.data.properties || [];

      return {
        totalProperties: properties.length > 0 ? properties.length : fakeData.properties.length,
        totalMembers: fakeData.members.length,
        averagePrice: properties.length > 0
          ? Math.round(properties.reduce((sum, p) => sum + parseFloat(p.price), 0) / properties.length)
          : Math.round(fakeData.properties.reduce((sum, p) => sum + p.price, 0) / fakeData.properties.length)
      };
    } catch (error) {
      // Use fake_data for stats
      return {
        totalProperties: fakeData.properties.length,
        totalMembers: fakeData.members.length,
        averagePrice: Math.round(fakeData.properties.reduce((sum, p) => sum + p.price, 0) / fakeData.properties.length)
      };
    }
  }
};

export const favoritesAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/favorites`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      return { favorites: [] };
    }
  },

  add: async (propertyId) => {
    const response = await axios.post(
      `${API_BASE_URL}/favorites/${propertyId}`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  remove: async (propertyId) => {
    const response = await axios.delete(
      `${API_BASE_URL}/favorites/${propertyId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  }
};

export const adminAPI = {
  getUsers: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/admin/users`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getProperties: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/admin/properties`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getStats: async () => {
    const response = await axios.get(
      `${API_BASE_URL}/admin/stats`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await axios.patch(
      `${API_BASE_URL}/admin/users/${userId}/status`,
      { is_active: isActive },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};
// ADD to existing api.js
export const eventsAPI = {
  getAll: async () => {
    const response = await axios.get(`${API_BASE_URL}/events`);
    return response.data;
  },
  
  create: async (eventData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/events`, eventData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  join: async (eventId) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/events/${eventId}/join`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },
  
  delete: async (eventId) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};