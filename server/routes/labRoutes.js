import express from 'express';
import { getLabTests, createLabBooking } from '../controllers/labController.js';

const router = express.Router();

router.get('/lab-tests', getLabTests);
router.post('/lab-bookings', createLabBooking);

export default router;
