import { Router } from 'express';
import { createDelivery, getDeliveries } from '../controllers/deliveryController';

const router = Router();

router.post('/', createDelivery);
router.get('/', getDeliveries);

export default router;
