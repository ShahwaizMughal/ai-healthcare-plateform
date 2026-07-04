import express from 'express';
import { getEmergencyContacts } from '../controllers/emergencyController.js';

const router = express.Router();

router.get('/emergency-contacts', getEmergencyContacts);

export default router;
