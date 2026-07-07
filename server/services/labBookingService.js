import LabBooking from '../models/LabBooking.js';

/**
 * Retrieves a paginated list of lab test bookings populated with lab test and user info.
 *
 * @param {number} page - Current page number
 * @param {number} limit - Items per page limit
 * @returns {Promise<object>} Paginated result structure
 */
export const getLabBookings = async (page = 1, limit = 15) => {
  const skip = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    LabBooking.find()
      .populate('labTestId', 'name category price')
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    LabBooking.countDocuments(),
  ]);

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit) || 1,
  };
};

/**
 * Updates status of an existing lab booking.
 *
 * @param {string} id - Lab booking ID
 * @param {string} status - Target status string ('pending', 'confirmed', 'completed', 'cancelled')
 * @returns {Promise<object|null>} Updated lab booking document
 */
export const updateLabBookingStatus = async (id, status) => {
  return await LabBooking.findByIdAndUpdate(id, { status }, { new: true });
};
