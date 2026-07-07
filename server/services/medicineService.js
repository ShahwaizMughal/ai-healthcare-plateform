import Medicine from '../models/Medicine.js';

/**
 * Creates a new medicine entry in the catalog.
 *
 * @param {object} medicineData - Medicine attributes
 * @returns {Promise<object>} Created medicine document
 */
export const createMedicine = async (medicineData) => {
  return await Medicine.create(medicineData);
};

/**
 * Updates an existing medicine entry.
 *
 * @param {string} id - Medicine ID
 * @param {object} updateData - Update fields dictionary
 * @returns {Promise<object|null>} Updated medicine document, or null if not found
 */
export const updateMedicine = async (id, updateData) => {
  return await Medicine.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

/**
 * Performs a soft-delete on a medicine to preserve historical logs.
 *
 * @param {string} id - Medicine ID
 * @returns {Promise<object|null>} Soft-deleted medicine document
 */
export const deleteMedicine = async (id) => {
  return await Medicine.findByIdAndUpdate(id, { isActive: false }, { new: true });
};

/**
 * Retrieves a paginated list of medicines sorted by creation date (newest first).
 *
 * @param {number} page - Current page number
 * @param {number} limit - Items per page limit
 * @returns {Promise<object>} Paginated result structure
 */
export const getMedicines = async (page = 1, limit = 8) => {
  const skip = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    Medicine.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Medicine.countDocuments(),
  ]);

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit) || 1,
  };
};
