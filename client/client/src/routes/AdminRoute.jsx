import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

/**
 * Route protection wrapper component for admin-only pages.
 * Redirects unauthorized or patient users away to Login or Home.
 */
export const AdminRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  // Double check both authentication status and the user's role
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if logged in but role is not admin
  if (user && user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
