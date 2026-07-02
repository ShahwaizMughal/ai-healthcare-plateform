import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaUserMd, FaLock, FaEnvelope, FaSpinner } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.fullName}!`);
      
      // Redirect based on user role (patient/user -> /home, admin -> /admin)
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
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
        className="w-full max-w-5xl bg-surface rounded-2xl shadow-premium overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Medical Branding Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle design element */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/5 blur-xl"></div>
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>

          <div className="z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-3 bg-white/10 rounded-xl">
                <FaUserMd className="text-3xl text-accent" />
              </div>
              <span className="text-2xl font-bold tracking-tight font-heading">MedCare</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 leading-tight">
              AI-Powered Healthcare Clinic
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-md font-light leading-relaxed">
              Connect with top specialists, manage appointment schedules, order medical essentials, and access lab services — all in one secured platform.
            </p>
          </div>

          <div className="mt-8 md:mt-0 z-10">
            <div className="border-t border-white/20 pt-6">
              <span className="text-xs text-white/50 tracking-wider uppercase">Emergency Hotline</span>
              <p className="text-xl md:text-2xl font-semibold mt-1 text-accent font-heading">1122 / 911</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Panel */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-text-heading mb-2">Welcome Back</h2>
            <p className="text-text-muted text-sm md:text-base">Please log in to your account to continue</p>
          </div>

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
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm font-sans focus:outline-none transition-all duration-200 ${
                    errors.email 
                      ? 'border-danger focus:ring-1 focus:ring-danger' 
                      : 'border-border-color focus:border-primary focus:ring-2 focus:ring-primary/10'
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

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-text-heading">Password</label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-primary hover:text-primary-dark hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <FaLock />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm font-sans focus:outline-none transition-all duration-200 ${
                    errors.password 
                      ? 'border-danger focus:ring-1 focus:ring-danger' 
                      : 'border-border-color focus:border-primary focus:ring-2 focus:ring-primary/10'
                  }`}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-danger text-xs mt-1 font-sans">{errors.password.message}</p>
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
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-text-muted">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
