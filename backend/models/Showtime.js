const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String, // e.g., "14:30", "19:00"
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 100
  },
  bookedSeats: {
    type: [String], // Array of seat identifiers like "A1", "B5", etc.
    default: []
  }
}, {
  timestamps: true
});

// Virtual for available seats
showtimeSchema.virtual('availableSeats').get(function() {
  const bookedCount = this.bookedSeats ? this.bookedSeats.length : 0;
  return this.totalSeats - bookedCount;
});

// Ensure virtual fields are serialized
showtimeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Showtime', showtimeSchema);
