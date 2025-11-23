# RoomersAround Fake Data - Import Guide

This directory contains comprehensive fake data for the RoomersAround platform, perfect for demos, testing, and development.

## 📊 Data Summary

### 👥 Users: 250 International Members
- **47 different nationalities** (French, Spanish, German, Japanese, Korean, Brazilian, Indian, and more)
- **Mostly expats and Erasmus students** - reflects real demographic
- **178 verified users** (71% verification rate)
- Diverse professions: Students, Tech workers, Creative professionals, Researchers
- Realistic ages (20-35), bios, interests, and ratings

### 🏠 Properties: 500 Listings Across Italy
- **15 Italian cities** including Rome, Milan, Florence, Bologna, Venice, Turin, Naples
- **60+ unique neighborhoods** in Rome (Trastevere, Monti, Testaccio, etc.)
- **7 property types**: Apartments, Studios, Lofts, Shared Rooms, Private Rooms, Penthouses, Townhouses
- **Price range**: €290 - €4,310 per month
- **403 verified properties** (80% verification rate)
- Each property includes:
  - High-quality Unsplash images
  - Realistic amenities (5-10 per property)
  - Bedrooms, bathrooms, and square meters
  - Detailed descriptions
  - Location-appropriate pricing

### 📅 Events: 50 Community Gatherings
- **6 event types**: Language Exchange, Cultural, Social, Sports, Networking, Special Events
- **18 official events** organized by the platform
- Events scheduled over the next 90 days
- Realistic attendee counts and capacity limits
- Locations across Rome neighborhoods

## 📁 Files Included

### JSON Files (for application import)
- `fake_data_users.json` - 250 users with complete profiles
- `fake_data_properties.json` - 500 properties with all details
- `fake_data_events.json` - 50 upcoming events

### SQL File (for direct database import)
- `fake_data_inserts.sql` - Complete SQL INSERT statements for all data

## 🚀 How to Import Data

### Option 1: SQL Direct Import (Recommended)

If you're using PostgreSQL:

```bash
# Import all data at once
psql -U your_username -d roomersaround -f fake_data_inserts.sql

# Or connect to your database first
psql -U your_username -d roomersaround
\i fake_data_inserts.sql
```

### Option 2: JSON Import (For Application-Level Import)

Use the JSON files if you prefer to import through your application:

```javascript
// Node.js example
const users = require('./fake_data_users.json');
const properties = require('./fake_data_properties.json');
const events = require('./fake_data_events.json');

// Import users
for (const user of users) {
  await User.create(user);
}

// Import properties
for (const property of properties) {
  await Property.create(property);
}

// Import events
for (const event of events) {
  await Event.create(event);
}
```

Python example:
```python
import json

# Load data
with open('fake_data_users.json') as f:
    users = json.load(f)

with open('fake_data_properties.json') as f:
    properties = json.load(f)

with open('fake_data_events.json') as f:
    events = json.load(f)

# Import to database using your ORM
for user in users:
    User.objects.create(**user)

for prop in properties:
    Property.objects.create(**prop)

for event in events:
    Event.objects.create(**event)
```

### Option 3: Regenerate Custom Data

You can modify and regenerate the data:

```bash
# Edit the generator script to customize
nano generate_fake_data.py

# Regenerate with your changes
python3 generate_fake_data.py
```

## 📝 Database Schema Requirements

