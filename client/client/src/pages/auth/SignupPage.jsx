import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSpinner, FaUserMd } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

export const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    }
  });

  const watchPassword = watch('password', '');

  // Dynamic Password Strength Calculation (SRS Section 5.1/12.3 visual aid)
  const getPasswordStrength = (password) => {
    if (!password) return { label: '', color: 'bg-gray-200', width: 'w-0', score: 0 };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    
    if (score <= 1) return { label: 'Weak', color: 'bg-danger', width: 'w-1/4', score };
    if (score === 2) return { label: 'Fair', color: 'bg-warning', width: 'w-2/4', score };
    if (score === 3) return { label: 'Good', color: 'bg-blue-400', width: 'w-3/4', score };
    return { label: 'Strong', color: 'bg-success', width: 'w-full', score };
  };

  const strength = getPasswordStrength(watchPassword);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await signup(data.fullName, data.email, data.phone, data.password);
      toast.success(`Account created successfully! Welcome, ${user.fullName}`);
      navigate('/home');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
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
        className="w-full max-w-5xl bg-surface rounded-2xl shadow-premium overflow-hidden flex flex-col md:flex-row-reverse"
      >
        {/* Left Side: Medical Branding Panel (Reversed layout for Signup for nice visual layout variety) */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 blur-xl"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>

          <div className="z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-3 bg-white/10 rounded-xl">
                <FaUserMd className="text-3xl text-accent" />
              </div>
              <span className="text-2xl font-bold tracking-tight font-heading">MedCare</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 leading-tight">
              Create Your Patient Account
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-md font-light leading-relaxed">
              Register to schedule consults with top physicians, view laboratory metrics, buy verified medication online, and log emergency profiles safely.
            </p>
          </div>

          <div className="mt-8 md:mt-0 z-10">
            <div className="border-t border-white/20 pt-6">
              <span className="text-xs text-white/50 tracking-wider uppercase">Safe & Encrypted</span>
              <p className="text-sm mt-1 text-accent font-sans">Your health information and records are protected by certified MERN encryption standards.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form Panel */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-text-heading mb-2">Get Started</h2>
            <p className="text-text-muted text-sm md:text-base">Register in seconds as a clinic patient</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name field */}
            <div>
              <label className="block text-sm font-semibold text-text-heading mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <FaUser />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-sans focus:outline-none transition-all duration-200 ${
                    errors.fullName ? 'border-danger focus:ring-1 focus:ring-danger' : 'border-border-color focus:border-primary focus:ring-2 focus:ring-primary/10'
                  }`}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                    maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: 'Full name must contain letters and spaces only',
                    }
                  })}
                />
              </div>
              {errors.fullName && (
                <p className="text-danger text-xs mt-1 font-sans">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-semibold text-text-heading mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-sans focus:outline-none transition-all duration-200 ${
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

            {/* Phone Number field */}
            <div>
              <label className="block text-sm font-semibold text-text-heading mb-1.5">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <FaPhone />
                </div>
                <input
                  type="tel"
                  placeholder="e.g. 03001234567"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-sans focus:outline-none transition-all duration-200 ${
                    errors.phone ? 'border-danger focus:ring-1 focus:ring-danger' : 'border-border-color focus:border-primary focus:ring-2 focus:ring-primary/10'
                  }`}
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[0-9]{10,15}$/,
                      message: 'Phone must be between 10 to 15 digits',
                    }
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-danger text-xs mt-1 font-sans">{errors.phone.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-semibold text-text-heading mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <FaLock />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-sans focus:outline-none transition-all duration-200 ${
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
              {/* Password strength visual meter */}
              {watchPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-text-muted">Strength:</span>
                    <span className="font-semibold text-text-heading">{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`}></div>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className="text-danger text-xs mt-1 font-sans">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label className="block text-sm font-semibold text-text-heading mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                  <FaLock />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-sans focus:outline-none transition-all duration-200 ${
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
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2 btn-ripple"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-lg" />
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary-dark font-semibold transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
