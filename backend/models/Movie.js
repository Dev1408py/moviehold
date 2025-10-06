const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: [String],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  rating: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    default: 'PG-13'
  },
  poster: {
    type: String, // URL to poster image
    default: ''
  },
  trailer: {
    type: String, // URL to trailer
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);
