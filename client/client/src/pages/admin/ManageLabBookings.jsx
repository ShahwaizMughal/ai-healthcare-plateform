import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdBiotech } from 'react-icons/md';

export const ManageLabBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/lab-bookings?page=${page}&limit=10`);
      setBookings(res?.items || []);
      setPagination({
        page: res?.page || page,
        totalPages: res?.totalPages || 1
      });
    } catch (err) {
      toast.error(err.message || 'Failed to fetch laboratory bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // PATCH /api/admin/lab-bookings/:id/status
      await api.patch(`/admin/lab-bookings/${id}/status`, { status: newStatus });
      toast.success(`Lab booking status updated to ${newStatus}.`);
      fetchBookings(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to transition booking status.');
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

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-border-color/15 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-heading text-text-heading">Laboratory Bookings Tracking</h2>
          <p className="text-text-muted text-sm mt-1">Review scheduled diagnostic checks, verify test categories, and manage checkup statuses.</p>
        </div>
      </div>

      {/* Main Table Canvas */}
      {loading ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-border-color/15 shadow-sm text-text-muted">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-border-color/15 shadow-sm border-2 border-dashed border-border-color/10">
          <MdBiotech size={48} className="mx-auto text-border-color mb-3" />
          <h3 className="font-bold text-text-heading">No Lab Bookings Scheduled</h3>
          <p className="text-text-muted text-sm mt-1">Patient lab checkup slots will appear here once booked.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border-color/15 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-color/50 border-b border-border-color/10">
                    <th className="p-4 font-heading font-semibold text-text-heading">Patient Details</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Diagnostic Test</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Appointment Date</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Test Price</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Account Email</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/10">
                  {bookings.map((bk) => (
                    <tr key={bk._id} className="hover:bg-bg-color/20 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-text-heading">{bk.patientName}</p>
                        <p className="text-xs text-text-muted">Phone: {bk.patientPhone}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-text-heading">
                          {bk.labTestId?.name || 'Diagnostic Checkup'}
                        </p>
                        <p className="text-xs text-text-muted">{bk.labTestId?.category || 'General'}</p>
                      </td>
                      <td className="p-4 text-text-body font-medium">
                        {new Date(bk.appointmentDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="p-4 text-text-heading font-bold">
                        ${bk.labTestId?.price || 0}
                      </td>
                      <td className="p-4 text-xs text-text-body">
                        {bk.userId?.email || 'Guest Booking'}
                      </td>
                      <td className="p-4">
                        <select
                          value={bk.status}
                          onChange={(e) => handleStatusChange(bk._id, e.target.value)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border border-transparent focus:outline-none focus:border-border-color/30 cursor-pointer ${getStatusClass(bk.status)}`}
                        >
                          <option value="pending" className="bg-white text-warning">Pending</option>
                          <option value="confirmed" className="bg-white text-success">Confirmed</option>
                          <option value="completed" className="bg-white text-primary">Completed</option>
                          <option value="cancelled" className="bg-white text-danger">Cancelled</option>
                        </select>
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
                onClick={() => fetchBookings(pagination.page - 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-text-muted font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchBookings(pagination.page + 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ManageLabBookings;
