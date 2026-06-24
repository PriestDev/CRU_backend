import { Router } from 'express';
import { createRating, getRatingByBooking, getRatingsByUser } from '../controllers/ratingController';

const router = Router();

// Create or update rating for a ride
router.post('/', createRating);

// Get rating by booking ID
router.get('/booking', getRatingByBooking);

// Get all ratings by user ID
router.get('/user', getRatingsByUser);

export default router;
