# RoomersAround Backend Setup

Complete backend setup files for RoomersAround property rental platform.

## 📦 What's Included

### Core Files
- **`server.js`** - Express server with API routes
- **`seedDatabase.js`** - Script to import fake data into database
- **`package.json`** - Dependencies and scripts
- **`.env.example`** - Environment variables template

### Database Models (`models/`)
- **`User.js`** - User model (250 international users)
- **`Property.js`** - Property model (500 properties across Italy)
- **`Event.js`** - Event model (50 community events)

### API Routes (`routes/`)
- **`users.js`** - User endpoints with filters and search
- **`properties.js`** - Property endpoints with advanced search
- **`events.js`** - Event endpoints with filters

### Documentation
- **`QUICK_START.md`** - Get started in 5 minutes
- **`SETUP_GUIDE.md`** - Complete setup documentation

### Data (`seed-data/`)
- `fake_data_users.json` - 250 users
- `fake_data_properties.json` - 500 properties
- `fake_data_events.json` - 50 events
- `fake_data_inserts.sql` - SQL version (optional)

## 🚀 Quick Start

```bash
# 1. Copy files to your backend directory
cp -r backend-setup/* your-backend-folder/

# 2. Install dependencies
cd your-backend-folder
npm install

# 3. Setup environment
cp .env.example .env

# 4. Import data
npm run seed

# 5. Start server
npm start
```

Visit http://localhost:5000 to see your API!

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete documentation with:
  - Prerequisites
  - Database setup (MongoDB & PostgreSQL)
  - API endpoint documentation
  - Frontend integration examples
  - Troubleshooting

## 🎯 Key Features

### API Endpoints

#### Users (`/api/users`)
- Get all users with filters (nationality, profession, verified, rating)
- Get single user
- Get user's properties
- Get filter options (nationalities, professions)

#### Properties (`/api/properties`)
- Get all properties with search and filters
- Search by location, price range, bedrooms, type
- Sort by price, date, etc.
- Get single property with owner details
- Get filter options (cities, types, amenities, price range)

#### Events (`/api/events`)
- Get all events with filters
- Filter by type, official status, upcoming
- Get featured events (upcoming, popular)
- Get single event with creator details
- Get filter options (event types)

### Example Queries

```javascript
// Get verified 2-bedroom apartments in Rome under €1500
GET /api/properties?city=Rome&bedrooms=2&maxPrice=1500&verified=true

// Get French users who are verified
GET /api/users?nationality=French&verified=true

// Get upcoming Language Exchange events
GET /api/events?type=Language Exchange&upcoming=true
```

## 💾 Database

Supports both:
- **MongoDB** (default) - with Mongoose
- **PostgreSQL** - with Sequelize

### Data Summary
- **250 Users** - 47 nationalities, diverse professions
- **500 Properties** - 15 cities across Italy, 7 property types
- **50 Events** - 6 event types, upcoming dates

## 🔧 Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin support
- **dotenv** - Environment configuration

## 📱 Frontend Integration

Easy integration with React, React Native, or any frontend:

```javascript
// Example: Fetch properties
const response = await fetch('http://localhost:5000/api/properties?city=Rome');
const data = await response.json();
console.log(data.properties);
```

See **SETUP_GUIDE.md** for complete React/React Native examples.

## 🛠️ Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with auto-reload
npm run seed    # Import fake data to database
```

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (v5+) or PostgreSQL (v13+)
- npm or yarn

## 🔗 Project Structure

```
backend-setup/
├── server.js              # Main server file
├── seedDatabase.js        # Data import script
├── package.json           # Dependencies
├── .env.example           # Environment template
├── models/                # Database models
│   ├── User.js
│   ├── Property.js
│   └── Event.js
├── routes/                # API routes
│   ├── users.js
│   ├── properties.js
│   └── events.js
├── seed-data/             # Fake data
│   ├── fake_data_users.json
│   ├── fake_data_properties.json
│   ├── fake_data_events.json
│   └── fake_data_inserts.sql
├── QUICK_START.md         # 5-minute guide
├── SETUP_GUIDE.md         # Complete documentation
└── README.md              # This file
```

## 🎓 Learning Resources

Each file contains detailed comments explaining:
- Database schema design
- API endpoint patterns
- Query optimization
- Error handling
- RESTful best practices

## 🤝 Contributing

This is a complete, production-ready backend setup. Feel free to:
- Customize models for your needs
- Add authentication (JWT)
- Add more endpoints
- Deploy to production

## 📄 License

MIT License - Use freely for your projects!

---

## Next Steps

1. ✅ Read **QUICK_START.md** for rapid setup
2. ✅ Read **SETUP_GUIDE.md** for complete documentation
3. ✅ Test API endpoints with Postman or your browser
4. ✅ Connect your frontend application
5. ✅ Customize and extend as needed

**Ready to build something amazing! 🚀**

---

*Part of RoomersAround Rome - Property Rental Platform*
*Created by: Dolly Mathur | 2025*
