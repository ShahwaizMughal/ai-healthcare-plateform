import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { doctorValidator } from '../validators/doctorValidation.js';
import { medicineValidator } from '../validators/medicineValidation.js';
import { blogValidator } from '../validators/blogValidation.js';
import { appointmentStatusValidator } from '../validators/appointmentValidation.js';
import { orderStatusValidator } from '../validators/orderValidation.js';
import { labBookingStatusValidator } from '../validators/labBookingValidation.js';
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
  markMessageRead,
} from '../controllers/adminController.js';

const router = express.Router();

// Enforce auth verification and role validation on all admin operations
router.use(protect, isAdmin);

// Doctors CRUD
router.get('/doctors', getDoctors);
router.post('/doctors', doctorValidator, validate, createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

// Medicines CRUD
router.get('/medicines', getMedicines);
router.post('/medicines', medicineValidator, validate, createMedicine);
router.put('/medicines/:id', updateMedicine);
router.delete('/medicines/:id', deleteMedicine);

// Blogs CRUD
router.get('/blogs', getBlogs);
router.post('/blogs', blogValidator, validate, createBlog);
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);

// Status Management & fulfillment controls
router.get('/appointments', getAppointments);
router.patch('/appointments/:id/status', appointmentStatusValidator, validate, updateAppointmentStatus);

router.get('/orders', getOrders);
router.patch('/orders/:id/status', orderStatusValidator, validate, updateOrderStatus);

router.get('/lab-bookings', getLabBookings);
router.patch('/lab-bookings/:id/status', labBookingStatusValidator, validate, updateLabBookingStatus);

// Customer Inquiries Inbox
router.get('/messages', getContactMessages);
router.patch('/messages/:id/read', markMessageRead);

export default router;
