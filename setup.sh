#!/bin/bash

# Movie Ticket Booking System - Development Startup Script

echo "🚀 Starting Movie Ticket Booking System..."

# Check if MongoDB is running (optional for development)
echo "📋 Make sure MongoDB is running on your system"

# Start Backend
echo "🔧 Starting Backend Server..."
cd backend
npm install
echo "⚡ Backend dependencies installed"

# Start Frontend (in a new terminal window would be better, but for script we run sequentially)
echo "🎨 Starting Frontend Development Server..."
cd ../frontend
npm install
echo "⚡ Frontend dependencies installed"

echo ""
echo "📝 Setup Complete!"
echo ""
echo "To start the backend server:"
echo "  cd backend && npm start"
echo ""
echo "To start the frontend (in another terminal):"
echo "  cd frontend && npm start"
echo ""
echo "Backend is deployed at: https://moviehold-production-22ae.up.railway.app"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Don't forget to:"
echo "1. Set up your .env file in the backend directory"
echo "2. Run 'node seed.js' in the backend directory to populate sample data"
echo ""
echo "Happy coding! 🎬"
