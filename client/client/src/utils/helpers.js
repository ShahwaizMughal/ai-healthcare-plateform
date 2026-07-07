/**
 * Converts a text title into a URL-friendly slug.
 *
 * @param {string} text - The input title
 * @returns {string} URL-safe slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
};

/**
 * Returns Tailwind class names for status badges based on order/booking/appointment state.
 * Supports: confirmed, completed, cancelled, processing, shipped, delivered, pending, default fallbacks.
 *
 * @param {string} status - Current status name
 * @returns {string} Tailwind CSS styles mapping
 */
export const getStatusClass = (status) => {
  switch (status) {
    case 'confirmed':
    case 'delivered':
      return 'bg-success/15 text-success';
    case 'completed':
      return 'bg-primary/15 text-primary';
    case 'cancelled':
      return 'bg-danger/15 text-danger';
    case 'processing':
      return 'bg-warning/15 text-warning';
    case 'shipped':
      return 'bg-secondary/15 text-secondary';
    default:
      return 'bg-warning/15 text-warning'; // Default pending/other fallbacks
  }
};
