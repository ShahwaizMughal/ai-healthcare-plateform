import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdToggleOn, MdToggleOff, MdClose, MdWarning, MdBook, MdRefresh } from 'react-icons/md';

export const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Custom Deactivation confirmation overlays
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);

  // Form Fields & Validation errors
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Nutrition',
    author: 'Chief Medical Editor',
    coverImageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=300',
    summary: '',
    content: '',
    status: 'draft'
  });
  const [validationErrors, setValidationErrors] = useState({});

  const categoriesList = [
    'Nutrition', 'Fitness', 'Mental Health', 'Preventative Care', 
    'Medical Innovation', 'Family Health', 'Other'
  ];

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/admin/blogs?page=${page}&limit=8`);
      setBlogs(res?.items || []);
      setPagination({
        page: res?.page || page,
        totalPages: res?.totalPages || 1
      });
    } catch (err) {
      setError(err.message || 'Could not retrieve publication articles.');
      toast.error('Network Error: Failed to contact the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, []);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e) => {
    const titleVal = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: titleVal,
      slug: generateSlug(titleVal)
    }));
    if (validationErrors.title) {
      setValidationErrors(prev => ({ ...prev, title: null }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim() || formData.title.trim().length < 10) {
      errors.title = 'Title must be at least 10 characters long.';
    }
    if (!formData.author.trim()) {
      errors.author = 'Author name is required.';
    }
    if (!formData.summary.trim() || formData.summary.trim().length < 15) {
      errors.summary = 'Summary excerpt must be at least 15 characters long.';
    }
    if (!formData.content.trim() || formData.content.trim().length < 50) {
      errors.content = 'Article content must be at least 50 characters long.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setEditingBlog(null);
    setValidationErrors({});
    setFormData({
      title: '',
      slug: '',
      category: 'Nutrition',
      author: 'Chief Medical Editor',
      coverImageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=300',
      summary: '',
      content: '',
      status: 'draft'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setValidationErrors({});
    setFormData({
      title: blog.title || '',
      slug: blog.slug || '',
      category: blog.category || 'Nutrition',
      author: blog.author || 'Chief Medical Editor',
      coverImageUrl: blog.coverImageUrl || '',
      summary: blog.summary || '',
      content: blog.content || '',
      status: blog.status || 'draft'
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the validation errors first.');
      return;
    }

    setSubmitting(true);
    const payload = {
      title: formData.title.trim(),
      slug: formData.slug,
      category: formData.category,
      author: formData.author.trim(),
      coverImageUrl: formData.coverImageUrl.trim(),
      summary: formData.summary.trim(),
      content: formData.content.trim(),
      status: formData.status
    };

    try {
      if (editingBlog) {
        await api.put(`/admin/blogs/${editingBlog._id}`, payload);
        toast.success('Blog publication updated.');
      } else {
        await api.post('/blogs', payload);
        toast.success('New blog post created.');
      }
      setIsModalOpen(false);
      fetchBlogs(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatusClick = (blog) => {
    if (blog.status === 'published') {
      setConfirmDeactivate(blog);
    } else {
      executeToggleStatus(blog._id, 'draft'); // Publish immediately
    }
  };

  const executeToggleStatus = async (id, currentStatus) => {
    try {
      if (currentStatus === 'published') {
        await api.delete(`/blogs/${id}`);
        toast.success('Blog post status reverted to Draft.');
      } else {
        await api.put(`/blogs/${id}`, { status: 'published' });
        toast.success('Blog post published successfully.');
      }
      fetchBlogs(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Status update failed.');
    } finally {
      setConfirmDeactivate(null);
    }
  };

  // Connection failure fallback banner
  if (error) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-danger/25 shadow-sm max-w-lg mx-auto my-8 space-y-4">
        <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center text-danger mx-auto">
          <MdWarning size={32} />
        </div>
        <h3 className="font-heading font-bold text-text-heading text-lg">Connection Failure</h3>
        <p className="text-text-muted text-sm leading-relaxed">
          Could not connect to the clinical database server. Please check your network connection and verify if the service is running.
        </p>
        <button
          onClick={() => { setError(null); fetchBlogs(1); }}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer mx-auto"
        >
          <MdRefresh size={16} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-border-color/15 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-heading text-text-heading">Health Blog Publisher</h2>
          <p className="text-text-muted text-sm mt-1">Publish clinical guides, patient newsletters, medical research findings, and toggle draft status.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <MdAdd size={20} />
          <span>Write Blog Post</span>
        </button>
      </div>

      {/* Main Table Canvas */}
      {loading ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-border-color/15 shadow-sm text-text-muted">
          Loading publications...
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-border-color/15 shadow-sm border-2 border-dashed border-border-color/10">
          <MdBook size={48} className="mx-auto text-border-color mb-3" />
          <h3 className="font-bold text-text-heading">No Publications Found</h3>
          <p className="text-text-muted text-sm mt-1">Click the button above to publish your first medical health blog post.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border-color/15 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-color/50 border-b border-border-color/10">
                    <th className="p-4 font-heading font-semibold text-text-heading">Article Details</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Category</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Author</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Publish Date</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Status</th>
                    <th className="p-4 font-heading font-semibold text-text-heading text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/10">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-bg-color/20 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img 
                          src={blog.coverImageUrl || 'https://via.placeholder.com/60x40'} 
                          alt={blog.title} 
                          className="w-14 h-9 rounded object-cover border border-border-color/20 flex-shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-text-heading line-clamp-1">{blog.title}</p>
                          <p className="text-xs text-text-muted">Slug: {blog.slug}</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-text-heading">{blog.category}</td>
                      <td className="p-4 text-text-body">{blog.author}</td>
                      <td className="p-4 text-xs text-text-body">
                        {new Date(blog.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          blog.status === 'published' ? 'bg-success/15 text-success' : 'bg-text-muted/15 text-text-muted'
                        }`}>
                          {blog.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openEditModal(blog)}
                            className="p-1 hover:bg-bg-color rounded text-text-muted hover:text-primary transition-colors cursor-pointer"
                            title="Edit Blog"
                          >
                            <MdEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleToggleStatusClick(blog)}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              blog.status === 'published' ? 'text-success hover:text-danger' : 'text-danger hover:text-success'
                            }`}
                            title={blog.status === 'published' ? 'Revert to Draft' : 'Publish Article'}
                          >
                            {blog.status === 'published' ? <MdToggleOn size={28} /> : <MdToggleOff size={28} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={pagination.page === 1}
                onClick={() => fetchBlogs(pagination.page - 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-text-muted font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchBlogs(pagination.page + 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Editor Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-border-color/10 shadow-premium flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border-color/10 flex items-center justify-between">
              <h3 className="font-heading font-bold text-text-heading text-lg">
                {editingBlog ? 'Edit Blog Publication' : 'Create New Blog Post'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-text-muted hover:bg-bg-color hover:text-text-heading cursor-pointer"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* Modal Form Scrollable Canvas */}
            <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-heading">Blog Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                    validationErrors.title ? 'border-danger focus:border-danger' : 'border-border-color/30'
                  }`}
                  placeholder="e.g. 10 Tips for Cardiovascular Health"
                />
                {validationErrors.title && (
                  <p className="text-[11px] text-danger font-semibold">{validationErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Generated Slug */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Slug URI Link (Auto-Generated)</label>
                  <input
                    type="text"
                    name="slug"
                    readOnly
                    value={formData.slug}
                    className="w-full px-3 py-2 text-sm border border-border-color/20 bg-bg-color/50 rounded-lg text-text-muted focus:outline-none cursor-not-allowed"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-border-color/30 rounded-lg focus:outline-none focus:border-primary bg-white"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Author */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-text-heading">Author Name</label>
                  <input
                    type="text"
                    name="author"
                    required
                    value={formData.author}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                      validationErrors.author ? 'border-danger focus:border-danger' : 'border-border-color/30'
                    }`}
                  />
                  {validationErrors.author && (
                    <p className="text-[11px] text-danger font-semibold">{validationErrors.author}</p>
                  )}
                </div>

                {/* Status Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Initial Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-border-color/30 rounded-lg focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-heading">Cover Image Link URL</label>
                <input
                  type="text"
                  name="coverImageUrl"
                  required
                  value={formData.coverImageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-border-color/30 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Summary Excerpt */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-heading">Short Excerpt Summary</label>
                <input
                  type="text"
                  name="summary"
                  required
                  value={formData.summary}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                    validationErrors.summary ? 'border-danger focus:border-danger' : 'border-border-color/30'
                  }`}
                  placeholder="Provide a quick 1-sentence synopsis of the article..."
                />
                {validationErrors.summary && (
                  <p className="text-[11px] text-danger font-semibold">{validationErrors.summary}</p>
                )}
              </div>

              {/* Full Content */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-heading">Article Content (Markdown supported)</label>
                <textarea
                  name="content"
                  rows={6}
                  required
                  value={formData.content}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary resize-none font-mono ${
                    validationErrors.content ? 'border-danger focus:border-danger' : 'border-border-color/30'
                  }`}
                  placeholder="Write the full health guide or medical update content here..."
                />
                {validationErrors.content && (
                  <p className="text-[11px] text-danger font-semibold">{validationErrors.content}</p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-color/10">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-sm disabled:opacity-75"
                >
                  {submitting ? 'Publishing...' : editingBlog ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Custom absolute-overlay confirmation modal for Deactivations */}
      {confirmDeactivate && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-border-color/10 shadow-premium p-6 space-y-4 text-center">
            <div className="w-14 h-14 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto">
              <MdWarning size={28} />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-heading font-bold text-text-heading text-lg">Revert Article to Draft?</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Are you sure you want to revert <strong className="text-text-heading">"{confirmDeactivate.title}"</strong> to draft? 
                This will unpublish the article and hide it from the patient blog feed index.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setConfirmDeactivate(null)}
                className="px-4.5 py-2 border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => executeToggleStatus(confirmDeactivate._id, 'published')}
                className="px-4.5 py-2 bg-danger hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-sm"
              >
                Revert to Draft
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageBlogs;
