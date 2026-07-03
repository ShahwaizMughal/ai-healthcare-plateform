const LabTest = require('../models/LabTest');
const LabBooking = require('../models/LabBooking');

// GET /api/lab-tests — paginated list. Pagination is mandatory on every
// list endpoint per the SRS (Section 4.1) — never return a full collection.
exports.getLabTests = async (req, res, next) => {
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
      data: { items, page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) || 1 },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/lab-bookings — optional auth, guest bookings allowed.
exports.createLabBooking = async (req, res, next) => {
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
      // TODO: once M1's authMiddleware is merged, attach it to this route as
      // an *optional* check so req.user is set for logged-in users. Until
      // then every booking is treated as a guest booking.
      userId: req.user?.id || null,
      patientName,
      contactPhone,
      preferredDate: date,
    });

    res.status(201).json({ success: true, data: { labBooking } });
  } catch (err) {
    next(err);
  }
};
