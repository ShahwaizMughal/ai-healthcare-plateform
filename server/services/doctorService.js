import Doctor from '../models/Doctor.js';

/**
 * Creates a new doctor profile database entry.
 *
 * @param {object} doctorData - Doctor profile fields
 * @returns {Promise<object>} Created doctor document
 */
export const createDoctor = async (doctorData) => {
  return await Doctor.create(doctorData);
};

/**
 * Updates an existing doctor profile.
 *
 * @param {string} id - Doctor document ID
 * @param {object} updateData - Partial update fields
 * @returns {Promise<object|null>} Updated doctor document, or null if not found
 */
export const updateDoctor = async (id, updateData) => {
  return await Doctor.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

/**
 * Performs a soft-delete on a doctor profile by marking isActive as false.
 *
 * @param {string} id - Doctor document ID
 * @returns {Promise<object|null>} Updated doctor document, or null if not found
 */
export const deleteDoctor = async (id) => {
  return await Doctor.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

/**
 * Retrieves a paginated list of doctors sorted by creation date (newest first).
 *
 * @param {number} page - Current page number
 * @param {number} limit - Items per page limit
 * @returns {Promise<object>} Paginated result structure
 */
export const getDoctors = async (page = 1, limit = 8) => {
  const skip = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    Doctor.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Doctor.countDocuments(),
  ]);

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit) || 1,
  };
};
