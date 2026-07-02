import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaSpinner, FaArrowLeft, FaUserMd } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await forgotPassword(data.email);
      toast.success(response.message || 'Reset link request sent.');
      setSubmitted(true);
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link.');
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
          <h2 className="text-2xl font-bold font-heading text-text-heading">Forgot Password</h2>
          <p className="text-text-muted text-sm text-center mt-2 max-w-[280px]">
            No worries! Enter your email and we'll send you a password reset link.
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm leading-relaxed font-sans">
              If that email exists, a password reset link has been successfully dispatched to your inbox. Please check your junk/spam folder if it does not arrive within a few minutes.
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-sm transition-colors"
            >
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email field */}
            <div>
              <label className="block text-sm font-semibold text-text-heading mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm focus:outline-none transition-all duration-200 ${
                    errors.email ? 'border-danger focus:ring-1 focus:ring-danger' : 'border-border-color focus:border-primary focus:ring-2 focus:ring-primary/10'
                  }`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address format',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-danger text-xs mt-1 font-sans">{errors.email.message}</p>
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
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
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
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
