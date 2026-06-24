import { Router } from 'express';
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth';
import {
  getAdminDashboardStats,
  getAdminUsers,
  getAdminBookings,
  getAdminTransactions,
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminOnlyMiddleware);

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getAdminUsers);
router.get('/bookings', getAdminBookings);
router.get('/transactions', getAdminTransactions);

export default router;