import { Router } from 'express';
import { getHealth } from '../controllers/healthController';
import authRoutes from './authRoutes';
import bookingRoutes from './bookingRoutes';
import carpoolRoutes from './carpoolRoutes';
import deliveryRoutes from './deliveryRoutes';
import emergencyContactsRoutes from './emergencyContactsRoutes';
import walletRoutes from './walletRoutes';
import userRoutes from './userRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';
import ratingRoutes from './ratingRoutes';
import trackingRoutes from './trackingRoutes';

const router = Router();

// Health Check Route
router.get('/health', getHealth);

// Auth Routes
router.use('/auth', authRoutes);

// User Routes
router.use('/users', userRoutes);

// Booking Routes
router.use('/bookings', bookingRoutes);

// Carpool Routes
router.use('/carpools', carpoolRoutes);

// Delivery Routes
router.use('/deliveries', deliveryRoutes);

// Wallet Routes
router.use('/wallet', walletRoutes);

// Notification Routes
router.use('/notifications', notificationRoutes);

// Emergency Contacts Routes
router.use('/emergency-contacts', emergencyContactsRoutes);

// Rating Routes
router.use('/ratings', ratingRoutes);

// Tracking Routes
router.use('/tracking', trackingRoutes);

// Admin Routes
router.use('/admin', adminRoutes);

export default router;
