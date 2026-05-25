import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { initializeDB } from './config/schema';
import routes from './routes';
import errorHandler from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Initialize database connection and schema
(async () => {
  try {
    await connectDB();
    await initializeDB();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use(`${process.env.API_PREFIX || '/api/v1'}`, routes);

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error Handler Middleware
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Campus Ride API Server Started       ║
╚════════════════════════════════════════╝
  
  🚀 Server: http://localhost:${PORT}
  📝 API: ${process.env.API_PREFIX || '/api/v1'}
  🌍 Environment: ${NODE_ENV}
  ⏱️  Started at: ${new Date().toISOString()}
  `);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('\n📛 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📛 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
