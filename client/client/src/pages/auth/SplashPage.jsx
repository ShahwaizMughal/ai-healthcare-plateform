import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserMd } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';

export const SplashPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Show splash screen for at least 1.5 seconds for a premium, non-jarring experience
    const minDelay = 1500;
    const timer = setTimeout(() => {
      if (!loading) {
        if (isAuthenticated) {
          navigate('/home');
        } else {
          navigate('/login');
        }
      }
    }, minDelay);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, navigate]);

  // If loading takes longer than 1.5 seconds, wait until loading completes before redirecting
  useEffect(() => {
    if (!loading && Date.now() > 1500) {
      if (isAuthenticated) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex flex-col items-center justify-center text-white relative overflow-hidden font-sans">
      {/* Decorative blurry background circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/15 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary/15 blur-3xl"></div>

      <div className="z-10 flex flex-col items-center gap-6">
        {/* Animated pulsing doctor icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-2xl flex items-center justify-center cursor-pointer"
        >
          <FaUserMd className="text-6xl text-accent" />
        </motion.div>

        {/* Text Fade In */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-2">MedCare</h1>
          <p className="text-white/60 text-sm md:text-base font-light font-sans tracking-widest uppercase">
            AI-Powered Healthcare System
          </p>
        </motion.div>
      </div>

      {/* Footer message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-8 text-xs font-light text-white tracking-wider uppercase font-sans"
      >
        Initializing secure environment...
      </motion.div>
    </div>
  );
};

export default SplashPage;
