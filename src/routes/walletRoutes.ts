import { Router } from 'express';
import { fundWallet, getWallet, withdrawWallet } from '../controllers/walletController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, getWallet);
router.post('/fund', authMiddleware, fundWallet);
router.post('/withdraw', authMiddleware, withdrawWallet);

export default router;
