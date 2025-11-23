/**
 * Event API Routes
 */

const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

/**
 * GET /api/events
 * Get all events with pagination and filters
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      is_official,
      upcoming = 'true',
      sortBy = 'event_date',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    const query = {};

    // Filter by event type
    if (type) {
      query.type = type;
    }

    // Filter by official status
    if (is_official !== undefined) {
      query.is_official = is_official === 'true';
    }

    // Filter upcoming events only
    if (upcoming === 'true') {
      query.event_date = { $gte: new Date() };
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const events = await Event.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort)
      .exec();

    const count = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/events/:id
 * Get single event by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Optional: Get creator details
    const User = require('../models/User');
    const creator = await User.findOne({ id: event.creator_id });

    res.json({
      ...event.toObject(),
      creator: creator || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/events/filters/types
 * Get list of all event types
 */
router.get('/filters/types', async (req, res) => {
  try {
    const types = await Event.distinct('type');
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/events/upcoming
 * Get upcoming events
 */
router.get('/featured/upcoming', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const events = await Event.find({ event_date: { $gte: new Date() } })
      .sort({ event_date: 1 })
      .limit(limit);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/events/popular
 * Get popular events (most attendees)
 */
router.get('/featured/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const events = await Event.find({ event_date: { $gte: new Date() } })
      .sort({ attendees: -1 })
      .limit(limit);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/events
 * Create a new event (for future use)
 */
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * PATCH /api/events/:id
 * Update an event (for future use)
 */
router.patch('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * POST /api/events/:id/attend
 * Register attendance for an event
 */
router.post('/:id/attend', async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event is full
    if (event.max_attendees && event.attendees >= event.max_attendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Increment attendees
    event.attendees += 1;
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/events/:id
 * Delete an event (for future use)
 */
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ id: req.params.id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
