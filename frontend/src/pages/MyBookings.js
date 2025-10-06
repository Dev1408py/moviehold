import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    fetchBookings();
  }, [user, authLoading, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`/bookings/${bookingId}`);
        // Refresh bookings list
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking:', error);
        setError('Failed to cancel booking. Please try again.');
      }
    }
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2>My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center mt-5">
          <p>You haven't made any bookings yet.</p>
          <a href="/movies" className="btn btn-primary">
            Browse Movies
          </a>
        </div>
      ) : (
        <div className="row">
          {bookings.map((booking) => (
            <div key={booking.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    Booking #{booking.bookingReference}
                  </h5>

                  <div className="mb-2">
                    <strong>Movie:</strong> {booking.showtime.movie.title}
                  </div>

                  <div className="mb-2">
                    <strong>Theater:</strong> {booking.showtime.theater}
                  </div>

                  <div className="mb-2">
                    <strong>Date & Time:</strong>
                    <br />
                    {formatDate(booking.showtime.date)} at {booking.showtime.time}
                  </div>

                  <div className="mb-2">
                    <strong>Seats:</strong>
                    <div>
                      {booking.seats.map(seat => (
                        <span key={seat} className="badge bg-secondary me-1">
                          {seat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2">
                    <strong>Total Amount:</strong> ${booking.totalAmount}
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">
                      Booked on: {formatDateTime(booking.createdAt)}
                    </small>
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
