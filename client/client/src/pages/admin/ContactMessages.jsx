import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdCheck, MdEmail, MdWarning, MdRefresh } from 'react-icons/md';

export const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/admin/messages?page=${page}&limit=10&status=${filter}`);
      setMessages(res?.items || []);
      setPagination({
        page: res?.page || page,
        totalPages: res?.totalPages || 1
      });
    } catch (err) {
      setError(err.message || 'Could not retrieve inbox messages.');
      toast.error('Network Error: Failed to contact the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [filter]);

  const handleMarkAsRead = async (id) => {
    setTogglingId(id);
    try {
      await api.patch(`/admin/messages/${id}/read`);
      toast.success('Inquiry marked as read.');
      fetchMessages(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to mark message as read.');
    } finally {
      setTogglingId(null);
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
          onClick={() => { setError(null); fetchMessages(1); }}
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
      
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-border-color/15 shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-heading text-text-heading">Patient Support Inbox</h2>
          <p className="text-text-muted text-sm mt-1">Review and manage clinical inquiries submitted via the contact form.</p>
        </div>
        <div className="flex bg-bg-color p-1 rounded-xl border border-border-color/10 self-start sm:self-auto">
          {['all', 'unread', 'read'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setFilter(tab); setPagination({ page: 1, totalPages: 1 }); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === tab 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-muted hover:text-text-heading'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Canvas */}
      {loading ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-border-color/15 shadow-sm text-text-muted">
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-border-color/15 shadow-sm border-2 border-dashed border-border-color/10">
          <MdEmail size={48} className="mx-auto text-border-color mb-3" />
          <h3 className="font-bold text-text-heading">Inbox is Empty</h3>
          <p className="text-text-muted text-sm mt-1">No customer inquiries match this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                className={`p-6 rounded-2xl border bg-white transition-all duration-200 shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                  !msg.isRead ? 'border-primary/20 bg-primary/[0.01]' : 'border-border-color/15'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-text-heading text-sm">{msg.name}</span>
                    <span className="text-xs text-text-muted">({msg.email})</span>
                    <span className="text-xs text-text-muted">| Phone: {msg.phone || 'N/A'}</span>
                  </div>
                  
                  {/* Message body */}
                  <div className="p-4 bg-bg-color/50 rounded-xl border border-border-color/5 text-sm text-text-body leading-relaxed whitespace-pre-wrap">
                    "{msg.message}"
                  </div>

                  {/* Submission date details */}
                  <p className="text-xs text-text-muted">
                    Submitted: {new Date(msg.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 self-end md:self-start">
                  {!msg.isRead ? (
                    <button
                      onClick={() => handleMarkAsRead(msg._id)}
                      disabled={togglingId === msg._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdCheck size={16} />
                      <span>{togglingId === msg._id ? 'Processing...' : 'Mark as Read'}</span>
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-success text-xs font-semibold px-2.5 py-1 bg-success/10 rounded-lg">
                      <MdCheck size={16} />
                      <span>Reviewed</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                disabled={pagination.page === 1}
                onClick={() => fetchMessages(pagination.page - 1)}
                className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
              >
                Previous
              </button>
              <span className="text-xs text-text-muted font-medium">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchMessages(pagination.page + 1)}
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

export default ContactMessages;
