# RoomersAround Rome

**Property Rental Platform with Community Focus**

Connecting Property Seekers & Owners in the Eternal City

---

## 📋 Project Overview

RoomersAround Rome is a comprehensive property rental platform designed to create a trusted community ecosystem connecting property seekers with verified owners in Rome, Italy.

## 🎯 Key Features

- **Advanced Search & Filters** - Location, price, amenities, availability
- **Virtual Property Tours** - 360° views and video walkthroughs
- **Secure Messaging** - In-app communication between parties
- **Payment Integration** - Secure online rent payments
- **Community Forum** - Connect with fellow renters
- **Verified Listings** - Authentication checks for all properties
- **Smart Matching** - AI-powered recommendations

## 💻 Technology Stack

### Frontend
- React Native
- Redux for state management
- Tailwind CSS for styling

### Backend
- Node.js with Express.js
- RESTful API architecture
- JWT authentication

### Database
- MongoDB for data storage
- Redis for caching
- AWS S3 for media files

### Mobile
- iOS & Android native support
- Push notifications
- Geolocation services

### Infrastructure
- AWS Cloud hosting
- CI/CD with GitHub Actions
- Docker containerization

## 📱 Mobile App Mockups

This repository includes professional mobile app UI mockups showcasing:
- Home/Search Screen
- Property Listings
- Property Details
- User Profile
- Booking Flow

All mockups are available in the `images/` directory.

## 📊 Presentation

A comprehensive PowerPoint presentation is included: `RoomersAround_Rome_Presentation.pptx`

The presentation covers:
1. Problem Statement
2. Our Solution
3. Key Features
4. Technology Stack
5. Mobile App Mockups
6. Future Roadmap
7. Market Opportunity

## 🗓️ Roadmap

### Phase 1: Q1 2025
- Launch MVP for Rome
- Basic search and listing features
- User authentication and profiles
- Property verification system

### Phase 2: Q2 2025
- AI-powered recommendations
- Virtual property tours
- Integrated payment system
- Mobile app optimization

### Phase 3: Q3 2025
- Community forum and events
- Multi-language support (Italian, English, Spanish)
- Advanced analytics dashboard
- Expand to other Italian cities

### Phase 4: Q4 2025
- AR property viewing
- Blockchain-based contracts
- Partner integrations (utilities, moving services)
- European expansion

## 👥 Team

**Presented by:** Dolly Mathur

**Year:** 2025

---

## 🗄️ Demo Data

This repository includes comprehensive fake data for demos, testing, and development:

### 📊 Data Overview
- **250+ International Users** - Diverse expats, Erasmus students from 47+ nationalities
- **500+ Properties** - Across 15 Italian cities (Rome, Milan, Florence, Bologna, Venice, etc.)
- **50+ Events** - Language exchanges, cultural activities, networking events

### 📁 Fake Data Files
- `fake_data_users.json` - 250 diverse international user profiles
- `fake_data_properties.json` - 500 rental properties across Italy
- `fake_data_events.json` - 50 community events
- `fake_data_inserts.sql` - Ready-to-import SQL statements
- `generate_fake_data.py` - Python script to regenerate/customize data
- `FAKE_DATA_README.md` - Complete guide for importing and using fake data

### 🚀 Quick Import
```bash
# Import all fake data to your database
psql -U your_username -d roomersaround -f fake_data_inserts.sql

# Or regenerate with custom settings
python3 generate_fake_data.py
```

See [FAKE_DATA_README.md](FAKE_DATA_README.md) for detailed import instructions and examples.

## 📄 Files Included

### Presentation Materials
- `RoomersAround_Rome_Presentation.pptx` - Professional PowerPoint presentation
- `create_presentation.py` - Python script to generate presentation and mockups
- `images/` - Directory containing mobile app mockups
  - `mockup_home.png` - Home screen mockup
  - `mockup_listings.png` - Property listings mockup
  - `mockup_details.png` - Property details mockup
  - `mockup_profile.png` - User profile mockup
  - `mockup_booking.png` - Booking flow mockup

### Demo Data
- `fake_data_users.json` - 250 international users
- `fake_data_properties.json` - 500 properties across Italy
- `fake_data_events.json` - 50 community events
- `fake_data_inserts.sql` - SQL import file
- `generate_fake_data.py` - Data generator script
- `FAKE_DATA_README.md` - Import guide

---

*Building the future of property rental in Rome, one community at a time.*
