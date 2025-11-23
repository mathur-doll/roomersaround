# Quick Start Guide - RoomersAround Backend

Get your backend up and running in 5 minutes!

## ⚡ Super Quick Setup

### 1. Install & Setup (2 minutes)

```bash
# 1. Navigate to your backend folder
cd your-backend-folder

# 2. Copy all files from backend-setup folder here

# 3. Install dependencies
npm install

# 4. Create environment file
cp .env.example .env
# Edit .env if needed (default settings work for local development)
```

### 2. Start Database (30 seconds)

**MongoDB:**
```bash
# Mac
brew services start mongodb-community

# Windows - MongoDB should start automatically
# Or start from Services panel

# Linux
sudo systemctl start mongodb
```

### 3. Import Data (1 minute)

```bash
# Import all fake data (250 users, 500 properties, 50 events)
npm run seed
```

### 4. Start Server (30 seconds)

```bash
# Start the server
npm start
```

Visit: **http://localhost:5000**

## ✅ Verify It Works

Test these URLs in your browser:

- **API Info:** http://localhost:5000/
- **All Properties:** http://localhost:5000/api/properties
- **All Users:** http://localhost:5000/api/users
- **All Events:** http://localhost:5000/api/events

If you see JSON data, you're all set! 🎉

## 📝 Common API Calls

### Get Properties in Rome under €1000
```
http://localhost:5000/api/properties?city=Rome&maxPrice=1000
```

### Get Verified Properties with 2 Bedrooms
```
http://localhost:5000/api/properties?verified=true&bedrooms=2
```

### Get French Users
```
http://localhost:5000/api/users?nationality=French
```

### Get Upcoming Events
```
http://localhost:5000/api/events?upcoming=true
```

## 🔌 Connect Your Frontend

**React/React Native:**

1. Install axios:
```bash
npm install axios
```

2. Create `services/api.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getProperties = async (filters) => {
  const response = await api.get('/properties', { params: filters });
  return response.data;
};

export const getUsers = async (filters) => {
  const response = await api.get('/users', { params: filters });
  return response.data;
};

export const getEvents = async (filters) => {
  const response = await api.get('/events', { params: filters });
  return response.data;
};

export default api;
```

3. Use in components:
```javascript
import { getProperties } from './services/api';

// In your component
const data = await getProperties({ city: 'Rome', verified: true });
setProperties(data.properties);
```

## 🛠️ Useful Commands

```bash
npm start          # Start server (production)
npm run dev        # Start with auto-reload (development)
npm run seed       # Import/re-import fake data
```

## 🆘 Quick Troubleshooting

**Problem:** Server won't start
- ✅ Check if MongoDB is running: `mongo --eval "db.version()"`
- ✅ Check if port 5000 is free

**Problem:** No data showing
- ✅ Run `npm run seed` again
- ✅ Check database: `mongo` → `use roomersaround` → `db.properties.count()`

**Problem:** CORS errors
- ✅ Make sure CORS is enabled in server.js (it is by default)
- ✅ Check your frontend is calling the correct URL

## 📚 Need More Details?

See **SETUP_GUIDE.md** for:
- Complete installation instructions
- Database setup for PostgreSQL
- Full API documentation
- Advanced frontend integration
- Deployment guide

---

**You're ready to build! 🚀**

All 800 records (250 users + 500 properties + 50 events) are now available via your API!
