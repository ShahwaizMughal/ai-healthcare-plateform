import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctors,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicines,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  updateAppointmentStatus,
  getAppointments,
  updateOrderStatus,
  getOrders,
  updateLabBookingStatus,
  getLabBookings,
  getContactMessages,
} from '../controllers/adminController.js';

const router = express.Router();

// Enforce auth verification and role validation on all admin operations
router.use(protect, isAdmin);

// Doctors CRUD
router.get('/doctors', getDoctors);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

// Medicines CRUD
router.get('/medicines', getMedicines);
router.post('/medicines', createMedicine);
router.put('/medicines/:id', updateMedicine);
router.delete('/medicines/:id', deleteMedicine);

// Blogs CRUD
router.get('/blogs', getBlogs);
router.post('/blogs', createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

// Status Management & fulfillment controls
router.get('/appointments', getAppointments);
router.patch('/appointments/:id/status', updateAppointmentStatus);

router.get('/orders', getOrders);
router.patch('/orders/:id/status', updateOrderStatus);

router.get('/lab-bookings', getLabBookings);
router.patch('/lab-bookings/:id/status', updateLabBookingStatus);

// Customer Inquiries Inbox
router.get('/messages', getContactMessages);

export default router;
