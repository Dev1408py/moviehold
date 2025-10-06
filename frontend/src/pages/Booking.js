import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const { showtimeId } = useParams();
  const [showtime, setShowtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }
    fetchShowtimeDetails();
  }, [showtimeId, user, authLoading, navigate]);

  const fetchShowtimeDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/movies/${showtimeId}/showtimes/${showtimeId}`);
      setShowtime(response.data);
    } catch (error) {
      console.error('Error fetching showtime details:', error);
      setError('Failed to load showtime details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    try {
      setBooking(true);
      setError('');
      setSuccess('');

      const response = await axios.post('/bookings', {
        showtimeId,
        seats: selectedSeats
      });

      setSuccess(`Booking successful! Your booking reference is: ${response.data.booking.bookingReference}`);
      setSelectedSeats([]);

      // Refresh showtime data to update available seats
      fetchShowtimeDetails();
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setBooking(false);
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

  if (authLoading || loading) {
    return (
      <div className="text-center mt-5 pt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !showtime) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="alert alert-warning" role="alert">
        Showtime not found.
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-8">
          <h2>Select Seats</h2>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{showtime.movie?.title}</h5>
              <p className="card-text">
                <strong>{showtime.theater}</strong>
                <br />
                <strong>Date:</strong> {formatDate(showtime.date)}
                <br />
                <strong>Time:</strong> {showtime.time}
                <br />
                <strong>Price per seat:</strong> ${showtime.price}
                <br />
                <strong>Available Seats:</strong> {showtime.availableSeats}
              </p>
            </div>
          </div>

          <div className="screen mb-4">SCREEN</div>

          {showtime.seatLayout && showtime.seatLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="mb-2">
              <div className="d-flex justify-content-center">
                <strong className="me-3" style={{ width: '20px' }}>{row.row}</strong>
                {row.seats.map((seat) => (
                  <div
                    key={seat.id}
                    className={`seat ${seat.status === 'booked' ? 'booked' : selectedSeats.includes(seat.id) ? 'selected' : 'available'}`}
                    onClick={() => seat.status !== 'booked' && handleSeatClick(seat.id)}
                    style={{ cursor: seat.status === 'booked' ? 'not-allowed' : 'pointer' }}
                  >
                    {seat.id}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4">
            <div className="row">
              <div className="col-md-6">
                <div className="seat available" style={{ display: 'inline-block', marginRight: '10px' }}></div>
                Available
              </div>
              <div className="col-md-6">
                <div className="seat selected" style={{ display: 'inline-block', marginRight: '10px' }}></div>
                Selected
              </div>
              <div className="col-md-6">
                <div className="seat booked" style={{ display: 'inline-block', marginRight: '10px' }}></div>
                Booked
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Booking Summary</h5>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <div className="mb-3">
                <strong>Selected Seats:</strong>
                <div>
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map(seat => (
                      <span key={seat} className="badge bg-primary me-1">
                        {seat}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">None</span>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <strong>Total Seats:</strong> {selectedSeats.length}
              </div>

              <div className="mb-3">
                <strong>Total Amount:</strong> ${selectedSeats.length * showtime.price}
              </div>

              <button
                className="btn btn-success w-100"
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || booking}
              >
                {booking ? 'Processing...' : `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`}
              </button>

              <button
                className="btn btn-secondary w-100 mt-2"
                onClick={() => navigate('/movies')}
              >
                Back to Movies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
