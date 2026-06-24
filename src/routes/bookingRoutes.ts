import { Router } from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus,
  updateRideStartApproval,
} from '../controllers/bookingController';

const router = Router();

router.post('/', createBooking);
router.get('/', getBookings);
router.patch('/:id/status', updateBookingStatus);
router.patch('/:id/start-approval', updateRideStartApproval);

export default router;
