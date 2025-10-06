import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/movies/${id}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to load movie details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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

  if (!movie) {
    return (
      <div className="alert alert-warning" role="alert">
        Movie not found.
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-8">
          <h2>{movie.title}</h2>
          <div className="mb-3">
            <span className="badge bg-primary me-2">{movie.rating}</span>
            <span className="text-muted">
              {movie.genre.join(', ')} • {movie.duration} minutes
            </span>
          </div>

          <p className="lead">{movie.description}</p>

          <Link to="/movies" className="btn btn-secondary">
            ← Back to Movies
          </Link>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <h3>Showtimes</h3>

          {movie.showtimes && movie.showtimes.length > 0 ? (
            <div className="row">
              {movie.showtimes.map((showtime) => (
                <div key={showtime._id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">
                        {showtime.theater}
                      </h6>
                      <p className="card-text">
                        <strong>{formatDate(showtime.date)}</strong>
                        <br />
                        <strong>Time:</strong> {formatTime(showtime.time)}
                        <br />
                        <strong>Price:</strong> ${showtime.price}
                        <br />
                        <strong>Available Seats:</strong> {showtime.availableSeats}
                      </p>
                      <Link
                        to={`/booking/${showtime._id}`}
                        className="btn btn-primary"
                        disabled={showtime.availableSeats === 0}
                      >
                        {showtime.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No showtimes available for this movie.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
