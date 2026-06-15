import { Router } from 'express';
import { getCarpools, joinCarpool } from '../controllers/carpoolController';

const router = Router();

router.get('/', getCarpools);
router.post('/join', joinCarpool);

export default router;
