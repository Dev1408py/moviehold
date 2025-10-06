const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
const Booking = require('./models/Booking');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-booking', {
  // Removed deprecated options - useNewUrlParser and useUnifiedTopology are no longer needed
});

const sampleMovies = [
  {
    title: "Dune: Part Two",
    description: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    duration: 166,
    rating: "PG-13",
    poster: "https://picsum.photos/400/600?random=1"
  },
  {
    title: "Oppenheimer",
    description: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    genre: ["Biography", "Drama", "History"],
    duration: 180,
    rating: "R",
    poster: "https://picsum.photos/400/600?random=2"
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    description: "After reuniting with Gwen Stacy, Miles Morales finds himself catapulted across the Multiverse, where he encounters a team of Spider-People.",
    genre: ["Animation", "Action", "Adventure"],
    duration: 140,
    rating: "PG",
    poster: "https://picsum.photos/400/600?random=3"
  },
  {
    title: "The Batman",
    description: "When a killer targets Gotham's elite with a series of sadistic machinations, a trail of cryptic clues sends the World's Greatest Detective on an investigation into the underworld.",
    genre: ["Action", "Crime", "Drama"],
    duration: 176,
    rating: "PG-13",
    poster: "https://picsum.photos/400/600?random=4"
  },
  {
    title: "Top Gun: Maverick",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a dangerous mission.",
    genre: ["Action", "Drama"],
    duration: 130,
    rating: "PG-13",
    poster: "https://picsum.photos/400/600?random=5"
  },
  {
    title: "Avatar: The Way of Water",
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    genre: ["Action", "Adventure", "Fantasy"],
    duration: 192,
    rating: "PG-13",
    poster: "https://picsum.photos/400/600?random=6"
  },
  {
    title: "Guardians of the Galaxy Vol. 3",
    description: "Still reeling from the loss of Gamora, Peter Quill rallies his team to defend the universe and one of their own - a mission that could mean the end of the Guardians if not successful.",
    genre: ["Action", "Adventure", "Comedy"],
    duration: 150,
    rating: "PG-13",
    poster: "https://picsum.photos/400/600?random=7"
  },
  {
    title: "Barbie",
    description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.",
    genre: ["Comedy", "Adventure", "Fantasy"],
    duration: 114,
    rating: "PG-13",
    poster: "https://picsum.photos/400/600?random=8"
  }
];

const sampleShowtimes = [
  { movieIndex: 0, theater: "Cinema Downtown", date: new Date(), time: "14:00", price: 12.50 },
  { movieIndex: 0, theater: "Cinema Downtown", date: new Date(), time: "17:00", price: 15.00 },
  { movieIndex: 0, theater: "IMAX Theater", date: new Date(), time: "20:00", price: 18.00 },
  { movieIndex: 1, theater: "Cinema Mall", date: new Date(), time: "15:30", price: 14.00 },
  { movieIndex: 1, theater: "Cinema Mall", date: new Date(), time: "19:00", price: 16.50 },
  { movieIndex: 2, theater: "IMAX Theater", date: new Date(), time: "16:00", price: 20.00 },
  { movieIndex: 2, theater: "Cinema Downtown", date: new Date(), time: "18:30", price: 13.00 },
  { movieIndex: 3, theater: "Cinema Mall", date: new Date(), time: "21:00", price: 17.00 },
  { movieIndex: 3, theater: "IMAX Theater", date: new Date(), time: "13:00", price: 22.00 },
  { movieIndex: 4, theater: "Cinema Downtown", date: new Date(), time: "15:00", price: 14.50 },
  { movieIndex: 4, theater: "Cinema Mall", date: new Date(), time: "19:30", price: 16.00 },
  { movieIndex: 5, theater: "IMAX Theater", date: new Date(), time: "20:30", price: 22.00 },
  { movieIndex: 5, theater: "Cinema Downtown", date: new Date(), time: "17:30", price: 18.00 },
  { movieIndex: 6, theater: "Cinema Mall", date: new Date(), time: "14:30", price: 15.00 },
  { movieIndex: 6, theater: "IMAX Theater", date: new Date(), time: "18:00", price: 19.00 },
  { movieIndex: 7, theater: "Cinema Downtown", date: new Date(), time: "16:00", price: 13.50 },
  { movieIndex: 7, theater: "Cinema Mall", date: new Date(), time: "20:00", price: 15.50 }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Movie.deleteMany({});
    await Showtime.deleteMany({});
    await Booking.deleteMany({});
    console.log('Cleared existing data');

    // Insert movies
    const movies = await Movie.insertMany(sampleMovies);
    console.log('Inserted movies');

    // Insert showtimes
    const showtimesToInsert = sampleShowtimes.map(showtime => ({
      movie: movies[showtime.movieIndex]._id,
      theater: showtime.theater,
      date: showtime.date,
      time: showtime.time,
      price: showtime.price,
      totalSeats: 50, // Add total seats
      bookedSeats: [] // Initialize empty booked seats array
    }));

    const showtimes = await Showtime.insertMany(showtimesToInsert);
    console.log('Inserted showtimes');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
