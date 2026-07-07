import ContactMessage from '../models/ContactMessage.js';

/**
 * Retrieves a paginated list of user contact messages.
 * Can filter messages based on read status.
 *
 * @param {string} status - Read status filter ('unread', 'read', or all)
 * @param {number} page - Current page number
 * @param {number} limit - Items per page limit
 * @returns {Promise<object>} Paginated result structure
 */
export const getContactMessages = async (status, page = 1, limit = 15) => {
  const skip = (page - 1) * limit;
  const filter = {};

  if (status === 'unread') {
    filter.isRead = false;
  } else if (status === 'read') {
    filter.isRead = true;
  }

  const [items, totalItems] = await Promise.all([
    ContactMessage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ContactMessage.countDocuments(filter),
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
 * Marks a contact inquiry message as read.
 *
 * @param {string} id - Contact message ID
 * @returns {Promise<object|null>} Updated contact message document
 */
export const markMessageRead = async (id) => {
  return await ContactMessage.findByIdAndUpdate(id, { isRead: true }, { new: true });
};
