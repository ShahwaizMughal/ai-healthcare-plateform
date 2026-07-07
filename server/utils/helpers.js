/**
 * Converts a text string into a URL-friendly slug.
 *
 * @param {string} text - The input title text
 * @returns {string} Clean, URL-safe slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};
