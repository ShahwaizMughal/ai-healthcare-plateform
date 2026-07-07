import * as doctorService from '../services/doctorService.js';
import * as medicineService from '../services/medicineService.js';
import * as blogService from '../services/blogService.js';
import * as appointmentService from '../services/appointmentService.js';
import * as orderService from '../services/orderService.js';
import * as labBookingService from '../services/labBookingService.js';
import * as messageService from '../services/messageService.js';

// ─────────────────────────────────────────────
// DOCTORS CRUD
// ─────────────────────────────────────────────

// POST /api/admin/doctors — Create a new doctor profile
export const createDoctor = async (req, res, next) => {
  try {
    const { fullName, specialization, qualification, experienceYears, profileImageUrl, bio, consultationFee, availability } = req.body;

    if (!fullName || !specialization || !qualification || experienceYears === undefined || !profileImageUrl || consultationFee === undefined) {
      return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    const doctor = await doctorService.createDoctor({
      fullName,
      specialization,
      qualification,
      experienceYears,
      profileImageUrl,
      bio,
      consultationFee,
      availability: availability || [],
    });

    res.status(201).json({ success: true, data: { doctor } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/doctors/:id — Update an existing doctor profile
export const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.updateDoctor(id, req.body);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    res.status(200).json({ success: true, data: { doctor } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/doctors/:id — Soft-delete a doctor profile
export const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.deleteDoctor(id);

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    res.status(200).json({ success: true, message: 'Doctor profile soft-deleted successfully.', data: { doctor } });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// MEDICINES CRUD
// ─────────────────────────────────────────────

// POST /api/admin/medicines — Create a new medicine entry
export const createMedicine = async (req, res, next) => {
  try {
    const { name, description, dosage, category, price, imageUrl, stockQuantity, requiresPrescription } = req.body;

    if (!name || !description || !dosage || !category || price === undefined || !imageUrl || stockQuantity === undefined) {
      return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    const medicine = await medicineService.createMedicine({
      name,
      description,
      dosage,
      category,
      price,
      imageUrl,
      stockQuantity,
      requiresPrescription: requiresPrescription || false,
    });

    res.status(201).json({ success: true, data: { medicine } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/medicines/:id — Update an existing medicine entry
export const updateMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await medicineService.updateMedicine(id, req.body);

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found.' });
    }

    res.status(200).json({ success: true, data: { medicine } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/medicines/:id — Soft-delete a medicine
export const deleteMedicine = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await medicineService.deleteMedicine(id);

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found.' });
    }

    res.status(200).json({ success: true, message: 'Medicine soft-deleted successfully.', data: { medicine } });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// BLOGS CRUD
// ─────────────────────────────────────────────

// POST /api/admin/blogs — Create a new blog post
export const createBlog = async (req, res, next) => {
  try {
    const { title, category, content, excerpt, coverImageUrl, author, status } = req.body;

    if (!title || !category || !content || !coverImageUrl || !author) {
      return res.status(400).json({ success: false, message: 'Required fields are missing.' });
    }

    const blog = await blogService.createBlog({
      title,
      category,
      content,
      excerpt,
      coverImageUrl,
      author,
      status: status || 'draft',
    });

    res.status(201).json({ success: true, data: { blog } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/blogs/:id — Update an existing blog post
export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await blogService.updateBlog(id, req.body);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    res.status(200).json({ success: true, data: { blog } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/blogs/:id — Soft-delete a blog post (reverts status to draft)
export const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await blogService.deleteBlog(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found.' });
    }

    res.status(200).json({ success: true, message: 'Blog post soft-deleted (status set to draft) successfully.', data: { blog } });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// STATUS MANAGEMENT & FULFILLMENT
// ─────────────────────────────────────────────

// PATCH /api/admin/appointments/:id/status — Update appointment status
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be pending, confirmed, completed, or cancelled.' });
    }

    const appointment = await appointmentService.updateAppointmentStatus(id, status);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    res.status(200).json({ success: true, data: { appointment } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/orders/:id/status — Update medicine order status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['placed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be placed, processing, shipped, delivered, or cancelled.' });
    }

    const order = await orderService.updateOrderStatus(id, status);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, data: { order } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/lab-bookings/:id/status — Update lab booking status
export const updateLabBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be pending, confirmed, completed, or cancelled.' });
    }

    const labBooking = await labBookingService.updateLabBookingStatus(id, status);

    if (!labBooking) {
      return res.status(404).json({ success: false, message: 'Lab booking not found.' });
    }

    res.status(200).json({ success: true, data: { labBooking } });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// SUPPORT MESSAGES VIEW
// ─────────────────────────────────────────────

// GET /api/admin/messages — Fetch contact inquiries (paginated, newest first)
export const getContactMessages = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);

    const result = await messageService.getContactMessages(req.query.status, page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/messages/:id/read — Mark contact message as read
export const markMessageRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const message = await messageService.markMessageRead(id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    res.status(200).json({ success: true, data: { message } });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/doctors — Fetch all doctors (paginated)
export const getDoctors = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);

    const result = await doctorService.getDoctors(page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/medicines — Fetch all medicines (paginated)
export const getMedicines = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);

    const result = await medicineService.getMedicines(page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/blogs — Fetch all blogs (paginated)
export const getBlogs = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);

    const result = await blogService.getBlogs(page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/appointments — Fetch all appointments (paginated, populated with doctor and user info)
export const getAppointments = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);

    const result = await appointmentService.getAppointments(page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/orders — Fetch all orders (paginated)
export const getOrders = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);

    const result = await orderService.getOrders(page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/lab-bookings — Fetch all lab bookings (paginated, populated with lab test and user info)
export const getLabBookings = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);

    const result = await labBookingService.getLabBookings(page, limit);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
