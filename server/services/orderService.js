import Order from '../models/Order.js';

/**
 * Retrieves a paginated list of medicine checkout orders populated with user details.
 *
 * @param {number} page - Current page number
 * @param {number} limit - Items per page limit
 * @returns {Promise<object>} Paginated result structure
 */
export const getOrders = async (page = 1, limit = 15) => {
  const skip = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    Order.find()
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(),
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
 * Updates status of an existing order.
 *
 * @param {string} id - Order ID
 * @param {string} status - Target status string ('placed', 'processing', 'shipped', 'delivered', 'cancelled')
 * @returns {Promise<object|null>} Updated order document
 */
export const updateOrderStatus = async (id, status) => {
  return await Order.findByIdAndUpdate(id, { status }, { new: true });
};
