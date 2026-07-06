import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdClose, MdShoppingCart, MdVisibility } from 'react-icons/md';

export const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState(null);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/orders?page=${page}&limit=10`);
      setOrders(res?.items || []);
      setPagination({
        page: res?.page || page,
        totalPages: res?.totalPages || 1
      });
    } catch (err) {
      toast.error(err.message || 'Failed to fetch order invoices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      // PATCH /api/admin/orders/:id/status
      await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
      toast.success(`Order fulfillment status updated to ${newStatus}.`);
      fetchOrders(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to transition order status.');
    }
  };

  // Helper for status badge styling
  const getStatusClass = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-warning/15 text-warning';
      case 'shipped':
        return 'bg-secondary/15 text-secondary';
      case 'delivered':
        return 'bg-success/15 text-success';
      case 'cancelled':
        return 'bg-danger/15 text-danger';
      default:
        return 'bg-bg-color border-border-color/30 text-text-muted';
    }
  };

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
        <div className="bg-white p-12 text-center rounded-2xl border border-border-color/15 shadow-sm text-text-muted">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-border-color/15 shadow-sm border-2 border-dashed border-border-color/10">
          <MdShoppingCart size={48} className="mx-auto text-border-color mb-3" />
          <h3 className="font-bold text-text-heading">No Orders Logged</h3>
          <p className="text-text-muted text-sm mt-1">Pharmacy orders will appear here once checked out.</p>
        </div>
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
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-full border border-transparent focus:outline-none focus:border-border-color/30 cursor-pointer ${getStatusClass(ord.status)}`}
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
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={pagination.page === 1}
                onClick={() => fetchOrders(pagination.page - 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-text-muted font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchOrders(pagination.page + 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Details Modal Overlay */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-border-color/10 shadow-premium p-6 space-y-4 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-color/10 flex-shrink-0">
              <h3 className="font-heading font-bold text-text-heading text-lg">Order Invoice Details</h3>
              <button 
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded-full text-text-muted hover:bg-bg-color hover:text-text-heading cursor-pointer"
              >
                <MdClose size={22} />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="space-y-4 text-sm text-text-body overflow-y-auto flex-1 pr-1">
              
              {/* Billing Summary */}
              <div className="bg-bg-color/50 p-4 rounded-xl border border-border-color/5">
                <h4 className="text-xs font-bold text-text-heading uppercase tracking-wider mb-2">Delivery & Billing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <p><span className="text-text-muted">Recipient Name:</span> <strong className="text-text-heading">{viewingOrder.billingName}</strong></p>
                  <p><span className="text-text-muted">Contact Phone:</span> <strong>{viewingOrder.billingPhone}</strong></p>
                  <p className="sm:col-span-2"><span className="text-text-muted">Address:</span> <strong>{viewingOrder.billingAddress}, {viewingOrder.billingCity} ({viewingOrder.billingPostalCode})</strong></p>
                  <p><span className="text-text-muted">Payment Mode:</span> <strong className="uppercase">{viewingOrder.paymentMethod}</strong></p>
                  <p><span className="text-text-muted">Order Date:</span> <strong>{new Date(viewingOrder.createdAt).toLocaleString()}</strong></p>
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
                      {viewingOrder.items?.map((item) => (
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
                        <td className="p-3 text-right text-primary text-sm">${viewingOrder.total}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Registered Account details */}
              {viewingOrder.userId && (
                <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/10">
                  <h4 className="text-xs font-bold text-primary">Registered Account Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2 text-text-body">
                    <p>Name: {viewingOrder.userId.fullName}</p>
                    <p>Phone: {viewingOrder.userId.phone || 'N/A'}</p>
                    <p className="col-span-2">Email: {viewingOrder.userId.email}</p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end pt-3 border-t border-border-color/10 flex-shrink-0">
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Close Invoice
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ManageOrder;
