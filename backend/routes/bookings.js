const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Book tickets
router.post('/', auth, [
  body('showtimeId').isMongoId().withMessage('Invalid showtime ID'),
  body('seats').isArray({ min: 1 }).withMessage('At least one seat must be selected')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { showtimeId, seats } = req.body;
    const userId = req.user.id;

    // Validate seat format
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'At least one seat must be selected' });
    }

    const invalidSeats = seats.filter(seat => !/^[A-J]\d+$/.test(seat));
    if (invalidSeats.length > 0) {
      return res.status(400).json({ message: `Invalid seat format: ${invalidSeats.join(', ')}` });
    }

    // Check if showtime exists
    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Ensure bookedSeats is initialized
    if (!showtime.bookedSeats) {
      showtime.bookedSeats = [];
    }

    // Check if requested seats are available
    const unavailableSeats = seats.filter(seat => showtime.bookedSeats.includes(seat));
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `The following seats are not available: ${unavailableSeats.join(', ')}`
      });
    }

    // Check if user already has a booking for this showtime
    const existingBooking = await Booking.findOne({
      user: userId,
      showtime: showtimeId,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({
        message: 'You already have a booking for this showtime'
      });
    }

    // Calculate total amount
    const totalAmount = seats.length * showtime.price;

    // Generate booking reference
    const bookingReference = 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create booking
    const booking = new Booking({
      user: userId,
      showtime: showtimeId,
      seats,
      totalAmount,
      bookingReference
    });

    // Update showtime with booked seats
    showtime.bookedSeats.push(...seats);
    await showtime.save();

    await booking.save();

    // Populate booking details with nested movie population
    await booking.populate({
      path: 'showtime',
      select: 'movie theater date time price',
      populate: {
        path: 'movie',
        select: 'title'
      }
    });
    await booking.populate('user', 'name email');

    res.status(201).json({
      message: 'Booking successful',
      booking: {
        id: booking._id,
        bookingReference: booking.bookingReference,
        seats: booking.seats,
        totalAmount: booking.totalAmount,
        showtime: booking.showtime,
        status: booking.status,
        createdAt: booking.createdAt
      }
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ user: userId, status: 'confirmed' })
      .populate({
        path: 'showtime',
        select: 'movie theater date time price',
        populate: {
          path: 'movie',
          select: 'title'
        }
      })
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      bookingReference: booking.bookingReference,
      seats: booking.seats,
      totalAmount: booking.totalAmount,
      status: booking.status,
      showtime: {
        id: booking.showtime._id,
        movie: booking.showtime.movie,
        theater: booking.showtime.theater,
        date: booking.showtime.date,
        time: booking.showtime.time,
        price: booking.showtime.price
      },
      createdAt: booking.createdAt
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'showtime',
        select: 'movie theater date time price',
        populate: {
          path: 'movie',
          select: 'title'
        }
      })
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      id: booking._id,
      bookingReference: booking.bookingReference,
      seats: booking.seats,
      totalAmount: booking.totalAmount,
      status: booking.status,
      showtime: {
        id: booking.showtime._id,
        movie: booking.showtime.movie,
        theater: booking.showtime.theater,
        date: booking.showtime.date,
        time: booking.showtime.time,
        price: booking.showtime.price
      },
      user: booking.user,
      createdAt: booking.createdAt
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update showtime to remove booked seats
    const showtime = await Showtime.findById(booking.showtime);
    if (showtime) {
      // Ensure bookedSeats is initialized
      if (!showtime.bookedSeats) {
        showtime.bookedSeats = [];
      }
      showtime.bookedSeats = showtime.bookedSeats.filter(
        seat => !booking.seats.includes(seat)
      );
      await showtime.save();
    }

    // Mark booking as cancelled
    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
