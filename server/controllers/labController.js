import LabTest from '../models/LabTest.js';
import LabBooking from '../models/LabBooking.js';

// GET /api/lab-tests — paginated list.
export const getLabTests = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);

    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const [items, totalItems] = await Promise.all([
      LabTest.find(filter)
        .sort({ category: 1, name: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      LabTest.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { 
        items, 
        page, 
        limit, 
        totalItems, 
        totalPages: Math.ceil(totalItems / limit) || 1 
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/lab-bookings — optional auth, guest bookings allowed.
export const createLabBooking = async (req, res, next) => {
  try {
    const { labTestId, patientName, contactPhone, preferredDate } = req.body;

    if (!labTestId || !patientName || !contactPhone || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'labTestId, patientName, contactPhone and preferredDate are required.',
      });
    }

    if (!/^\d{10,15}$/.test(contactPhone)) {
      return res.status(400).json({ success: false, message: 'contactPhone must be 10-15 digits.' });
    }

    const test = await LabTest.findById(labTestId);
    if (!test) {
      return res.status(404).json({ success: false, message: 'Lab test not found.' });
    }

    const date = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(date.getTime()) || date < today) {
      return res.status(400).json({
        success: false,
        message: 'preferredDate must be a valid date and cannot be in the past.',
      });
    }

    const labBooking = await LabBooking.create({
      labTestId,
      userId: req.user?._id || null, // Attach logged-in user if available (via optional check)
      patientName,
      contactPhone,
      preferredDate: date,
    });

    res.status(201).json({ success: true, data: { labBooking } });
  } catch (err) {
    next(err);
  }
};
