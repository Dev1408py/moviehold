import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('title');

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const filterAndSortMovies = useCallback(() => {
    let filtered = movies;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by genre
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(movie =>
        movie.genre.includes(selectedGenre)
      );
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating.localeCompare(a.rating);
        case 'duration':
          return a.duration - b.duration;
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
  }, [movies, searchTerm, selectedGenre, sortBy]);

  useEffect(() => {
    filterAndSortMovies();
  }, [filterAndSortMovies]);

  const formatTime = (timeString) => {
    return timeString;
  };

  const getAllGenres = () => {
    const genres = new Set();
    movies.forEach(movie => {
      movie.genre.forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  };

  if (loading) {
    return (
      <div className="text-center mt-5 pt-5">
        <div className="loading-spinner"></div>
        <p className="mt-3">Loading amazing movies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="movies-page pt-5">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section text-center mb-5">
          <h1 className="display-4 mb-3">🎬 Discover Amazing Movies</h1>
          <p className="lead">Book your favorite movies and enjoy the cinematic experience</p>
        </div>

        {/* Search and Filters */}
        <div className="filters-section mb-4">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control search-bar"
                placeholder="🔍 Search movies, genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="All">All Genres</option>
                {getAllGenres().map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="title">Sort by Title</option>
                <option value="rating">Sort by Rating</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
            <div className="col-md-2">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('All');
                  setSortBy('title');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length === 0 ? (
          <div className="text-center mt-5">
            <h3>No movies found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredMovies.map((movie) => (
              <div key={movie._id} className="col-xl-3 col-lg-4 col-md-6">
                <div className="movie-card card h-100">
                  <div className="position-relative">
                    <img
                      src={movie.poster || 'https://picsum.photos/400/600?random=' + movie._id}
                      className="card-img-top"
                      alt={movie.title}
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/400/600?random=' + movie._id;
                      }}
                    />
                    <div className="card-overlay">
                      <div className="movie-info">
                        <span className="badge bg-primary me-2">{movie.rating}</span>
                        <span className="badge bg-secondary">{movie.duration}min</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{movie.title}</h5>
                    <p className="card-text text-muted">
                      {movie.genre.join(', ')}
                    </p>
                    <p className="card-text movie-description">
                      {movie.description.substring(0, 100)}...
                    </p>

                    {movie.showtimes && movie.showtimes.length > 0 ? (
                      <div className="mt-3">
                        <h6 className="text-primary">Available Showtimes:</h6>
                        <div className="showtimes-grid">
                          {movie.showtimes.slice(0, 3).map((showtime) => (
                            <div key={showtime._id} className="showtime-item">
                              <Link
                                to={`/booking/${showtime._id}`}
                                className="btn btn-primary btn-sm me-2 mb-2"
                              >
                                {formatTime(showtime.time)}
                              </Link>
                              <small className="text-muted d-block">
                                ${showtime.price} • {showtime.availableSeats} seats
                              </small>
                            </div>
                          ))}
                        </div>
                        {movie.showtimes.length > 3 && (
                          <Link to={`/movies/${movie._id}`} className="btn btn-link btn-sm mt-2">
                            View all showtimes →
                          </Link>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted">No showtimes available</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Movies;
