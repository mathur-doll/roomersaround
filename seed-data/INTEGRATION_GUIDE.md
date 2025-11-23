# Rome-Focused Fake Data Integration Guide

This guide explains how to integrate the Rome-focused fake data into your RoomersAround backend and display it in the frontend.

## 📁 Generated Files

- **fake_data_properties.json** - 500 properties in Rome and nearby cities (within 1 hour train)
- **fake_data_events.json** - 20 events in Rome with various categories
- **fake_data_users.json** - 50 users with different roles and profiles
- **generate_rome_properties.py** - Script to regenerate properties data

## 📊 Data Statistics

### Properties (500 total)
- **Rome**: 425 properties (85%)
- **Nearby cities**: 75 properties (15%)
  - Frascati (30 min train)
  - Ostia (30 min train)
  - Tivoli (45 min train)
  - Albano Laziale (40 min train)
  - Anzio (60 min train)
  - Civitavecchia (60 min train)
  - Castelli Romani area
- **Status**: 280 available, 220 occupied
- **Price range**: €345 - €3,186/month

### Rome Neighborhoods Covered
- Trastevere, Monti, Centro Storico
- Testaccio, Prati, Pigneto
- San Lorenzo, EUR, San Giovanni
- Esquilino, Ostiense, Garbatella
- Flaminio, Salario, Trieste
- Tiburtino, Nomentano, Parioli
- Monteverde, Appio Latino

### Events (20 total)
- Official Events: 12
- Community Gatherings: 8
- Categories: Social, Arts & Culture, Sports & Fitness, Food & Drink, Language Exchange, Outdoor Adventure, Music & Entertainment, Networking, Workshop & Learning, Volunteer & Charity

---

## 🔧 Backend Integration

### Step 1: Copy Files to Backend

```bash
# Copy fake data files to your backend seed-data directory
cp seed-data/*.json /path/to/ROOMERSAROUND-BACKEND/seed-data/
```

### Step 2: Create/Update Load Script

Create a file `load-seed-data.js` in your backend root:

