/**
 * User API Routes
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * GET /api/users
 * Get all users with pagination and filters
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      nationality,
      profession,
      verified,
      minRating
    } = req.query;

    // Build query
    const query = {};
    if (nationality) query.nationality = nationality;
    if (profession) query.profession = new RegExp(profession, 'i');
    if (verified !== undefined) query.verified = verified === 'true';
    if (minRating) query.rating = { $gte: parseFloat(minRating) };

    // Execute query with pagination
    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1 })
      .exec();

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/users/:id
 * Get single user by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/users/:id/properties
 * Get all properties owned by a user
 */
router.get('/:id/properties', async (req, res) => {
  try {
    const Property = require('../models/Property');
    const properties = await Property.find({ owner_id: req.params.id });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/users/nationalities
 * Get list of all nationalities
 */
router.get('/filters/nationalities', async (req, res) => {
  try {
    const nationalities = await User.distinct('nationality');
    res.json(nationalities.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/users/professions
 * Get list of all professions
 */
router.get('/filters/professions', async (req, res) => {
  try {
    const professions = await User.distinct('profession');
    res.json(professions.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/users
 * Create a new user (for future use)
 */
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * PATCH /api/users/:id
 * Update a user (for future use)
 */
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * DELETE /api/users/:id
 * Delete a user (for future use)
 */
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
