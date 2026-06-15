import { Router } from 'express';
import { getHealth } from '../controllers/healthController';
import authRoutes from './authRoutes';
import bookingRoutes from './bookingRoutes';
import carpoolRoutes from './carpoolRoutes';
import deliveryRoutes from './deliveryRoutes';
import emergencyContactsRoutes from './emergencyContactsRoutes';
import walletRoutes from './walletRoutes';
import userRoutes from './userRoutes';

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

// Emergency Contacts Routes
router.use('/emergency-contacts', emergencyContactsRoutes);

export default router;
