/**
 * User Model
 * Supports both MongoDB (Mongoose) and PostgreSQL (Sequelize)
 */

/**
 * MONGODB VERSION (Mongoose)
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  profession: {
    type: String
  },
  age: {
    type: Number
  },
  nationality: {
    type: String
  },
  bio: {
    type: String
  },
  interests: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  verified: {
    type: Boolean,
    default: false
  },
  joinedDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ nationality: 1 });
userSchema.index({ verified: 1 });
userSchema.index({ rating: -1 });

const User = mongoose.model('User', userSchema);

module.exports = User;

/**
 * POSTGRESQL VERSION (Sequelize)
 * Uncomment this section if using PostgreSQL
 */
/*
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false // Using provided IDs from fake data
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    type: DataTypes.TEXT
  },
  profession: {
    type: DataTypes.STRING
  },
  age: {
    type: DataTypes.INTEGER
  },
  nationality: {
    type: DataTypes.STRING(100)
  },
  bio: {
    type: DataTypes.TEXT
  },
  interests: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    validate: {
      min: 0,
      max: 5
    }
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  joinedDate: {
    type: DataTypes.DATEONLY
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
*/
