import { Router } from 'express';
import { createDelivery, getDeliveries, updateDeliveryStatus } from '../controllers/deliveryController';

const router = Router();

router.post('/', createDelivery);
router.get('/', getDeliveries);
router.patch('/:id/status', updateDeliveryStatus);

export default router;
