import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdEvent, MdVisibility } from 'react-icons/md';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import useAdminFetch from '../../hooks/useAdminFetch';
import { getStatusClass } from '../../utils/helpers';

export const ManageAppointments = () => {
  const {
    items: appointments,
    pagination,
    loading,
    error,
    setError,
    fetchData: fetchAppointments,
  } = useAdminFetch('/admin/appointments', 10, 'Could not retrieve appointments records.');
  const [viewingAppointment, setViewingAppointment] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);



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



  // Connection failure fallback banner
  if (error) {
    return (
      <ErrorState
        onRetry={() => {
          setError(null);
          fetchAppointments(1);
        }}
      />
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
        <Loader />
      ) : appointments.length === 0 ? (
        <EmptyState
          Icon={MdEvent}
          title="No Appointments Scheduled"
          description="Patient appointment slots will appear here once booked."
        />
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
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={fetchAppointments}
          />
        </div>
      )}

      {/* Details Modal Overlay */}
      <Modal
        isOpen={!!viewingAppointment}
        onClose={() => setViewingAppointment(null)}
        title="Appointment Details"
        maxWidth="max-w-lg"
      >
        <div className="p-6 space-y-4">
          {/* Modal Content */}
          <div className="space-y-4 text-sm text-text-body">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted font-semibold">Patient Name</p>
                <p className="font-semibold text-text-heading">{viewingAppointment?.patientName}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-semibold">Patient Contact</p>
                <p className="font-semibold text-text-heading">{viewingAppointment?.patientPhone}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-semibold">Age / Gender</p>
                <p className="text-text-heading">
                  {viewingAppointment?.patientAge} years old / {viewingAppointment?.patientGender}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted font-semibold">Scheduled Time</p>
                <p className="text-text-heading">
                  {viewingAppointment && new Date(viewingAppointment.date).toLocaleDateString(undefined, { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} at {viewingAppointment?.timeSlot}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs text-text-muted font-semibold">Reason for Visit</p>
              <div className="p-3 bg-bg-color/50 rounded-lg border border-border-color/5 mt-1">
                {viewingAppointment?.reasonForVisit || 'No specific symptoms or reasons reported.'}
              </div>
            </div>

            {viewingAppointment?.userId && (
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
      </Modal>

    </div>
  );
};

export default ManageAppointments;
