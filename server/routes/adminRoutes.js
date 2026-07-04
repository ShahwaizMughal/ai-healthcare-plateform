import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  createBlog,
  updateBlog,
  deleteBlog,
  updateAppointmentStatus,
  updateOrderStatus,
  updateLabBookingStatus,
  getContactMessages,
} from '../controllers/adminController.js';

const router = express.Router();

// Enforce auth verification and role validation on all admin operations
router.use(protect, isAdmin);

// Doctors CRUD
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

// Medicines CRUD
router.post('/medicines', createMedicine);
router.put('/medicines/:id', updateMedicine);
router.delete('/medicines/:id', deleteMedicine);

// Blogs CRUD
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

// Status Management & fulfillment controls
router.patch('/appointments/:id/status', updateAppointmentStatus);
router.patch('/orders/:id/status', updateOrderStatus);
router.patch('/lab-bookings/:id/status', updateLabBookingStatus);

// Customer Inquiries Inbox
router.get('/messages', getContactMessages);

export default router;
