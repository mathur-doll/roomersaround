# RoomersAround Backend - Complete Setup Guide

This guide will walk you through setting up your RoomersAround backend from scratch, importing the fake data, and connecting it to your frontend.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Import Fake Data](#import-fake-data)
5. [Running the Server](#running-the-server)
6. [API Endpoints](#api-endpoints)
7. [Frontend Integration](#frontend-integration)
8. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- ✅ **MongoDB** (v5 or higher) - [Download here](https://www.mongodb.com/try/download/community)
  - OR **PostgreSQL** (v13 or higher) - [Download here](https://www.postgresql.org/download/)
- ✅ **npm** or **yarn** package manager
- ✅ **Git** (optional, for version control)

### Verify installations:
```bash
node --version
npm --version
mongo --version  # or: psql --version
```

---

## 2. Installation

### Step 1: Copy Backend Setup Files

Copy all files from this `backend-setup` folder to your backend project directory:

```bash
# From your backend directory
cp -r backend-setup/* your-backend-folder/
```

Files to copy:
- `server.js` - Main server file
- `package.json` - Dependencies
- `.env.example` - Environment variables template
- `seedDatabase.js` - Data import script
- `models/` - Database models (User, Property, Event)
- `routes/` - API routes
- `seed-data/` - Fake data JSON files

### Step 2: Install Dependencies

```bash
cd your-backend-folder
npm install
```

This installs:
- **express** - Web framework
- **mongoose** - MongoDB ODM (or sequelize for PostgreSQL)
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Step 3: Setup Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

Example `.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb://localhost:27017/roomersaround
```

---

## 3. Database Setup

### Option A: MongoDB Setup

#### Install MongoDB (if not installed):
**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Run the installer
# Start MongoDB service
```

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Verify MongoDB is running:
```bash
mongo --version
mongo  # Should connect to MongoDB shell
```

### Option B: PostgreSQL Setup

If using PostgreSQL instead:

1. **Install PostgreSQL** from postgresql.org
2. **Create database:**
```bash
psql -U postgres
CREATE DATABASE roomersaround;
\q
```

3. **Update your `.env`:**
```env
DATABASE_TYPE=postgresql
DB_HOST=localhost
DB_NAME=roomersaround
DB_USER=postgres
DB_PASSWORD=your_password
```

4. **Update model files** - Uncomment PostgreSQL sections in:
   - `models/User.js`
   - `models/Property.js`
   - `models/Event.js`

---

## 4. Import Fake Data

### Step 1: Ensure Database is Running

**MongoDB:**
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ping')"
```

**PostgreSQL:**
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"
```

### Step 2: Run the Seed Script

```bash
npm run seed
```

You should see output like:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

🗑️  Clearing existing data...
✅ Existing data cleared

📂 Loading data from JSON files...
   Loaded 250 users
   Loaded 500 properties
   Loaded 50 events

👥 Inserting users...
✅ Inserted 250 users

🏠 Inserting properties...
✅ Inserted 500 properties

📅 Inserting events...
✅ Inserted 50 events

============================================================
✨ DATABASE SEEDED SUCCESSFULLY!
============================================================
Total Records: 800
   Users: 250
   Properties: 500
   Events: 50
============================================================
```

### Step 3: Verify Data Import

**MongoDB:**
```bash
mongo
use roomersaround
db.users.count()      # Should return 250
db.properties.count() # Should return 500
db.events.count()     # Should return 50
```

**PostgreSQL:**
```bash
psql -U postgres -d roomersaround
SELECT COUNT(*) FROM users;      -- Should return 250
SELECT COUNT(*) FROM properties; -- Should return 500
SELECT COUNT(*) FROM events;     -- Should return 50
```

---

## 5. Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

You should see:
```
==================================================
🚀 RoomersAround API Server
==================================================
📍 Server running on port 5000
🌐 API URL: http://localhost:5000
📚 Endpoints:
   - GET  http://localhost:5000/api/users
   - GET  http://localhost:5000/api/properties
   - GET  http://localhost:5000/api/events
==================================================
✅ Connected to MongoDB
```

### Test the API:

Visit in your browser or use curl:
```bash
# Health check
curl http://localhost:5000/api/health

# Get all properties
curl http://localhost:5000/api/properties

# Get all users
curl http://localhost:5000/api/users

# Get all events
curl http://localhost:5000/api/events
```

---

## 6. API Endpoints

### Users API

#### Get all users
```
GET /api/users
Query Parameters:
  - page (default: 1)
  - limit (default: 20)
  - nationality (filter by nationality)
  - profession (filter by profession)
  - verified (filter by verified status: true/false)
  - minRating (filter by minimum rating)

Example: GET /api/users?nationality=French&verified=true&page=1&limit=10
```

#### Get single user
```
GET /api/users/:id
Example: GET /api/users/1
```

#### Get user's properties
```
GET /api/users/:id/properties
Example: GET /api/users/5/properties
```

#### Get filter options
```
GET /api/users/filters/nationalities
GET /api/users/filters/professions
```

### Properties API

#### Get all properties
```
GET /api/properties
Query Parameters:
  - page (default: 1)
  - limit (default: 20)
  - search (search in name, description, location)
  - city (filter by city)
  - type (filter by property type)
  - minPrice (filter by minimum price)
  - maxPrice (filter by maximum price)
  - bedrooms (filter by number of bedrooms)
  - verified (filter by verified status: true/false)
  - sortBy (default: created_at)
  - sortOrder (asc/desc, default: desc)

Example: GET /api/properties?city=Rome&minPrice=500&maxPrice=1500&bedrooms=2&verified=true
```

#### Get single property
```
GET /api/properties/:id
Example: GET /api/properties/10
```

#### Get filter options
```
GET /api/properties/filters/cities
GET /api/properties/filters/types
GET /api/properties/filters/amenities
GET /api/properties/filters/price-range
```

### Events API

#### Get all events
```
GET /api/events
Query Parameters:
  - page (default: 1)
  - limit (default: 20)
  - type (filter by event type)
  - is_official (filter by official status: true/false)
  - upcoming (show only upcoming events: true/false, default: true)
  - sortBy (default: event_date)
  - sortOrder (asc/desc, default: asc)

Example: GET /api/events?type=Language Exchange&is_official=true&upcoming=true
```

#### Get single event
```
GET /api/events/:id
Example: GET /api/events/5
```

#### Get featured events
```
GET /api/events/featured/upcoming?limit=10
GET /api/events/featured/popular?limit=10
```

#### Get filter options
```
GET /api/events/filters/types
```

---

## 7. Frontend Integration

### React/React Native Example

#### Install Axios:
```bash
npm install axios
```

#### Create API service:
```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProperties = async (filters = {}) => {
  const response = await api.get('/properties', { params: filters });
  return response.data;
};

export const getProperty = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response.data;
};

export const getUsers = async (filters = {}) => {
  const response = await api.get('/users', { params: filters });
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const getEvents = async (filters = {}) => {
  const response = await api.get('/events', { params: filters });
  return response.data;
};

export const getEvent = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export default api;
```

#### Use in components:
```javascript
// components/PropertyList.jsx
import React, { useState, useEffect } from 'react';
import { getProperties } from '../services/api';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties({
          city: 'Rome',
          verified: true,
          page: 1,
          limit: 20
        });
        setProperties(data.properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {properties.map(property => (
        <div key={property.id}>
          <h3>{property.name}</h3>
          <p>{property.location}</p>
          <p>€{property.price}/month</p>
        </div>
      ))}
    </div>
  );
}

export default PropertyList;
```

### Search and Filter Example:
```javascript
// components/PropertySearch.jsx
import React, { useState } from 'react';
import { getProperties } from '../services/api';

function PropertySearch() {
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    type: ''
  });
  const [properties, setProperties] = useState([]);

  const handleSearch = async () => {
    const data = await getProperties(filters);
    setProperties(data.properties);
  };

  return (
    <div>
      <input
        placeholder="City"
        value={filters.city}
        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
      />
      <input
        type="number"
        placeholder="Min Price"
        value={filters.minPrice}
        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
```

---

## 8. Troubleshooting

### Problem: Cannot connect to database

**Solution:**
```bash
# Check if MongoDB/PostgreSQL is running
# MongoDB:
sudo systemctl status mongodb

# PostgreSQL:
sudo systemctl status postgresql

# Start if not running:
sudo systemctl start mongodb
# or
sudo systemctl start postgresql
```

### Problem: Port 5000 already in use

**Solution:**
Change PORT in `.env`:
```env
PORT=5001
```

### Problem: Data not appearing

**Solution:**
1. Verify database connection
2. Re-run seed script: `npm run seed`
3. Check server logs for errors

### Problem: CORS errors in frontend

**Solution:**
Update CORS in `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

### Problem: Mongoose connection errors

**Solution:**
Ensure MongoDB URI is correct in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/roomersaround
```

---

## 🎉 You're All Set!

Your RoomersAround backend is now ready with:
- ✅ 250 international users
- ✅ 500 properties across Italy
- ✅ 50 community events
- ✅ Full REST API with search and filters
- ✅ Ready for frontend integration

### Next Steps:

1. **Test all endpoints** using Postman or curl
2. **Connect your frontend** using the API service examples
3. **Customize** the models and routes as needed
4. **Add authentication** (JWT) for user login
5. **Deploy** to production (Heroku, AWS, etc.)

### Useful Commands:

```bash
npm start          # Start server
npm run dev        # Start with auto-reload
npm run seed       # Import fake data
mongo             # Open MongoDB shell
```

---

**Need Help?**
- Check the API documentation at `http://localhost:5000`
- Review the code comments in each file
- Test endpoints with Postman or curl

**Happy Coding! 🚀**