```javascript
// load-seed-data.js
const fs = require('fs');
const path = require('path');

// Import your database client (adjust based on your setup)
const db = require('./db'); // or your database connection

async function loadFakeData() {
  console.log('🌱 Loading fake data...');

  // Load JSON files
  const properties = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seed-data/fake_data_properties.json'), 'utf8')
  );
  const events = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seed-data/fake_data_events.json'), 'utf8')
  );
  const users = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seed-data/fake_data_users.json'), 'utf8')
  );

  try {
    // 1. Insert Users
    console.log('Inserting users...');
    for (const user of users.users) {
      await db.query(`
        INSERT INTO users (id, email, name, role, avatar, bio, city, neighborhood, joined_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE
        SET email = $2, name = $3, role = $4, avatar = $5, bio = $6,
            city = $7, neighborhood = $8, joined_date = $9
      `, [
        user.id, user.email, user.name, user.role, user.avatar,
        user.bio, user.city, user.neighborhood, user.joined_date
      ]);
    }
    console.log(`✓ Inserted ${users.users.length} users`);

    // 2. Insert Properties
    console.log('Inserting properties...');
    for (const property of properties.properties) {
      await db.query(`
        INSERT INTO properties (
          id, title, description, address, city, neighborhood, country,
          latitude, longitude, price_per_month, bedrooms, bathrooms,
          area_sqm, property_type, amenities, status, images, owner_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (id) DO UPDATE
        SET title = $2, description = $3, address = $4, city = $5,
            neighborhood = $6, country = $7, latitude = $8, longitude = $9,
            price_per_month = $10, bedrooms = $11, bathrooms = $12,
            area_sqm = $13, property_type = $14, amenities = $15,
            status = $16, images = $17, owner_id = $18
      `, [
        property.id, property.title, property.description, property.address,
        property.city, property.neighborhood, property.country,
        property.latitude, property.longitude, property.price_per_month,
        property.bedrooms, property.bathrooms, property.area_sqm,
        property.property_type, JSON.stringify(property.amenities),
        property.status, JSON.stringify(property.images), property.owner_id
      ]);
    }
    console.log(`✓ Inserted ${properties.properties.length} properties`);

    // 3. Insert Events
    console.log('Inserting events...');
    for (const event of events.events) {
      await db.query(`
        INSERT INTO events (
          id, title, description, event_date, location, category,
          max_attendees, attendees, creator_id, is_official, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE
        SET title = $2, description = $3, event_date = $4, location = $5,
            category = $6, max_attendees = $7, attendees = $8,
            creator_id = $9, is_official = $10, created_at = $11
      `, [
        event.id, event.title, event.description, event.event_date,
        event.location, event.category, event.max_attendees,
        JSON.stringify(event.attendees), event.creator_id,
        event.is_official, event.created_at
      ]);
    }
    console.log(`✓ Inserted ${events.events.length} events`);

    console.log('✨ Fake data loaded successfully!');
  } catch (error) {
    console.error('Error loading fake data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  loadFakeData()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { loadFakeData };
```

### Step 3: Run the Load Script

```bash
cd /path/to/ROOMERSAROUND-BACKEND
node load-seed-data.js
```

### Step 4: Alternative - SQL Insert Script

If you prefer SQL, create `seed-data-insert.sql`:

```sql
-- Insert users
INSERT INTO users (id, email, name, role, avatar, bio, city, neighborhood, joined_date)
SELECT
  (value->>'id')::int,
  value->>'email',
  value->>'name',
  value->>'role',
  value->>'avatar',
  value->>'bio',
  value->>'city',
  value->>'neighborhood',
  (value->>'joined_date')::date
FROM json_array_elements(
  pg_read_file('/path/to/fake_data_users.json')::json->'users'
);

-- Insert properties
INSERT INTO properties (
  id, title, description, address, city, neighborhood, country,
  latitude, longitude, price_per_month, bedrooms, bathrooms,
  area_sqm, property_type, amenities, status, images, owner_id
)
SELECT
  (value->>'id')::int,
  value->>'title',
  value->>'description',
  value->>'address',
  value->>'city',
  value->>'neighborhood',
  value->>'country',
  (value->>'latitude')::numeric,
  (value->>'longitude')::numeric,
  (value->>'price_per_month')::int,
  (value->>'bedrooms')::int,
  (value->>'bathrooms')::int,
  (value->>'area_sqm')::int,
  value->>'property_type',
  value->'amenities',
  value->>'status',
  value->'images',
  (value->>'owner_id')::int
FROM json_array_elements(
  pg_read_file('/path/to/fake_data_properties.json')::json->'properties'
);

-- Insert events
INSERT INTO events (
  id, title, description, event_date, location, category,
  max_attendees, attendees, creator_id, is_official, created_at
)
SELECT
  (value->>'id')::int,
  value->>'title',
  value->>'description',
  (value->>'event_date')::timestamp,
  value->>'location',
  value->>'category',
  (value->>'max_attendees')::int,
  value->'attendees',
  (value->>'creator_id')::int,
  (value->>'is_official')::boolean,
  (value->>'created_at')::timestamp
FROM json_array_elements(
  pg_read_file('/path/to/fake_data_events.json')::json->'events'
);
```

---

## 🎨 Frontend Integration

### Current Issue: Events Not Showing

Based on your EventsPage.jsx code, the issue might be:

1. **API not returning data** - Check backend logs
2. **Data structure mismatch** - Events structure in response
3. **Date filtering** - Events with past dates might be filtered out

### Fix for EventsPage.jsx

Update the events fetch to handle the data correctly:

```jsx
// In EventsPage.jsx

const fetchEvents = async () => {
  try {
    setLoading(true);
    const data = await eventsAPI.getAll();

    // Debug: Check what data structure you're receiving
    console.log('Events API response:', data);

    // Handle different response structures
    const eventsList = data.events || data || [];

    // Sort by date (upcoming first)
    const sortedEvents = eventsList.sort((a, b) =>
      new Date(a.event_date) - new Date(b.event_date)
    );

    setEvents(sortedEvents);
    console.log(`Loaded ${sortedEvents.length} events`);
  } catch (error) {
    console.error('Error fetching events:', error);
    setEvents([]); // Set empty array on error
  } finally {
    setLoading(false);
  }
};
```

### Backend API Check

Verify your backend events API returns the correct structure:

```javascript
// In your backend API (e.g., server.js or routes/events.js)

app.get('/api/events', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        e.*,
        u.name as creator_name,
        CONCAT(u.name) as creator_full_name
      FROM events e
      LEFT JOIN users u ON e.creator_id = u.id
      ORDER BY e.event_date ASC
    `);

    // Parse JSON fields
    const events = result.rows.map(event => ({
      ...event,
      attendees: typeof event.attendees === 'string'
        ? JSON.parse(event.attendees)
        : event.attendees
    }));

    // Return in the format your frontend expects
    res.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});
