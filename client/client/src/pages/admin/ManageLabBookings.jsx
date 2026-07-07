import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdBiotech } from 'react-icons/md';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import useAdminFetch from '../../hooks/useAdminFetch';
import { getStatusClass } from '../../utils/helpers';

export const ManageLabBookings = () => {
  const {
    items: bookings,
    pagination,
    loading,
    error,
    setError,
    fetchData: fetchBookings,
  } = useAdminFetch('/admin/lab-bookings', 10, 'Could not retrieve laboratory bookings.');
  const [updatingId, setUpdatingId] = useState(null);



  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/lab-bookings/${id}/status`, { status: newStatus });
      toast.success(`Lab booking status updated to ${newStatus}.`);
      fetchBookings(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to update lab booking status.');
    } finally {
      setUpdatingId(null);
    }
  };



  // Connection failure fallback banner
  if (error) {
    return (
      <ErrorState
        message="Could not connect to the laboratory database server. Please check your network connection and verify if the service is running."
        onRetry={() => {
          setError(null);
          fetchBookings(1);
        }}
      />
    );
  }

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
        <Loader />
      ) : bookings.length === 0 ? (
        <EmptyState
          Icon={MdBiotech}
          title="No Lab Bookings Scheduled"
          description="Patient lab checkup slots will appear here once booked."
        />
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
                          disabled={updatingId === bk._id}
                          onChange={(e) => handleStatusChange(bk._id, e.target.value)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border border-transparent focus:outline-none focus:border-border-color/30 cursor-pointer disabled:opacity-50 ${getStatusClass(bk.status)}`}
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
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={fetchBookings}
          />
        </div>
      )}

    </div>
  );
};

export default ManageLabBookings;
