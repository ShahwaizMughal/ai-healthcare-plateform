import Blog from '../models/Blog.js';
import { generateSlug } from '../utils/helpers.js';

/**
 * Creates a new blog post with an auto-generated slug.
 *
 * @param {object} blogData - Blog post attributes
 * @returns {Promise<object>} Created blog document
 */
export const createBlog = async (blogData) => {
  const slug = generateSlug(blogData.title);
  return await Blog.create({
    ...blogData,
    slug,
  });
};

/**
 * Updates an existing blog post and regenerates slug if the title has changed.
 *
 * @param {string} id - Blog ID
 * @param {object} updateData - Update values dictionary
 * @returns {Promise<object|null>} Updated blog document
 */
export const updateBlog = async (id, updateData) => {
  if (updateData.title) {
    updateData.slug = generateSlug(updateData.title);
  }
  return await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

/**
 * Performs soft delete on a blog post by changing its status to draft.
 *
 * @param {string} id - Blog ID
 * @returns {Promise<object|null>} Drafted blog document
 */
export const deleteBlog = async (id) => {
  return await Blog.findByIdAndUpdate(id, { status: 'draft' }, { new: true });
};

/**
 * Retrieves a paginated list of blog articles sorted by creation date (newest first).
 *
 * @param {number} page - Current page number
 * @param {number} limit - Items per page limit
 * @returns {Promise<object>} Paginated result structure
 */
export const getBlogs = async (page = 1, limit = 8) => {
  const skip = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments(),
  ]);

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit) || 1,
  };
};
