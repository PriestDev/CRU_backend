# Campus Ride Uniport - Backend API

Node.js/Express REST API backend for the Campus Ride Uniport application.

## 📋 Features

- Express.js REST API
- TypeScript for type safety
- MongoDB integration with Mongoose
- JWT Authentication
- CORS enabled
- Error handling middleware
- Environment configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- MongoDB 4.4+
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
   MONGODB_URI=mongodb://localhost:27017/campus-ride-uniport
   JWT_SECRET=your_secret_key
   CORS_ORIGIN=http://localhost:3000
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
│   ├── models/             # MongoDB models
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── config/             # Configuration files
├── dist/                   # Compiled JavaScript
├── .env.example           # Environment variables template
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript configuration
```

## 🔌 API Endpoints

### Health Check
- `GET /api/v1/health` - Check API status

### Authentication (TODO)
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token

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
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/db` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - CORS middleware
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables

## 🛠️ Development Dependencies

- **typescript** - Type safety
- **ts-node** - TypeScript execution
- **@types/node** - Node.js types
- **eslint** - Code linting
- **prettier** - Code formatting

## 📝 License

MIT
