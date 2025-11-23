/**
 * Database Seed Script for RoomersAround
 *
 * This script imports fake data from JSON files into your database
 * Run with: node seedDatabase.js
 */

const fs = require('fs');
const path = require('path');

// Import your database connection
// Adjust this based on your database (MongoDB, PostgreSQL, etc.)
// const db = require('./config/database');

/**
 * FOR MONGODB (with Mongoose)
 */
const mongoose = require('mongoose');

// Import your models
const User = require('./models/User');
const Property = require('./models/Property');
const Event = require('./models/Event');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/roomersaround';

/**
 * FOR POSTGRESQL (with Sequelize)
 * Uncomment this section if using PostgreSQL
 */
/*
const { Sequelize } = require('sequelize');
const User = require('./models/User');
const Property = require('./models/Property');
const Event = require('./models/Event');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'roomersaround',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false
  }
);
*/

// Load JSON data
const loadJSON = (filename) => {
  const filepath = path.join(__dirname, 'seed-data', filename);
  const data = fs.readFileSync(filepath, 'utf8');
  return JSON.parse(data);
};

/**
 * Seed function for MongoDB
 */
async function seedMongoDB() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    await Event.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Load data from JSON files
    console.log('📂 Loading data from JSON files...');
    const users = loadJSON('fake_data_users.json');
    const properties = loadJSON('fake_data_properties.json');
    const events = loadJSON('fake_data_events.json');
    console.log(`   Loaded ${users.length} users`);
    console.log(`   Loaded ${properties.length} properties`);
    console.log(`   Loaded ${events.length} events\n`);

    // Insert users
    console.log('👥 Inserting users...');
    const insertedUsers = await User.insertMany(users);
    console.log(`✅ Inserted ${insertedUsers.length} users\n`);

    // Insert properties
    console.log('🏠 Inserting properties...');
    const insertedProperties = await Property.insertMany(properties);
    console.log(`✅ Inserted ${insertedProperties.length} properties\n`);

    // Insert events
    console.log('📅 Inserting events...');
    const insertedEvents = await Event.insertMany(events);
    console.log(`✅ Inserted ${insertedEvents.length} events\n`);

    // Summary
    console.log('=' .repeat(60));
    console.log('✨ DATABASE SEEDED SUCCESSFULLY!');
    console.log('=' .repeat(60));
    console.log(`Total Records: ${insertedUsers.length + insertedProperties.length + insertedEvents.length}`);
    console.log(`   Users: ${insertedUsers.length}`);
    console.log(`   Properties: ${insertedProperties.length}`);
    console.log(`   Events: ${insertedEvents.length}`);
    console.log('=' .repeat(60));

    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

/**
 * Seed function for PostgreSQL (Sequelize)
 */
async function seedPostgreSQL() {
  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL\n');

    // Sync models (create tables if they don't exist)
    console.log('📊 Syncing database models...');
    await sequelize.sync({ force: true }); // WARNING: This drops existing tables!
    console.log('✅ Models synced\n');

    // Load data from JSON files
    console.log('📂 Loading data from JSON files...');
    const users = loadJSON('fake_data_users.json');
    const properties = loadJSON('fake_data_properties.json');
    const events = loadJSON('fake_data_events.json');
    console.log(`   Loaded ${users.length} users`);
    console.log(`   Loaded ${properties.length} properties`);
    console.log(`   Loaded ${events.length} events\n`);

    // Insert users
    console.log('👥 Inserting users...');
    const insertedUsers = await User.bulkCreate(users);
    console.log(`✅ Inserted ${insertedUsers.length} users\n`);

    // Insert properties
    console.log('🏠 Inserting properties...');
    const insertedProperties = await Property.bulkCreate(properties);
    console.log(`✅ Inserted ${insertedProperties.length} properties\n`);

    // Insert events
    console.log('📅 Inserting events...');
    const insertedEvents = await Event.bulkCreate(events);
    console.log(`✅ Inserted ${insertedEvents.length} events\n`);

    // Summary
    console.log('=' .repeat(60));
    console.log('✨ DATABASE SEEDED SUCCESSFULLY!');
    console.log('=' .repeat(60));
    console.log(`Total Records: ${insertedUsers.length + insertedProperties.length + insertedEvents.length}`);
    console.log(`   Users: ${insertedUsers.length}`);
    console.log(`   Properties: ${insertedProperties.length}`);
    console.log(`   Events: ${insertedEvents.length}`);
    console.log('=' .repeat(60));

    await sequelize.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding based on your database type
// Change this to match your database
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'mongodb'; // 'mongodb' or 'postgresql'

if (DATABASE_TYPE === 'mongodb') {
  seedMongoDB();
} else if (DATABASE_TYPE === 'postgresql') {
  seedPostgreSQL();
} else {
  console.error('❌ Invalid DATABASE_TYPE. Use "mongodb" or "postgresql"');
  process.exit(1);
}
