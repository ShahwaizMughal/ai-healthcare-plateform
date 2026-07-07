import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * Custom React hook for fetching paginated admin data from a specific API endpoint.
 *
 * @param {string} endpoint - The target API route (e.g. '/admin/doctors')
 * @param {number} [limit=8] - The default items count per page
 * @param {string} [errorMessage='Could not retrieve database records.'] - Custom query fallback text
 */
export const useAdminFetch = (endpoint, limit = 8, errorMessage = 'Could not retrieve database records.') => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`${endpoint}?page=${page}&limit=${limit}`);
      setItems(res?.items || []);
      setPagination({
        page: res?.page || page,
        totalPages: res?.totalPages || 1,
      });
    } catch (err) {
      setError(err.message || errorMessage);
      toast.error('Network Error: Failed to contact the server.');
    } finally {
      setLoading(false);
    }
  }, [endpoint, limit, errorMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  return {
    items,
    setItems,
    pagination,
    loading,
    error,
    setError,
    fetchData,
  };
};

export default useAdminFetch;
