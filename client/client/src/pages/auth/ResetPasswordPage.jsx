import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaLock, FaSpinner, FaArrowLeft, FaUserMd } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const watchPassword = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await resetPassword(token, data.password, data.confirmPassword);
      toast.success(response.message || 'Password reset successful!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Reset request failed. Link might be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-color p-4 md:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-surface p-6 sm:p-8 rounded-2xl shadow-premium border border-border-color/10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 bg-primary/10 rounded-2xl mb-4">
            <FaUserMd className="text-4xl text-primary" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-text-heading">Reset Password</h2>
          <p className="text-text-muted text-sm text-center mt-2 max-w-[280px]">
            Please enter your new password to regain account access.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password field */}
          <div>
            <label className="block text-sm font-semibold text-text-heading mb-2">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <FaLock />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm focus:outline-none transition-all duration-200 ${
                  errors.password ? 'border-danger focus:ring-1 focus:ring-danger' : 'border-border-color focus:border-primary focus:ring-2 focus:ring-primary/10'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  validate: {
                    hasUpper: (val) => /[A-Z]/.test(val) || 'Password must have at least one uppercase letter',
                    hasLower: (val) => /[a-z]/.test(val) || 'Password must have at least one lowercase letter',
                    hasDigit: (val) => /[0-9]/.test(val) || 'Password must have at least one number',
                  }
                })}
              />
            </div>
            {errors.password && (
              <p className="text-danger text-xs mt-1 font-sans">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password field */}
          <div>
            <label className="block text-sm font-semibold text-text-heading mb-2">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <FaLock />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm focus:outline-none transition-all duration-200 ${
                  errors.confirmPassword ? 'border-danger focus:ring-1 focus:ring-danger' : 'border-border-color focus:border-primary focus:ring-2 focus:ring-primary/10'
                }`}
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (val) => val === watchPassword || 'Passwords do not match',
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-danger text-xs mt-1 font-sans">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer btn-ripple"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin text-lg" />
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-text-muted hover:text-primary font-semibold text-xs transition-colors"
            >
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
