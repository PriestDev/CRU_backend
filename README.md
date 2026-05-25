# Campus Ride Uniport - Backend API

Node.js/Express REST API backend for the Campus Ride Uniport application.

## 📋 Features

- Express.js REST API
- TypeScript for type safety
- MySQL database with connection pooling
- JWT Authentication
- CORS enabled
- Error handling middleware
- Environment configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- MySQL 5.7+
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your configuration:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=campus_ride_uniport
   DB_PORT=3306
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   JWT_SECRET=your_secret_key
   JWT_EXPIRY=24h
   ```

### Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

### Build

Compile TypeScript:
```bash
npm run build
```

### Production

Start the production server:
```bash
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── server.ts           # Entry point
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── config/             # Configuration files
│   │   ├── database.ts     # MySQL connection pool
│   │   └── schema.ts       # Database schema initialization
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
├── dist/                   # Compiled JavaScript
├── .env.example           # Environment variables template
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript configuration
```

## 🔌 API Endpoints

### Health Check
- `GET /api/v1/health` - Check API status

### Authentication
- `POST /api/v1/auth/signup` - User registration with email and role
- `POST /api/v1/auth/verify-otp` - Verify OTP for email confirmation
- `POST /api/v1/auth/resend-otp` - Resend OTP to user email

### Users (TODO)
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/:id` - Update user profile
- `DELETE /api/v1/users/:id` - Delete account

### Rides (TODO)
- `GET /api/v1/rides` - List all rides
- `POST /api/v1/rides` - Create a ride
- `GET /api/v1/rides/:id` - Get ride details
- `PUT /api/v1/rides/:id` - Update ride
- `DELETE /api/v1/rides/:id` - Cancel ride

### Bookings (TODO)
- `POST /api/v1/bookings` - Book a ride
- `GET /api/v1/bookings/:id` - Get booking details
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Cancel booking

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `your_password` |
| `DB_NAME` | Database name | `campus_ride_uniport` |
| `DB_PORT` | MySQL port | `3306` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `JWT_EXPIRY` | JWT expiration time | `24h` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## 📦 Dependencies

- **express** - Web framework
- **mysql2** - MySQL database driver with connection pooling
- **cors** - CORS middleware
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **validator** - Input validation
- **dotenv** - Environment variables

## 🛠️ Development Dependencies

- **typescript** - Type safety
- **ts-node** - TypeScript execution
- **@types/node** - Node.js types
- **eslint** - Code linting
- **prettier** - Code formatting

## 📝 License

MIT
