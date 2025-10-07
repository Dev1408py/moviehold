# 🎬 CineFlix - Movie Ticket Booking System

A full-stack movie ticket booking application built with React (frontend) and Node.js/Express (backend) with MongoDB database.

## ✨ Features

- **User Authentication** - JWT-based login/register system
- **Movie Browsing** - Browse movies with search and filtering
- **Interactive Seat Selection** - Visual seat map with real-time availability
- **Booking Management** - View and cancel bookings
- **Dark/Light Theme** - Complete theme support throughout the app
- **Responsive Design** - Works perfectly on all devices
- **Netflix-style UI** - Modern, sleek interface

## 🚀 Quick Start

### Prerequisites

- Node.js (v18.x or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Local Development

1. **Clone and Setup Backend:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your MongoDB connection string and JWT secret:
   ```env
   MONGODB_URI=mongodb://localhost:27017/cineflix
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

3. **Seed Database (Optional):**
   ```bash
   npm run seed
   ```

4. **Start Backend:**
   ```bash
   npm run dev
   ```

5. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Configure Frontend Environment:**
   Update API URL in `src/config.js` or set environment variable:
   ```env
   REACT_APP_API_URL=https://moviehold-production-22ae.up.railway.app/api
   ```

7. **Start Frontend:**
   ```bash
   npm start
   ```

8. **Open Browser:**
   Navigate to `http://localhost:3000`

## 🌐 Deployment

### Frontend (Netlify)

1. **Build for Production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variable: `REACT_APP_API_URL=https://moviehold-production-22ae.up.railway.app/api`

3. **Alternative Manual Deploy:**
   ```bash
   netlify deploy --prod --dir=build
   ```

### Backend (Render)

1. **Deploy to Render:**
   - Connect your GitHub repository to Render
   - Select "Web Service"
   - Set runtime: `Node.js`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables:
     - `MONGODB_URI` (your MongoDB connection string)
     - `JWT_SECRET` (your JWT secret)
     - `PORT` (set to 10000 for Render)

2. **MongoDB Setup:**
   - Use MongoDB Atlas (free tier available)
   - Or deploy MongoDB on Railway/Railway

### Production URLs

- **Frontend:** `https://cineflix-movie-booking.netlify.app`
- **Backend:** `https://moviehold-production-22ae.up.railway.app`
- **MongoDB:** `mongodb+srv://...` (Atlas cluster)

## 📁 Project Structure

```
movie-booking-system/
├── frontend/           # React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React contexts
│   │   └── App.js
│   ├── package.json
│   └── netlify.toml
├── backend/            # Express.js API
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── seed.js           # Database seeder
│   └── server.js         # Main server file
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
MONGODB_URI=mongodb://localhost:27017/cineflix
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

**Frontend (.env):**
```env
REACT_APP_API_URL=https://moviehold-production-22ae.up.railway.app/api
```

### Database Models

- **User** - Authentication and user data
- **Movie** - Movie information
- **Showtime** - Theater and show timing data
- **Booking** - User bookings with seat information

## 🎨 Features in Detail

### User Authentication
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt
- Protected routes and middleware

### Movie Management
- Movie CRUD operations
- Image upload support
- Genre categorization

### Seat Selection
- Visual seat map with real-time availability
- Row and seat validation
- Booking conflict prevention

### Booking System
- Real-time seat availability
- Booking confirmation with reference numbers
- Booking cancellation support

## 🔒 Security

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration

## 📱 Responsive Design

- Bootstrap 5 integration
- Mobile-first approach
- Touch-friendly seat selection
- Adaptive layouts

## 🌙 Theme Support

- Complete dark/light mode implementation
- CSS custom properties (variables)
- Theme persistence in localStorage
- Smooth transitions

## 🚀 Performance

- Optimized React components
- Database indexing for queries
- Efficient state management
- Lazy loading support

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID

### Showtimes
- `GET /api/movies/:movieId/showtimes/:showtimeId` - Get showtime details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `DELETE /api/bookings/:id` - Cancel booking

## 🛠️ Development

### Available Scripts

**Frontend:**
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run eject    # Eject from CRA
```

**Backend:**
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run seed     # Seed database with sample data
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection:** Ensure MongoDB is running and connection string is correct
2. **Port Conflicts:** Make sure ports 3000 (frontend) and 5000 (backend) are available
3. **Environment Variables:** Check that all required environment variables are set

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=cineflix:*
```

## 📄 License

ISC License - see LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ using React, Node.js, Express, and MongoDB**
