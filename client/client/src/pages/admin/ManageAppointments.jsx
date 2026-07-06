import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdClose, MdEvent, MdVisibility, MdWarning, MdRefresh } from 'react-icons/md';

export const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/admin/appointments?page=${page}&limit=10`);
      setAppointments(res?.items || []);
      setPagination({
        page: res?.page || page,
        totalPages: res?.totalPages || 1
      });
    } catch (err) {
      setError(err.message || 'Could not retrieve appointments records.');
      toast.error('Network Error: Failed to contact the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(1);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/appointments/${id}/status`, { status: newStatus });
      toast.success(`Appointment status updated to ${newStatus}.`);
      fetchAppointments(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to update appointment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper for status badge styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/15 text-success';
      case 'completed':
        return 'bg-primary/15 text-primary';
      case 'cancelled':
        return 'bg-danger/15 text-danger';
      default:
        return 'bg-warning/15 text-warning';
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
          onClick={() => { setError(null); fetchAppointments(1); }}
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
          <h2 className="text-xl font-bold font-heading text-text-heading">Appointment Bookings</h2>
          <p className="text-text-muted text-sm mt-1">Review scheduled clinic consultations, verify medical reasons, and update patient checkout states.</p>
        </div>
      </div>

      {/* Main Table Canvas */}
      {loading ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-border-color/15 shadow-sm text-text-muted">
          Loading appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-border-color/15 shadow-sm border-2 border-dashed border-border-color/10">
          <MdEvent size={48} className="mx-auto text-border-color mb-3" />
          <h3 className="font-bold text-text-heading">No Appointments Scheduled</h3>
          <p className="text-text-muted text-sm mt-1">Patient appointment slots will appear here once booked.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border-color/15 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-color/50 border-b border-border-color/10">
                    <th className="p-4 font-heading font-semibold text-text-heading">Patient Details</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Assigned Doctor</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Appointment Date</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Time Slot</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Status</th>
                    <th className="p-4 font-heading font-semibold text-text-heading text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/10">
                  {appointments.map((appt) => (
                    <tr key={appt._id} className="hover:bg-bg-color/20 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-text-heading">{appt.patientName}</p>
                        <p className="text-xs text-text-muted">Age: {appt.patientAge} | Gen: {appt.patientGender}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-text-heading">
                          {appt.doctorId?.fullName || 'Unassigned Provider'}
                        </p>
                        <p className="text-xs text-text-muted">{appt.doctorId?.specialization || 'General'}</p>
                      </td>
                      <td className="p-4 text-text-body font-medium">
                        {new Date(appt.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="p-4 text-text-body">{appt.timeSlot}</td>
                      <td className="p-4">
                        <select
                          value={appt.status}
                          disabled={updatingId === appt._id}
                          onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border border-transparent focus:outline-none focus:border-border-color/30 cursor-pointer disabled:opacity-50 ${getStatusClass(appt.status)}`}
                        >
                          <option value="pending" className="bg-white text-warning">Pending</option>
                          <option value="confirmed" className="bg-white text-success">Confirmed</option>
                          <option value="completed" className="bg-white text-primary">Completed</option>
                          <option value="cancelled" className="bg-white text-danger">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setViewingAppointment(appt)}
                          className="p-1 hover:bg-bg-color rounded text-text-muted hover:text-primary transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <MdVisibility size={20} />
                        </button>
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
                onClick={() => fetchAppointments(pagination.page - 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-text-muted font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchAppointments(pagination.page + 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Details Modal Overlay */}
      {viewingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-border-color/10 shadow-premium p-6 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-color/10">
              <h3 className="font-heading font-bold text-text-heading text-lg">Appointment Details</h3>
              <button 
                onClick={() => setViewingAppointment(null)}
                className="p-1 rounded-full text-text-muted hover:bg-bg-color hover:text-text-heading cursor-pointer"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4 text-sm text-text-body">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted font-semibold">Patient Name</p>
                  <p className="font-semibold text-text-heading">{viewingAppointment.patientName}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted font-semibold">Patient Contact</p>
                  <p className="font-semibold text-text-heading">{viewingAppointment.patientPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted font-semibold">Age / Gender</p>
                  <p className="text-text-heading">
                    {viewingAppointment.patientAge} years old / {viewingAppointment.patientGender}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted font-semibold">Scheduled Time</p>
                  <p className="text-text-heading">
                    {new Date(viewingAppointment.date).toLocaleDateString(undefined, { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })} at {viewingAppointment.timeSlot}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-text-muted font-semibold">Reason for Visit</p>
                <div className="p-3 bg-bg-color/50 rounded-lg border border-border-color/5 mt-1">
                  {viewingAppointment.reasonForVisit || 'No specific symptoms or reasons reported.'}
                </div>
              </div>

              {viewingAppointment.userId && (
                <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/10">
                  <h4 className="text-xs font-bold text-primary">Registered Account Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2 text-text-body">
                    <p>Name: {viewingAppointment.userId.fullName}</p>
                    <p>Phone: {viewingAppointment.userId.phone || 'N/A'}</p>
                    <p className="col-span-2">Email: {viewingAppointment.userId.email}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end pt-3 border-t border-border-color/10">
              <button
                type="button"
                onClick={() => setViewingAppointment(null)}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageAppointments;
