import { Router } from 'express';
import { fundWallet, getWallet, withdrawWallet } from '../controllers/walletController';

const router = Router();

router.get('/', getWallet);
router.post('/fund', fundWallet);
router.post('/withdraw', withdrawWallet);

export default router;
