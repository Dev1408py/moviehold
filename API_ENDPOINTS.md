# API Endpoints Configuration

## Backend Configuration
- **Base URL**: `https://moviehold-production-22ae.up.railway.app`
- **Port**: Dynamic (Railway assigns port)
- **API Prefix**: `/api`

## Frontend Configuration
- **API URL**: `https://moviehold-production-22ae.up.railway.app/api` (configured in frontend/.env as REACT_APP_API_URL)

## API Routes Mapping

### Authentication Routes (`/api/auth`)
| Frontend Call | Backend Route | Method | Description |
|--------------|---------------|--------|-------------|
| `/auth/register` | `/api/auth/register` | POST | User registration |
| `/auth/login` | `/api/auth/login` | POST | User login |
| `/auth/me` | `/api/auth/me` | GET | Get current user (requires auth) |

### Movies Routes (`/api/movies`)
| Frontend Call | Backend Route | Method | Description |
|--------------|---------------|--------|-------------|
| `/movies` | `/api/movies` | GET | Get all movies with showtimes |
| `/movies/:id` | `/api/movies/:id` | GET | Get movie by ID with showtimes |
| `/movies/showtimes/:showtimeId` | `/api/movies/showtimes/:showtimeId` | GET | Get showtime details (FIXED) |

### Bookings Routes (`/api/bookings`)
| Frontend Call | Backend Route | Method | Description |
|--------------|---------------|--------|-------------|
| `/bookings` | `/api/bookings` | POST | Create new booking (requires auth) |
| `/bookings/my-bookings` | `/api/bookings/my-bookings` | GET | Get user's bookings (requires auth) |
| `/bookings/:id` | `/api/bookings/:id` | GET | Get booking by ID (requires auth) |
| `/bookings/:id` | `/api/bookings/:id` | DELETE | Cancel booking (requires auth) |

## Fixed Issues

### 1. Showtime Details Route
**Problem**: Frontend was calling `/movies/${showtimeId}/showtimes/${showtimeId}` (using showtimeId for both movieId and showtimeId)

**Solution**: 
- Added new backend route: `/api/movies/showtimes/:showtimeId` that only requires showtimeId
- Updated frontend to call: `/movies/showtimes/${showtimeId}`
- Kept legacy route for backward compatibility

### 2. Environment Variables
**Status**: ✅ Already configured correctly
- Frontend `.env` has `REACT_APP_API_URL=https://moviehold-production-22ae.up.railway.app/api`
- Backend `.env` has `PORT=5000`

### 3. CORS Configuration
**Status**: ✅ Already configured correctly
- Backend allows `http://localhost:3000` and `http://127.0.0.1:3000`
- Credentials enabled for authentication

## Testing the Connection

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. The frontend should now properly connect to the backend at `https://moviehold-production-22ae.up.railway.app/api`
