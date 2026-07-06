import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdToggleOn, MdToggleOff, MdClose, MdWarning, MdRefresh } from 'react-icons/md';

export const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Custom Deactivation modal overlays
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);

  // Form Fields & Validation errors
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dosage: '',
    category: 'Analgesics',
    price: 10,
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200',
    stockQuantity: 100,
    requiresPrescription: false
  });
  const [validationErrors, setValidationErrors] = useState({});

  const categoriesList = [
    'Analgesics', 'Antibiotics', 'Antiviral', 'Cardiovascular', 
    'Antihistamines', 'Vitamins & Supplements', 'Diabetes', 'Other'
  ];

  const fetchMedicines = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/admin/medicines?page=${page}&limit=8`);
      setMedicines(res?.items || []);
      setPagination({
        page: res?.page || page,
        totalPages: res?.totalPages || 1
      });
    } catch (err) {
      setError(err.message || 'Could not retrieve catalog inventory.');
      toast.error('Network Error: Failed to contact the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines(1);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Medicine Name is required and must be at least 2 letters.';
    }
    if (!formData.dosage.trim()) {
      errors.dosage = 'Dosage format is required (e.g. 500mg, 10ml).';
    }
    if (parseFloat(formData.price) < 0) {
      errors.price = 'Unit price cannot be negative.';
    }
    if (parseInt(formData.stockQuantity, 10) < 0) {
      errors.stockQuantity = 'Inventory stock quantity cannot be negative.';
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setEditingMedicine(null);
    setValidationErrors({});
    setFormData({
      name: '',
      description: '',
      dosage: '',
      category: 'Analgesics',
      price: 10,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=200',
      stockQuantity: 100,
      requiresPrescription: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (med) => {
    setEditingMedicine(med);
    setValidationErrors({});
    setFormData({
      name: med.name || '',
      description: med.description || '',
      dosage: med.dosage || '',
      category: med.category || 'Analgesics',
      price: med.price || 10,
      imageUrl: med.imageUrl || '',
      stockQuantity: med.stockQuantity || 100,
      requiresPrescription: med.requiresPrescription || false
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please resolve the catalog warnings first.');
      return;
    }

    setSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      dosage: formData.dosage.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl.trim(),
      stockQuantity: parseInt(formData.stockQuantity, 10),
      requiresPrescription: formData.requiresPrescription
    };

    try {
      if (editingMedicine) {
        await api.put(`/admin/medicines/${editingMedicine._id}`, payload);
        toast.success('Medicine catalog item updated.');
      } else {
        await api.post('/medicines', payload);
        toast.success('New medicine catalog item added.');
      }
      setIsModalOpen(false);
      fetchMedicines(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActiveClick = (med) => {
    if (med.isActive) {
      setConfirmDeactivate(med);
    } else {
      executeToggleActive(med._id, false); // Activate immediately
    }
  };

  const executeToggleActive = async (id, isActive) => {
    try {
      if (isActive) {
        await api.delete(`/medicines/${id}`);
        toast.success('Medicine catalogue item deactivated.');
      } else {
        await api.put(`/medicines/${id}`, { isActive: true });
        toast.success('Medicine catalogue item activated.');
      }
      fetchMedicines(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Status toggle failed.');
    } finally {
      setConfirmDeactivate(null);
    }
  };

  const renderStockBadge = (qty) => {
    if (qty === 0) {
      return (
        <span className="flex items-center gap-1 text-danger font-bold text-xs bg-red-50 px-2 py-0.5 rounded-lg w-max">
          <MdWarning size={14} />
          <span>Out of Stock</span>
        </span>
      );
    }
    if (qty < 15) {
      return (
        <span className="flex items-center gap-1 text-warning font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-lg w-max">
          <MdWarning size={14} />
          <span>Low Stock ({qty})</span>
        </span>
      );
    }
    return <span className="text-text-body font-medium">{qty} units</span>;
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
          onClick={() => { setError(null); fetchMedicines(1); }}
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
          <h2 className="text-xl font-bold font-heading text-text-heading">Pharmacy Catalog Manager</h2>
          <p className="text-text-muted text-sm mt-1">Manage medicine items list, update inventory stock, set price levels, and enforce prescription requirements.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <MdAdd size={20} />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Main Table Canvas */}
      {loading ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-border-color/15 shadow-sm text-text-muted">
          Loading catalog...
        </div>
      ) : medicines.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-border-color/15 shadow-sm border-2 border-dashed border-border-color/10">
          <h3 className="font-bold text-text-heading">No Medicines Found</h3>
          <p className="text-text-muted text-sm mt-1">Click the button above to seed the pharmacy store catalog.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border-color/15 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-color/50 border-b border-border-color/10">
                    <th className="p-4 font-heading font-semibold text-text-heading">Medicine</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Category</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Dosage</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Price</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Stock Level</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Prescription</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Status</th>
                    <th className="p-4 font-heading font-semibold text-text-heading text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/10">
                  {medicines.map((med) => (
                    <tr key={med._id} className="hover:bg-bg-color/20 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img 
                          src={med.imageUrl || 'https://via.placeholder.com/40'} 
                          alt={med.name} 
                          className="w-10 h-10 rounded-lg object-cover border border-border-color/20"
                        />
                        <div>
                          <p className="font-semibold text-text-heading">{med.name}</p>
                          <p className="text-xs text-text-muted truncate max-w-[180px]">{med.description}</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-text-heading">{med.category}</td>
                      <td className="p-4 text-text-body">{med.dosage}</td>
                      <td className="p-4 text-text-body font-semibold">${med.price}</td>
                      <td className="p-4">{renderStockBadge(med.stockQuantity)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                          med.requiresPrescription ? 'bg-danger/15 text-danger' : 'bg-success/15 text-success'
                        }`}>
                          {med.requiresPrescription ? 'Rx Required' : 'OTC'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          med.isActive ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                        }`}>
                          {med.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openEditModal(med)}
                            className="p-1 hover:bg-bg-color rounded text-text-muted hover:text-primary transition-colors cursor-pointer"
                            title="Edit Catalog Details"
                          >
                            <MdEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleToggleActiveClick(med)}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              med.isActive ? 'text-success hover:text-danger' : 'text-danger hover:text-success'
                            }`}
                            title={med.isActive ? 'Deactivate item' : 'Activate item'}
                          >
                            {med.isActive ? <MdToggleOn size={28} /> : <MdToggleOff size={28} />}
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
                onClick={() => fetchMedicines(pagination.page - 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-text-muted font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchMedicines(pagination.page + 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Catalog Entry Form Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-border-color/10 shadow-premium flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border-color/10 flex items-center justify-between">
              <h3 className="font-heading font-bold text-text-heading text-lg">
                {editingMedicine ? 'Edit Catalog Entry' : 'Add Catalog Medicine'}
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Medicine Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                      validationErrors.name ? 'border-danger focus:border-danger' : 'border-border-color/30'
                    }`}
                    placeholder="e.g. Paracetamol"
                  />
                  {validationErrors.name && (
                    <p className="text-[11px] text-danger font-semibold">{validationErrors.name}</p>
                  )}
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
                {/* Dosage */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Dosage Format</label>
                  <input
                    type="text"
                    name="dosage"
                    required
                    value={formData.dosage}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                      validationErrors.dosage ? 'border-danger focus:border-danger' : 'border-border-color/30'
                    }`}
                    placeholder="e.g. 500mg Tablet"
                  />
                  {validationErrors.dosage && (
                    <p className="text-[11px] text-danger font-semibold">{validationErrors.dosage}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Unit Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    required
                    step="0.01"
                    min={0}
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                      validationErrors.price ? 'border-danger focus:border-danger' : 'border-border-color/30'
                    }`}
                  />
                  {validationErrors.price && (
                    <p className="text-[11px] text-danger font-semibold">{validationErrors.price}</p>
                  )}
                </div>

                {/* Stock Quantity */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Initial Stock Volume</label>
                  <input
                    type="number"
                    name="stockQuantity"
                    required
                    min={0}
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                      validationErrors.stockQuantity ? 'border-danger focus:border-danger' : 'border-border-color/30'
                    }`}
                  />
                  {validationErrors.stockQuantity && (
                    <p className="text-[11px] text-danger font-semibold">{validationErrors.stockQuantity}</p>
                  )}
                </div>
              </div>

              {/* Medicine Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-heading">Medicine Catalog Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  required
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-border-color/30 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Description Details */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-heading">Description / Indications</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary resize-none ${
                    validationErrors.description ? 'border-danger focus:border-danger' : 'border-border-color/30'
                  }`}
                  placeholder="Relieves pain, reduces fever, typical usage details..."
                />
                {validationErrors.description && (
                  <p className="text-[11px] text-danger font-semibold">{validationErrors.description}</p>
                )}
              </div>

              {/* Requires Prescription Toggle */}
              <div className="flex items-center gap-3 p-3 bg-bg-color/50 rounded-xl border border-border-color/5">
                <input
                  type="checkbox"
                  id="requiresPrescription"
                  name="requiresPrescription"
                  checked={formData.requiresPrescription}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary border-border-color rounded focus:ring-primary focus:ring-opacity-50 cursor-pointer animate-none"
                />
                <label htmlFor="requiresPrescription" className="text-xs font-semibold text-text-heading cursor-pointer">
                  Requires prescription upload during patient checkout flow (Rx)
                </label>
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
                  {submitting ? 'Processing...' : editingMedicine ? 'Save Changes' : 'Catalog Medicine'}
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
              <h3 className="font-heading font-bold text-text-heading text-lg">Deactivate Catalog Item?</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Are you sure you want to deactivate <strong className="text-text-heading">{confirmDeactivate.name}</strong>? 
                Deactivating this item hides it from the catalog store and prevents patients from purchasing it.
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
                onClick={() => executeToggleActive(confirmDeactivate._id, true)}
                className="px-4.5 py-2 bg-danger hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-sm"
              >
                Deactivate Item
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageMedicines;
