import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { MdCheck, MdEmail } from 'react-icons/md';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Loader from '../../components/common/Loader';

export const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all'); // all, read, unread
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchMessages = useCallback(async (page = 1) => {
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
  }, [filter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchMessages]);

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
      <ErrorState
        onRetry={() => {
          setError(null);
          fetchMessages(1);
        }}
      />
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
        <Loader />
      ) : messages.length === 0 ? (
        <EmptyState
          Icon={MdEmail}
          title="Inbox is Empty"
          description="No customer inquiries match this filter."
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                className={`p-6 rounded-2xl border bg-white transition-all duration-200 shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                  !msg.isRead ? 'border-primary/20 bg-primary/1' : 'border-border-color/15'
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

                <div className="shrink-0 flex items-center gap-2 self-end md:self-start">
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
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={fetchMessages}
          />
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
