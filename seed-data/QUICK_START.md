# Quick Start - Rome Fake Data

## 📦 What's Included

- ✅ **500 properties** in Rome and nearby cities (1 hour train distance)
- ✅ **20 events** with official and community gatherings
- ✅ **50 users** with varied roles and backgrounds
- ✅ **Python generator** to create more properties

## 🚀 3-Step Setup

### 1. Copy to Backend

```bash
# Copy fake data files to your backend
cp seed-data/*.json /path/to/ROOMERSAROUND-BACKEND/seed-data/
```

### 2. Load Data

```bash
cd /path/to/ROOMERSAROUND-BACKEND

# Option A: Using Node.js script (create load-seed-data.js first - see INTEGRATION_GUIDE.md)
node load-seed-data.js

# Option B: Using SQL directly
psql your_database < seed-data-insert.sql

# Option C: Using your existing seed script
npm run seed  # or whatever command you use
```

### 3. Verify

```bash
# Check if data loaded
curl http://localhost:3000/api/properties | jq '.properties | length'
# Expected: 500

curl http://localhost:3000/api/events | jq '.events | length'
# Expected: 20
```

## 🔧 If Events Don't Show in Frontend

Check these in order:

### 1. Backend Running?
```bash
cd ROOMERSAROUND-BACKEND
npm start
# Should see: Server running on port 3000 (or your port)
```

### 2. Data in Database?
```sql
SELECT COUNT(*) FROM events;
-- Should return: 20

SELECT id, title, event_date FROM events LIMIT 3;
```

### 3. API Working?
```bash
curl http://localhost:3000/api/events
# Should return JSON with events array
```

### 4. Frontend Connecting?
Open browser console (F12) and check:
- Network tab: Is `/api/events` called?
- Console: Any errors?
- Add this to EventsPage.jsx:
```jsx
const fetchEvents = async () => {
  console.log('Fetching events...');
  const data = await eventsAPI.getAll();
  console.log('Received:', data);  // <-- ADD THIS
  setEvents(data.events || []);
};
```

## 🗺️ Rome Areas Covered

### Main Neighborhoods (85%)
- **Historic**: Trastevere, Monti, Centro Storico
- **Trendy**: Pigneto, San Lorenzo, Ostiense
- **Business**: EUR, Prati
- **Residential**: Testaccio, San Giovanni, Esquilino

### Nearby Cities (15%)
- **Frascati** (30 min) - Wine country
- **Ostia** (30 min) - Beach
- **Tivoli** (45 min) - Hills & gardens
- **Albano Laziale** (40 min) - Lake area
- **Anzio** (60 min) - Coastal
- **Civitavecchia** (60 min) - Port city

## 📊 Data Distribution

### Properties
- 280 available (56%)
- 220 occupied (44%)
- Price: €345 - €3,186/month
- Types: Studios, Apartments, Lofts, Penthouses, Shared Rooms, Villas

### Events
- 12 official events (60%)
- 8 community gatherings (40%)
- Categories: Social, Food, Sports, Culture, Networking, etc.
- Dates: Nov 24 - Dec 7, 2025

## 🆘 Common Issues

### "No events showing"
**Cause**: API not returning data or frontend not receiving it
**Fix**: Check steps 1-4 above

### "Events API returns empty array"
**Cause**: Data not loaded in database
**Fix**: Run `node load-seed-data.js` again

### "Properties show but events don't"
**Cause**: Events API route might be different
**Fix**: Check your API routes. Should be `/api/events`

### "Cannot read property 'events' of undefined"
**Cause**: API response structure mismatch
**Fix**: Update EventsPage.jsx:
```jsx
const eventsList = data?.events || data || [];
setEvents(eventsList);
```

## 🎯 API Endpoints You Need

```javascript
// Backend - Make sure you have these:

// GET /api/properties - List all properties
// GET /api/properties/:id - Get one property
// GET /api/events - List all events  ← Make sure this exists!
// GET /api/events/:id - Get one event
// POST /api/events - Create event
// POST /api/events/:id/join - Join event
// DELETE /api/events/:id - Delete event
```

## ✨ Pro Tips

1. **Generate More Properties**: Run `python3 generate_rome_properties.py` to create fresh data
2. **Customize Locations**: Edit LOCATIONS array in the Python script
3. **Add More Events**: Copy the structure in `fake_data_events.json`
4. **Real Images**: Replace placeholder image paths with actual images

## 📁 File Structure

```
seed-data/
├── fake_data_properties.json    # 500 properties
├── fake_data_events.json         # 20 events
├── fake_data_users.json          # 50 users
├── generate_rome_properties.py   # Generator script
├── INTEGRATION_GUIDE.md          # Detailed guide
└── QUICK_START.md               # This file
```

## Need More Help?

Read the full **INTEGRATION_GUIDE.md** for:
- Complete backend setup code
- SQL scripts
- Frontend debugging
- API implementation examples
- Filter and search functionality
