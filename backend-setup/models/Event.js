/**
 * Event Model
 * Supports both MongoDB (Mongoose) and PostgreSQL (Sequelize)
 */

/**
 * MONGODB VERSION (Mongoose)
 */
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  event_date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Language Exchange', 'Cultural', 'Social', 'Sports', 'Networking', 'Special']
  },
  creator_id: {
    type: Number,
    ref: 'User'
  },
  is_official: {
    type: Boolean,
    default: false
  },
  attendees: {
    type: Number,
    default: 0
  },
  max_attendees: {
    type: Number
  },
  created_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
eventSchema.index({ event_date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ is_official: 1 });
eventSchema.index({ location: 1 });

// Text index for search
eventSchema.index({ title: 'text', description: 'text' });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

/**
 * POSTGRESQL VERSION (Sequelize)
 * Uncomment this section if using PostgreSQL
 */
/*
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    validate: {
      isIn: [['Language Exchange', 'Cultural', 'Social', 'Sports', 'Networking', 'Special']]
    }
  },
  creator_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  is_official: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  attendees: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  max_attendees: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'events',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Event;
*/
