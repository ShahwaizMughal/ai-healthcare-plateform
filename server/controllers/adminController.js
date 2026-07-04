import Doctor from '../models/Doctor.js';
import Medicine from '../models/Medicine.js';
import Blog from '../models/Blog.js';
import Appointment from '../models/Appointment.js';
import Order from '../models/Order.js';
import LabBooking from '../models/LabBooking.js';
import ContactMessage from '../models/ContactMessage.js';

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

    const doctor = await Doctor.create({
      fullName,
      specialization,
      qualification,
      experienceYears,
      profileImageUrl,
      bio,
      consultationFee,
      availability: availability || []
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
    const doctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

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
    // Perform soft delete to preserve historical booking data integrity
    const doctor = await Doctor.findByIdAndUpdate(id, { isActive: false }, { new: true });

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

    const medicine = await Medicine.create({
      name,
      description,
      dosage,
      category,
      price,
      imageUrl,
      stockQuantity,
      requiresPrescription: requiresPrescription || false
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
    const medicine = await Medicine.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

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
    // Perform soft delete to preserve historical order logs
    const medicine = await Medicine.findByIdAndUpdate(id, { isActive: false }, { new: true });

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

    // Auto-generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const blog = await Blog.create({
      title,
      slug,
      category,
      content,
      excerpt,
      coverImageUrl,
      author,
      status: status || 'draft'
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
    
    // If title is changing, regenerate slug
    if (req.body.title) {
      req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

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
    // Perform soft delete by reverting to draft status
    const blog = await Blog.findByIdAndUpdate(id, { status: 'draft' }, { new: true });

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

    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });

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

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

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

    const labBooking = await LabBooking.findByIdAndUpdate(id, { status }, { new: true });

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

    const [items, totalItems] = await Promise.all([
      ContactMessage.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      ContactMessage.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        items,
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit) || 1
      }
    });
  } catch (err) {
    next(err);
  }
};
