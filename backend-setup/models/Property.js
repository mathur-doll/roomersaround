/**
 * Property Model
 * Supports both MongoDB (Mongoose) and PostgreSQL (Sequelize)
 */

/**
 * MONGODB VERSION (Mongoose)
 */
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  bedrooms: {
    type: Number,
    default: 0
  },
  bathrooms: {
    type: Number,
    default: 0
  },
  size: {
    type: Number // in square meters
  },
  type: {
    type: String,
    enum: ['Apartment', 'Studio', 'Loft', 'Shared Room', 'Private Room', 'Penthouse', 'Townhouse']
  },
  description: {
    type: String
  },
  amenities: [{
    type: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  owner_id: {
    type: Number,
    ref: 'User'
  },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better search performance
propertySchema.index({ location: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ verified: 1 });
propertySchema.index({ bedrooms: 1 });

// Text index for search functionality
propertySchema.index({ name: 'text', description: 'text', location: 'text' });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;

/**
 * POSTGRESQL VERSION (Sequelize)
 * Uncomment this section if using PostgreSQL
 */
/*
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING(50)
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  size: {
    type: DataTypes.INTEGER
  },
  type: {
    type: DataTypes.STRING(50),
    validate: {
      isIn: [['Apartment', 'Studio', 'Loft', 'Shared Room', 'Private Room', 'Penthouse', 'Townhouse']]
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  owner_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'properties',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Property;
*/
