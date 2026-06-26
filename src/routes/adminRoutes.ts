import { Router } from 'express';
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth';
import {
  createAdminUser,
  updateAdminUser,
  getAdminDashboardStats,
  getAdminUsers,
  getAdminBookings,
  getAdminTransactions,
  getAdminFleet,
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminOnlyMiddleware);

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getAdminUsers);
router.post('/users', createAdminUser);
router.put('/users/:id', updateAdminUser);
router.get('/bookings', getAdminBookings);
router.get('/transactions', getAdminTransactions);
router.get('/fleet', getAdminFleet);

export default router;