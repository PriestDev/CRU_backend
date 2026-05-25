import { Router } from 'express';
import { getHealth } from '../controllers/healthController';
import authRoutes from './authRoutes';

const router = Router();

// Health Check Route
router.get('/health', getHealth);

// Auth Routes
router.use('/auth', authRoutes);

// User Routes (placeholder)
// router.use('/users', userRoutes);

// Ride Routes (placeholder)
// router.use('/rides', rideRoutes);

// Payment Routes (placeholder)
// router.use('/payments', paymentRoutes);

// Booking Routes (placeholder)
// router.use('/bookings', bookingRoutes);

export default router;
