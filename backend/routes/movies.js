const express = require('express');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');

const router = express.Router();

// Get all movies with their showtimes
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    // For each movie, get its showtimes
    const moviesWithShowtimes = await Promise.all(
      movies.map(async (movie) => {
        const showtimes = await Showtime.find({ movie: movie._id })
          .sort({ date: 1, time: 1 })
          .select('theater date time price totalSeats bookedSeats');

        return {
          ...movie.toObject(),
          showtimes: showtimes.map(showtime => ({
            ...showtime.toObject(),
            availableSeats: showtime.availableSeats
          }))
        };
      })
    );

    res.json(moviesWithShowtimes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get movie by ID with showtimes
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const showtimes = await Showtime.find({ movie: movie._id })
      .sort({ date: 1, time: 1 })
      .select('theater date time price totalSeats bookedSeats');

    const movieWithShowtimes = {
      ...movie.toObject(),
      showtimes: showtimes.map(showtime => ({
        ...showtime.toObject(),
        availableSeats: showtime.availableSeats
      }))
    };

    res.json(movieWithShowtimes);
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get showtime details
router.get('/:movieId/showtimes/:showtimeId', async (req, res) => {
  try {
    const { movieId, showtimeId } = req.params;

    const showtime = await Showtime.findById(showtimeId)
      .populate('movie', 'title description genre duration rating poster');

    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    // Generate seat layout (assuming a standard theater layout)
    const seatLayout = generateSeatLayout(showtime.totalSeats, showtime.bookedSeats);

    res.json({
      ...showtime.toObject(),
      availableSeats: showtime.availableSeats,
      seatLayout
    });
  } catch (error) {
    console.error(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate seat layout
function generateSeatLayout(totalSeats, bookedSeats) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 10;
  const layout = [];

  let seatCount = 0;
  for (const row of rows) {
    if (seatCount >= totalSeats) break;

    const rowSeats = [];
    for (let i = 1; i <= seatsPerRow; i++) {
      if (seatCount >= totalSeats) break;

      const seatId = `${row}${i}`;
      rowSeats.push({
        id: seatId,
        status: bookedSeats.includes(seatId) ? 'booked' : 'available',
        type: 'standard'
      });
      seatCount++;
    }

    if (rowSeats.length > 0) {
      layout.push({
        row,
        seats: rowSeats
      });
    }
  }

  return layout;
}

module.exports = router;
