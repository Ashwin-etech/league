# League Management System

A full-stack League Management and Match Tracking web application using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **Dual Sports Support**: Separate sections for Cricket and Throwball
- **Team Management**: Create, edit, and delete teams with player details
- **Match Scheduling**: Create fixtures and schedule matches with venues
- **Live Match Updates**: Track scores, winners, and detailed statistics
- **Leaderboards**: Dynamic rankings with IPL-style points system and NRR calculations
- **Admin Panel**: Complete league management interface
- **Authentication**: JWT-based secure login system

## Project Structure

```
league/
├── backend/                 # Node.js/Express API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication and validation
│   ├── config/             # Database configuration
│   └── server.js           # Server entry point
├── frontend/               # React.js frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context for state management
│   │   ├── services/       # API service functions
│   │   └── utils/          # Helper functions
│   ├── public/             # Static assets
│   └── package.json
└── package.json            # Root package.json
```

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, React Router, Axios, Tailwind CSS
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB with proper indexing
- **Styling**: Tailwind CSS for modern, responsive design

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd league
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install
   
   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in backend directory
   cd backend
   cp .env.example .env
   # Update .env with your MongoDB connection string and JWT secret
   ```
   
   Example `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/league_management
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   # For MongoDB Atlas (cloud):
   # Update MONGODB_URI in your .env file with your Atlas connection string
   
   # For local MongoDB:
   mongod
   ```

5. **Seed the database (optional)**
   ```bash
   cd backend
   npm run seed
   ```
   This will create sample users, teams, and matches.

6. **Run the application**
   ```bash
   # From the root directory, run both frontend and backend
   npm run dev
   
   # Or run them separately:
   
   # Start backend server (port 5000)
   cd backend && npm run dev
   
   # Start frontend development server (port 3000)
   cd frontend && npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

### Default Login Credentials
After running the seed script:
- **Admin**: admin@league.com / Admin123
- **User**: user1@league.com / User123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create new match
- `PUT /api/matches/:id` - Update match result
- `GET /api/matches/upcoming` - Get upcoming matches

### Leaderboard
- `GET /api/leaderboard/cricket` - Cricket standings
- `GET /api/leaderboard/throwball` - Throwball standings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