```

### Test the API Directly

```bash
# Test if the API is working
curl http://localhost:3000/api/events

# Should return:
# {
#   "events": [
#     { "id": 1, "title": "Welcome Aperitivo...", ... },
#     ...
#   ]
# }
```

---

## 🔍 Debugging Steps

### 1. Check Backend Logs

```bash
# In your backend terminal, look for:
- Database connection errors
- SQL query errors
- API route errors
```

### 2. Check Browser Console

Open your frontend in browser and check console for:
```javascript
// You should see:
Events API response: { events: [...] }
Loaded 20 events
```

### 3. Check Network Tab

In browser DevTools > Network tab:
- Check if `/api/events` request is made
- Check the response status (should be 200)
- Check the response data structure

### 4. Verify Database

```sql
-- Check if events are in database
SELECT COUNT(*) FROM events;
-- Should return 20

SELECT id, title, event_date FROM events LIMIT 5;
-- Should show the events
```

---

## 🚀 Quick Start Commands

```bash
# Backend setup
cd ROOMERSAROUND-BACKEND
npm install
node load-seed-data.js
npm start

# Frontend setup
cd ROOMERSAROUND-ROME
npm install
npm start

# Verify data loaded
curl http://localhost:3000/api/properties | jq '.properties | length'
# Should output: 500

curl http://localhost:3000/api/events | jq '.events | length'
# Should output: 20
```

---

## 📝 Additional Features

### Filter Properties by Location

Add to your properties API:

```javascript
app.get('/api/properties', async (req, res) => {
  const { city, neighborhood, status } = req.query;

  let query = 'SELECT * FROM properties WHERE 1=1';
  const params = [];

  if (city) {
    params.push(city);
    query += ` AND city = $${params.length}`;
  }

  if (neighborhood) {
    params.push(neighborhood);
    query += ` AND neighborhood = $${params.length}`;
  }

  if (status) {
    params.push(status);
    query += ` AND status = $${params.length}`;
  }

  const result = await db.query(query, params);
  res.json({ properties: result.rows });
});
```

### Get Properties Near Location

```javascript
app.get('/api/properties/near', async (req, res) => {
  const { lat, lon, radius } = req.query;

  // Query properties within radius (in km)
  const result = await db.query(`
    SELECT *,
      (
        6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )
      ) AS distance
    FROM properties
    HAVING distance < $3
    ORDER BY distance
  `, [lat, lon, radius]);

  res.json({ properties: result.rows });
});
```

---

## 🎯 Next Steps

1. ✅ Copy fake data files to backend
2. ✅ Run load script to populate database
3. ✅ Verify data in database
4. ✅ Test API endpoints
5. ✅ Check frontend display
6. ✅ Add filters and search functionality

---

## 📧 Need Help?

If events still don't show:
1. Share your backend API code (events route)
2. Share the exact error from browser console
3. Share the response from `curl http://localhost:3000/api/events`

The data is ready - it's just a matter of connecting the backend and frontend correctly!
