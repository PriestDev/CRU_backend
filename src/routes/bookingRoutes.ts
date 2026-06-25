import { Router } from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  updateRideStartApproval,
} from '../controllers/bookingController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.post('/', createBooking);
router.get('/', optionalAuth, getBookings);
router.patch('/:id/status', updateBookingStatus);
router.patch('/:id/start-approval', updateRideStartApproval);

export default router;
