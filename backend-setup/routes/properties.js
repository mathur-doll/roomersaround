/**
 * Property API Routes
 */

const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

/**
 * GET /api/properties
 * Get all properties with pagination, search, and filters
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      city,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      verified,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Search in name, description, location
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') }
      ];
    }

    // Filter by city (extract from location)
    if (city) {
      query.location = new RegExp(city, 'i');
    }

    // Filter by property type
    if (type) {
      query.type = type;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Filter by bedrooms
    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms);
    }

    // Filter by verified status
    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const properties = await Property.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort)
      .exec();

    const count = await Property.countDocuments(query);

    res.json({
      properties,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/properties/:id
 * Get single property by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findOne({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Optional: Get owner details
    const User = require('../models/User');
    const owner = await User.findOne({ id: property.owner_id });

    res.json({
      ...property.toObject(),
      owner: owner || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/properties/filters/cities
 * Get list of all cities
 */
router.get('/filters/cities', async (req, res) => {
  try {
    const locations = await Property.distinct('location');
    // Extract unique cities from locations
    const cities = [...new Set(locations.map(loc => {
      const parts = loc.split(',');
      return parts.length > 1 ? parts[1].trim() : loc;
    }))];
    res.json(cities.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/properties/filters/types
 * Get list of all property types
 */
router.get('/filters/types', async (req, res) => {
  try {
    const types = await Property.distinct('type');
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/properties/filters/amenities
 * Get list of all amenities
 */
router.get('/filters/amenities', async (req, res) => {
  try {
    const properties = await Property.find({}, 'amenities');
    const amenitiesSet = new Set();
    properties.forEach(prop => {
      prop.amenities.forEach(amenity => amenitiesSet.add(amenity));
    });
    res.json([...amenitiesSet].sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/properties/filters/price-range
 * Get min and max prices
 */
router.get('/filters/price-range', async (req, res) => {
  try {
    const minPrice = await Property.findOne().sort({ price: 1 }).select('price');
    const maxPrice = await Property.findOne().sort({ price: -1 }).select('price');
    res.json({
      min: minPrice?.price || 0,
      max: maxPrice?.price || 5000
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/properties
 * Create a new property (for future use)
 */
router.post('/', async (req, res) => {
  try {
    const property = new Property(req.body);
    const newProperty = await property.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * PATCH /api/properties/:id
 * Update a property (for future use)
 */
router.patch('/:id', async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * DELETE /api/properties/:id
 * Delete a property (for future use)
 */
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ id: req.params.id });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
