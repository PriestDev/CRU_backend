import { Router } from 'express';
import {
  createEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
} from '../controllers/emergencyContactsController';

const router = Router();

router.post('/', createEmergencyContact);
router.get('/', getEmergencyContacts);
router.delete('/:id', deleteEmergencyContact);

export default router;