Ensure your database has these tables:

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    profession VARCHAR(255),
    age INTEGER,
    nationality VARCHAR(100),
    bio TEXT,
    interests TEXT[],
    rating NUMERIC(2,1),
    verified BOOLEAN DEFAULT FALSE,
    joined_date DATE
);
```

### Properties Table
```sql
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    price NUMERIC(10,2),
    duration VARCHAR(50),
    location VARCHAR(255),
    bedrooms INTEGER,
    bathrooms INTEGER,
    size INTEGER,
    type VARCHAR(50),
    description TEXT,
    amenities TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP,
    location VARCHAR(255),
    type VARCHAR(50),
    creator_id INTEGER REFERENCES users(id),
    is_official BOOLEAN DEFAULT FALSE,
    attendees INTEGER DEFAULT 0,
    max_attendees INTEGER,
    created_at TIMESTAMP
);
```

## 🎯 Sample Data Examples

### Sample User
```json
{
  "id": 1,
  "name": "Sophie Laurent",
  "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  "profession": "Fashion Designer",
  "age": 28,
  "nationality": "French",
  "bio": "Erasmus Design student exploring Italy",
  "interests": ["Fashion", "Art", "Travel", "Coffee"],
  "rating": 4.9,
  "verified": true,
  "joinedDate": "2024-03-15"
}
```

### Sample Property
```json
{
  "id": 1,
  "name": "Charming Trastevere Apartment",
  "image": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600",
  "price": 1350.00,
  "duration": "6-12 months",
  "location": "Trastevere, Rome",
  "bedrooms": 2,
  "bathrooms": 2,
  "size": 85,
  "type": "Apartment",
  "description": "Beautiful apartment in the heart of Trastevere. Perfect for students and young professionals.",
  "amenities": ["WiFi", "Air Conditioning", "Balcony", "Near Metro", "Furnished"],
  "verified": true,
  "owner_id": 15
}
```

### Sample Event
```json
{
  "id": 1,
  "title": "Italian-English Language Exchange",
  "description": "Practice Italian and meet international friends! All levels welcome.",
  "event_date": "2025-12-15 18:30:00",
  "location": "Trastevere, Rome",
  "type": "Language Exchange",
  "creator_id": 42,
  "is_official": true,
  "attendees": 12,
  "max_attendees": 20
}
```

## 🌍 Cities and Locations Covered

### Major Cities (with neighborhoods):
- **Rome** (20+ neighborhoods: Trastevere, Monti, Testaccio, Prati, San Lorenzo, etc.)
- **Milan** (10+ neighborhoods: Brera, Navigli, Porta Venezia, Isola, etc.)
- **Florence** (7+ neighborhoods: Santo Spirito, Santa Croce, Oltrarno, etc.)
- **Bologna** (6+ neighborhoods: Santo Stefano, Bolognina, Porto, etc.)
- **Turin** (5+ neighborhoods: San Salvario, Vanchiglia, Crocetta, etc.)
- **Venice** (4+ neighborhoods: Cannaregio, Dorsoduro, San Marco, etc.)
- **Naples** (4+ neighborhoods: Vomero, Chiaia, Centro Storico, etc.)
- **Plus**: Verona, Padua, Pisa, Genoa, Perugia, Siena, Palermo, Catania

## 🎨 Image Sources

All images are from Unsplash and are:
- ✅ Free to use
- ✅ High quality
- ✅ No attribution required
- ✅ Commercial use allowed

Images include authentic Italian apartments, European architecture, and diverse user avatars.

## 🔧 Customization

### Adjust Quantities
Edit `generate_fake_data.py` and modify:
```python
users = generate_users(250)        # Change to any number
properties = generate_properties(500, len(users))  # Change to any number
events = generate_events(50, len(users))  # Change to any number
```

### Add New Locations
Add to `ITALIAN_LOCATIONS` list:
```python
ITALIAN_LOCATIONS = [
    "Your New Location, City",
    # ... existing locations
]
```

### Add New Nationalities
Add to `NATIONALITIES` and `NAMES` dictionaries:
```python
NATIONALITIES = {
    "Your Region": ["Nationality1", "Nationality2"],
    # ... existing nationalities
}
```

## ⚠️ Important Notes

1. **ID Sequences**: After importing, reset your database sequences:
```sql
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('properties_id_seq', (SELECT MAX(id) FROM properties));
SELECT setval('events_id_seq', (SELECT MAX(id) FROM events));
```

2. **Timestamps**: All dates are generated relative to the current date, so events are always in the future.

3. **Relationships**: Properties are randomly assigned to users as owners. Events are created by random users.

4. **Data Realism**: While data is fake, it's designed to be realistic for demos and testing.

## 📊 Data Distribution

### User Nationalities (Most Common)
- French: ~10%
- Spanish: ~10%
- German: ~8%
- Japanese: ~6%
- Korean: ~6%
- American: ~8%
- Brazilian: ~5%
- Plus 40+ other nationalities

### Property Types
- Apartments: ~40%
- Studios: ~20%
- Lofts: ~15%
- Private Rooms: ~10%
- Shared Rooms: ~8%
- Penthouses: ~5%
- Townhouses: ~2%

### Event Types
- Language Exchange: ~20%
- Cultural: ~20%
- Social: ~20%
- Sports: ~15%
- Networking: ~15%
- Special Events: ~10%

## 🎯 Use Cases

This fake data is perfect for:
- 🎨 **Design Demos** - Showcase your UI with realistic data
- 🧪 **Testing** - Test search, filters, and features
- 🚀 **Development** - Build features with realistic scenarios
- 📊 **Analytics** - Test dashboards and reports
- 🎓 **Training** - Train staff or users with real-looking data
- 💼 **Sales Pitches** - Impressive demos for stakeholders

## 🆘 Troubleshooting

### Problem: Import fails with "duplicate key" error
**Solution**: Clear existing data first:
```sql
TRUNCATE TABLE events, properties, users CASCADE;
```

### Problem: Foreign key constraint errors
**Solution**: Import in order: users → properties → events

### Problem: Timestamp format errors
**Solution**: Ensure your database accepts 'YYYY-MM-DD HH:MM:SS' format

### Problem: Array type errors (PostgreSQL)
**Solution**: Arrays are formatted as `{item1,item2}` for PostgreSQL

## 📞 Support

For issues or questions:
1. Check the generator script comments
2. Review database schema compatibility
3. Ensure proper import order
4. Check for SQL syntax compatibility with your database

---

**Generated by**: RoomersAround Fake Data Generator
**Last Updated**: November 2025
**Total Records**: 800 (250 users + 500 properties + 50 events)

Happy testing! 🎉
