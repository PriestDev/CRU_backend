import { Router } from 'express';
import { getUserById, updateUserProfile } from '../controllers/userController';

const router = Router();

router.get('/:id', getUserById);
router.put('/:id', updateUserProfile);

export default router;
