import { Router } from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  updateRideCompletionApproval,
  updateRideStartApproval,
} from '../controllers/bookingController';
import { authMiddleware, optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', createBooking);
router.get('/', optionalAuth, getBookings);
router.patch('/:id/status', authMiddleware, updateBookingStatus);
router.patch('/:id/complete-approval', authMiddleware, updateRideCompletionApproval);
router.patch('/:id/start-approval', authMiddleware, updateRideStartApproval);

export default router;
