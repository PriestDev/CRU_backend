import { Router } from 'express';
import {
  createEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
  triggerSosAlert,
} from '../controllers/emergencyContactsController';

const router = Router();

router.post('/', createEmergencyContact);
router.post('/sos', triggerSosAlert);
router.get('/', getEmergencyContacts);
router.delete('/:id', deleteEmergencyContact);

export default router;
