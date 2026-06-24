import { Router } from 'express';
import { recordTracking, getTracking, getLatestLocation } from '../controllers/trackingController';

const router = Router();

// Record a new tracking point
router.post('/', recordTracking);

// Get all tracking points for a ride
router.get('/', getTracking);

// Get latest location for a ride
router.get('/latest', getLatestLocation);

export default router;
