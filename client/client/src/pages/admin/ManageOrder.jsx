import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdShoppingCart, MdVisibility } from 'react-icons/md';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import useAdminFetch from '../../hooks/useAdminFetch';
import { getStatusClass } from '../../utils/helpers';

export const ManageOrder = () => {
  const {
    items: orders,
    pagination,
    loading,
    error,
    setError,
    fetchData: fetchOrders,
  } = useAdminFetch('/admin/orders', 10, 'Could not retrieve orders invoices.');
  const [viewingOrder, setViewingOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Custom confirmation overlays for critical status transitions (cancelled / delivered)
  const [pendingStatusChange, setPendingStatusChange] = useState(null); // { id, status }



  const handleStatusChangeClick = (id, newStatus) => {
    if (newStatus === 'cancelled' || newStatus === 'delivered') {
      setPendingStatusChange({ id, status: newStatus });
    } else {
      executeStatusChange(id, newStatus);
    }
  };

  const executeStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}.`);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
      setPendingStatusChange(null);
    }
  };



  // Connection failure fallback banner
  if (error) {
    return (
      <ErrorState
        message="Could not connect to the pharmacy database server. Please check your network connection and verify if the service is running."
        onRetry={() => {
          setError(null);
          fetchOrders(1);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-border-color/15 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-heading text-text-heading">Pharmacy Orders Dashboard</h2>
          <p className="text-text-muted text-sm mt-1">Track medicine purchases, check invoices, inspect prescription requirements, and manage delivery status.</p>
        </div>
      </div>

      {/* Main Table Canvas */}
      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <EmptyState
          Icon={MdShoppingCart}
          title="No Orders Logged"
          description="Pharmacy orders will appear here once checked out."
        />
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-border-color/15 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-color/50 border-b border-border-color/10">
                    <th className="p-4 font-heading font-semibold text-text-heading">Recipient</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Phone Code</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Items Count</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Invoice Total</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Order Date</th>
                    <th className="p-4 font-heading font-semibold text-text-heading">Status</th>
                    <th className="p-4 font-heading font-semibold text-text-heading text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/10">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-bg-color/20 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold text-text-heading">{ord.billingName}</p>
                        <p className="text-xs text-text-muted">{ord.billingCity}</p>
                      </td>
                      <td className="p-4 text-text-body font-medium">{ord.billingPhone}</td>
                      <td className="p-4 text-text-body">{ord.items?.length || 0} items</td>
                      <td className="p-4 text-text-heading font-bold">${ord.total}</td>
                      <td className="p-4 text-xs text-text-body">
                        {new Date(ord.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          disabled={updatingId === ord._id}
                          onChange={(e) => handleStatusChangeClick(ord._id, e.target.value)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border border-transparent focus:outline-none focus:border-border-color/30 cursor-pointer disabled:opacity-50 ${getStatusClass(ord.status)}`}
                        >
                          <option value="placed" className="bg-white text-text-muted">Placed</option>
                          <option value="processing" className="bg-white text-warning">Processing</option>
                          <option value="shipped" className="bg-white text-secondary">Shipped</option>
                          <option value="delivered" className="bg-white text-success">Delivered</option>
                          <option value="cancelled" className="bg-white text-danger">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setViewingOrder(ord)}
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
            onPageChange={fetchOrders}
          />
        </div>
      )}

      {/* Details Modal Overlay */}
      <Modal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        title="Order Invoice Details"
        maxWidth="max-w-xl"
      >
        <div className="p-6 space-y-4 overflow-y-auto flex-1 pr-1 text-sm text-text-body">
          {/* Billing Summary */}
          <div className="bg-bg-color/50 p-4 rounded-xl border border-border-color/5">
            <h4 className="text-xs font-bold text-text-heading uppercase tracking-wider mb-2">Delivery & Billing</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <p><span className="text-text-muted">Recipient Name:</span> <strong className="text-text-heading">{viewingOrder?.billingName}</strong></p>
              <p><span className="text-text-muted">Contact Phone:</span> <strong>{viewingOrder?.billingPhone}</strong></p>
              <p className="sm:col-span-2"><span className="text-text-muted">Address:</span> <strong>{viewingOrder?.billingAddress}, {viewingOrder?.billingCity} ({viewingOrder?.billingPostalCode})</strong></p>
              <p><span className="text-text-muted">Payment Mode:</span> <strong className="uppercase">{viewingOrder?.paymentMethod}</strong></p>
              <p><span className="text-text-muted">Order Date:</span> <strong>{viewingOrder && new Date(viewingOrder.createdAt).toLocaleString()}</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="text-xs font-bold text-text-heading uppercase tracking-wider mb-2">Order Items</h4>
            <div className="border border-border-color/10 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-color/50 border-b border-border-color/10 font-bold text-text-heading">
                    <th className="p-3">Medicine</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-color/10">
                  {viewingOrder?.items?.map((item) => (
                    <tr key={item._id}>
                      <td className="p-3 font-semibold text-text-heading">{item.name}</td>
                      <td className="p-3 text-right text-text-muted">${item.unitPrice}</td>
                      <td className="p-3 text-center font-medium text-text-body">{item.quantity}</td>
                      <td className="p-3 text-right font-bold text-text-heading">${item.lineTotal}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border-color/15 bg-bg-color/30 font-bold text-text-heading">
                    <td colSpan="3" className="p-3 text-right">Total Invoice Price:</td>
                    <td className="p-3 text-right text-primary text-sm">${viewingOrder?.total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Registered Account details */}
          {viewingOrder?.userId && (
            <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="text-xs font-bold text-primary">Registered Account Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2 text-text-body">
                <p>Name: {viewingOrder.userId.fullName}</p>
                <p>Phone: {viewingOrder.userId.phone || 'N/A'}</p>
                <p className="col-span-2">Email: {viewingOrder.userId.email}</p>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end pt-3 border-t border-border-color/10 shrink-0">
            <button
              type="button"
              onClick={() => setViewingOrder(null)}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Close Invoice
            </button>
          </div>
        </div>
      </Modal>

      {/* Custom status transition safety overlays (cancelled / delivered) */}
      <ConfirmDialog
        isOpen={!!pendingStatusChange}
        onClose={() => setPendingStatusChange(null)}
        onConfirm={() => executeStatusChange(pendingStatusChange.id, pendingStatusChange.status)}
        title="Confirm Status Transition?"
        type="primary"
        description={
          <>
            Are you sure you want to change this order status to <strong className="text-text-heading capitalize">{pendingStatusChange?.status}</strong>? 
            Once updated, this triggers stock logic and affects invoice statistics.
          </>
        }
        confirmText="Confirm Change"
      />

    </div>
  );
};

export default ManageOrder;
