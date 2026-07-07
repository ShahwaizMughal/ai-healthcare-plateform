import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdAdd, MdEdit, MdToggleOn, MdToggleOff, MdClose, MdWarning, MdRefresh } from 'react-icons/md';

export const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Custom Confirmation Dialog Overlay State
  const [confirmDeactivate, setConfirmDeactivate] = useState(null);

  // Form Fields & Validation errors
  const [formData, setFormData] = useState({
    fullName: '',
    specialization: 'Cardiology',
    qualification: '',
    experienceYears: 5,
    profileImageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200',
    bio: '',
    consultationFee: 100,
    availabilityDay: 'Monday',
    availabilityHours: '09:00 AM - 01:00 PM'
  });
  const [validationErrors, setValidationErrors] = useState({});

  const specializationsList = [
    'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 
    'Gynecology', 'Orthopedics', 'General Medicine', 'Psychiatry'
  ];

  const fetchDoctors = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/admin/doctors?page=${page}&limit=8`);
      setDoctors(res?.items || []);
      setPagination({
        page: res?.page || page,
        totalPages: res?.totalPages || 1
      });
    } catch (err) {
      setError(err.message || 'Could not retrieve doctor profiles.');
      toast.error('Network Error: Failed to contact the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errors.fullName = 'Full Name must be at least 3 characters long.';
    }
    if (!formData.qualification.trim()) {
      errors.qualification = 'Qualifications are required.';
    }
    if (parseInt(formData.experienceYears, 10) < 0) {
      errors.experienceYears = 'Experience cannot be negative.';
    }
    if (parseFloat(formData.consultationFee) <= 0) {
      errors.consultationFee = 'Consultation fee must be greater than $0.';
    }
    if (!formData.bio.trim() || formData.bio.trim().length < 20) {
      errors.bio = 'Biography must be at least 20 characters long.';
    }
    if (!formData.availabilityHours.trim()) {
      errors.availabilityHours = 'Availability hours are required.';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setEditingDoctor(null);
    setValidationErrors({});
    setFormData({
      fullName: '',
      specialization: 'Cardiology',
      qualification: '',
      experienceYears: 5,
      profileImageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200',
      bio: '',
      consultationFee: 100,
      availabilityDay: 'Monday',
      availabilityHours: '09:00 AM - 01:00 PM'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (doc) => {
    setEditingDoctor(doc);
    setValidationErrors({});
    const firstAvailability = doc.availability?.[0] || { day: 'Monday', hours: '09:00 AM - 01:00 PM' };
    setFormData({
      fullName: doc.fullName || '',
      specialization: doc.specialization || 'Cardiology',
      qualification: doc.qualification || '',
      experienceYears: doc.experienceYears || 5,
      profileImageUrl: doc.profileImageUrl || '',
      bio: doc.bio || '',
      consultationFee: doc.consultationFee || 100,
      availabilityDay: firstAvailability.day,
      availabilityHours: firstAvailability.hours
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when editing field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please correct the validation errors first.');
      return;
    }

    setSubmitting(true);
    const payload = {
      fullName: formData.fullName.trim(),
      specialization: formData.specialization,
      qualification: formData.qualification.trim(),
      experienceYears: parseInt(formData.experienceYears, 10),
      profileImageUrl: formData.profileImageUrl.trim(),
      bio: formData.bio.trim(),
      consultationFee: parseFloat(formData.consultationFee),
      availability: [
        {
          day: formData.availabilityDay,
          hours: formData.availabilityHours.trim()
        }
      ]
    };

    try {
      if (editingDoctor) {
        await api.put(`/admin/doctors/${editingDoctor._id}`, payload);
        toast.success('Doctor profile updated successfully.');
      } else {
        await api.post('/doctors', payload);
        toast.success('New doctor profile added.');
      }
      setIsModalOpen(false);
      fetchDoctors(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Launch confirmation block on deactivations
  const handleToggleActiveClick = (doc) => {
    if (doc.isActive) {
      setConfirmDeactivate(doc);
    } else {
      executeToggleActive(doc._id, false); // Activate immediately
    }
  };

  const executeToggleActive = async (id, isActive) => {
    try {
      if (isActive) {
        // Soft delete deactivates doctor
        await api.delete(`/doctors/${id}`);
        toast.success('Doctor profile deactivated.');
      } else {
        await api.put(`/doctors/${id}`, { isActive: true });
        toast.success('Doctor profile activated.');
      }
      fetchDoctors(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Status toggle failed.');
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
          onClick={() => { setError(null); fetchDoctors(1); }}
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
          <h2 className="text-xl font-bold font-heading text-text-heading">Manage Doctor Profiles</h2>
          <p className="text-text-muted text-sm mt-1">Register new clinical doctors, configure consultation fees, schedules, and active status.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <MdAdd size={20} />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Main Table Canvas */}
      {loading ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-border-color/15 shadow-sm text-text-muted">
          Loading providers...
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-border-color/15 shadow-sm border-2 border-dashed border-border-color/10">
          <h3 className="font-bold text-text-heading">No Doctor Profiles Found</h3>
          <p className="text-text-muted text-sm mt-1">Click the button above to add the clinic's first provider profile.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border-color/15 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-color/50 border-b border-border-color/10">
                    <th className="p-4 font-heading font-semibold text-text-heading">Doctor</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Specialization</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Consultation Fee</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Schedule Availability</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Status</th>
                    <th className="p-4 font-heading font-semibold text-text-heading text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/10">
                  {doctors.map((doc) => (
                    <tr key={doc._id} className="hover:bg-bg-color/20 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img 
                          src={doc.profileImageUrl || 'https://via.placeholder.com/40'} 
                          alt={doc.fullName} 
                          className="w-10 h-10 rounded-full object-cover border border-border-color/20"
                        />
                        <div>
                          <p className="font-semibold text-text-heading">{doc.fullName}</p>
                          <p className="text-xs text-text-muted">{doc.qualification}</p>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-text-heading">{doc.specialization}</td>
                      <td className="p-4 text-text-body font-semibold">${doc.consultationFee}</td>
                      <td className="p-4 text-xs text-text-body">
                        {doc.availability?.[0] 
                          ? `${doc.availability[0].day}: ${doc.availability[0].hours}` 
                          : 'No hours set'}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          doc.isActive ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
                        }`}>
                          {doc.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openEditModal(doc)}
                            className="p-1 hover:bg-bg-color rounded text-text-muted hover:text-primary transition-colors cursor-pointer"
                            title="Edit Profile"
                          >
                            <MdEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleToggleActiveClick(doc)}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              doc.isActive ? 'text-success hover:text-danger' : 'text-danger hover:text-success'
                            }`}
                            title={doc.isActive ? 'Deactivate Doctor' : 'Activate Doctor'}
                          >
                            {doc.isActive ? <MdToggleOn size={28} /> : <MdToggleOff size={28} />}
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
                onClick={() => fetchDoctors(pagination.page - 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-text-muted font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchDoctors(pagination.page + 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Profile Form Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-border-color/10 shadow-premium flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border-color/10 flex items-center justify-between">
              <h3 className="font-heading font-bold text-text-heading text-lg">
                {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor Profile'}
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
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                      validationErrors.fullName ? 'border-danger focus:border-danger' : 'border-border-color/30'
                    }`}
                    placeholder="e.g. Dr. Jane Smith"
                  />
                  {validationErrors.fullName && (
                    <p className="text-[11px] text-danger font-semibold">{validationErrors.fullName}</p>
                  )}
                </div>

                {/* Specialization */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Specialization</label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-border-color/30 rounded-lg focus:outline-none focus:border-primary bg-white"
                  >
                    {specializationsList.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Qualification */}
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-semibold text-text-heading">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    required
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                      validationErrors.qualification ? 'border-danger focus:border-danger' : 'border-border-color/30'
                    }`}
                    placeholder="e.g. MBBS, MD"
                  />
                  {validationErrors.qualification && (
                    <p className="text-[11px] text-danger font-semibold">{validationErrors.qualification}</p>
                  )}
                </div>

                {/* Experience */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Experience (Years)</label>
                  <input
                    type="number"
                    name="experienceYears"
                    required
                    min={0}
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                      validationErrors.experienceYears ? 'border-danger focus:border-danger' : 'border-border-color/30'
                    }`}
                  />
                  {validationErrors.experienceYears && (
                    <p className="text-[11px] text-danger font-semibold">{validationErrors.experienceYears}</p>
                  )}
                </div>

                {/* Consultation Fee */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-heading">Consultation Fee ($)</label>
                  <input
                    type="number"
                    name="consultationFee"
                    required
                    min={0}
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary ${
                      validationErrors.consultationFee ? 'border-danger focus:border-danger' : 'border-border-color/30'
                    }`}
                  />
                  {validationErrors.consultationFee && (
                    <p className="text-[11px] text-danger font-semibold">{validationErrors.consultationFee}</p>
                  )}
                </div>
              </div>

              {/* Profile Image URL */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-heading">Profile Image URL</label>
                <input
                  type="text"
                  name="profileImageUrl"
                  required
                  value={formData.profileImageUrl}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-border-color/30 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Bio Details */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-heading">Biography / Experience Info</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:border-primary resize-none ${
                    validationErrors.bio ? 'border-danger focus:border-danger' : 'border-border-color/30'
                  }`}
                  placeholder="Tell patients about their expertise..."
                />
                {validationErrors.bio && (
                  <p className="text-[11px] text-danger font-semibold">{validationErrors.bio}</p>
                )}
              </div>

              {/* Availability Slots */}
              <div className="bg-bg-color/50 p-4 rounded-xl border border-border-color/5 space-y-3">
                <h4 className="text-xs font-bold text-text-heading">Default Weekly Availability Slot</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-text-muted">Available Day</label>
                    <select
                      name="availabilityDay"
                      value={formData.availabilityDay}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-1.5 text-xs border border-border-color/30 rounded-lg focus:outline-none bg-white"
                    >
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-text-muted">Available Hours</label>
                    <input
                      type="text"
                      name="availabilityHours"
                      required
                      value={formData.availabilityHours}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-1.5 text-xs border border-border-color/30 rounded-lg focus:outline-none bg-white"
                      placeholder="e.g. 09:00 AM - 01:00 PM"
                    />
                  </div>
                </div>
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
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-sm disabled:opacity-75 flex items-center gap-1.5"
                >
                  {submitting ? 'Processing...' : editingDoctor ? 'Save Changes' : 'Register Doctor'}
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
              <h3 className="font-heading font-bold text-text-heading text-lg">Deactivate Doctor Profile?</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Are you sure you want to deactivate <strong className="text-text-heading">{confirmDeactivate.fullName}</strong>? 
                This hides their profile from searches and prevents patients from booking slots.
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
                Deactivate Provider
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageDoctors;
