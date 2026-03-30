# League Management API Documentation

## Base URL
- **Production**: `https://your-api.onrender.com`
- **Development**: `http://localhost:5000`

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns API status and health information.

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

#### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Teams
```
GET /api/teams
POST /api/teams
PUT /api/teams/:id
DELETE /api/teams/:id
```

#### Get All Teams
```json
GET /api/teams
Authorization: Bearer <token>
```

#### Create Team
```json
POST /api/teams
Authorization: Bearer <token>
{
  "name": "Team Name",
  "sport": "cricket",
  "players": ["Player 1", "Player 2"],
  "captain": "Player 1"
}
```

### Matches
```
GET /api/matches
POST /api/matches
PUT /api/matches/:id
GET /api/matches/upcoming
```

#### Create Match
```json
POST /api/matches
Authorization: Bearer <token>
{
  "team1": "Team A",
  "team2": "Team B",
  "sport": "cricket",
  "venue": "Stadium Name",
  "date": "2024-01-15T10:00:00Z",
  "matchType": "league"
}
```

### Leaderboard
```
GET /api/leaderboard/cricket
GET /api/leaderboard/throwball
```

## Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Route not found"
}
```

### 500 Server Error
```json
{
  "status": "error",
  "message": "Something went wrong!"
}
```

## Rate Limiting
- 100 requests per 15 minutes per IP
- Exceeding limit returns 429 Too Many Requests

## CORS
Allowed origins configured via FRONTEND_URL environment variable.
