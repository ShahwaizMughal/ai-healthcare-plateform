import { Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from '../pages/auth/SplashPage';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import useAuth from '../hooks/useAuth';

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

const AdminPlaceholder = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-bg-color flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-surface p-8 rounded-2xl shadow-premium max-w-md w-full border border-border-color/10">
        <h1 className="text-3xl font-bold text-secondary font-heading mb-4">Admin Dashboard</h1>
        <p className="text-text-body mb-2 font-semibold">Welcome, Administrator {user?.fullName}!</p>
        <p className="text-text-muted text-sm mb-6">Restricted access control dashboard.</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={logout}
            className="bg-danger hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center font-sans bg-bg-color">
    <h1 className="text-6xl font-bold text-primary font-heading mb-4">404</h1>
    <p className="text-text-body mb-6 text-lg">Page not found.</p>
    <Link to="/" className="bg-primary text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-primary-dark transition-colors">
      Go Home
    </Link>
  </div>
);

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
        <Route path="/admin/*" element={<AdminPlaceholder />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

import { Link } from 'react-router-dom';

export default AppRoutes;
