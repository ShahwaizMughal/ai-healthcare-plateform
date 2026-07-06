import { Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from '../pages/auth/SplashPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import useAuth from '../hooks/useAuth';

// Layout & Dashboard imports
import AdminLayout from '../components/layout/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import ManageDoctors from '../pages/admin/ManageDoctors';
import ManageMedicines from '../pages/admin/ManageMedicines';
import ManageBlogs from '../pages/admin/ManageBlogs';
import ManageAppointments from '../pages/admin/ManageAppointments';
import ManageOrder from '../pages/admin/ManageOrder';
import ManageLabBookings from '../pages/admin/ManageLabBookings';
import ContactMessages from '../pages/admin/ContactMessages';

// Lightweight placeholders for other team members' pages
const HomePlaceholder = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-bg-color flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-surface p-8 rounded-2xl shadow-premium max-w-md w-full border border-border-color/10">
        <h1 className="text-3xl font-bold text-primary font-heading mb-4">MedCare Home</h1>
        <p className="text-text-body mb-2">Welcome back, <strong className="text-text-heading">{user?.fullName}</strong>!</p>
        <p className="text-text-muted text-sm mb-6">Role: {user?.role} | Email: {user?.email}</p>
        <button
          onClick={logout}
          className="bg-danger hover:bg-red-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md cursor-pointer btn-ripple"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Protected Patient/User Pages */}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<HomePlaceholder />} />
        {/* Ad-hoc routes for future components from other members */}
        <Route path="/appointments/my" element={<HomePlaceholder />} />
        <Route path="/orders/my" element={<HomePlaceholder />} />
        <Route path="/cart" element={<HomePlaceholder />} />
        <Route path="/checkout" element={<HomePlaceholder />} />
      </Route>

      {/* Protected Admin-only Pages */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="medicines" element={<ManageMedicines />} />
          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="appointments" element={<ManageAppointments />} />
          <Route path="orders" element={<ManageOrder />} />
          <Route path="lab-bookings" element={<ManageLabBookings />} />
          <Route path="messages" element={<ContactMessages />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
