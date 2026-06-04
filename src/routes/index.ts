import { Router } from 'express';
import { getHealth } from '../controllers/healthController';
import authRoutes from './authRoutes';
import bookingRoutes from './bookingRoutes';
import emergencyContactsRoutes from './emergencyContactsRoutes';

const router = Router();

// Health Check Route
router.get('/health', getHealth);

// Auth Routes
router.use('/auth', authRoutes);

// Booking Routes
router.use('/bookings', bookingRoutes);

// Emergency Contacts Routes
router.use('/emergency-contacts', emergencyContactsRoutes);

export default router;
