import { FaSpinner } from 'react-icons/fa';

/**
 * Standard spinner loader matching colors of the MedCare design system.
 * Can be used full-screen or nested in parent container.
 * @param {boolean} fullScreen - Renders overlay covering entire browser viewport
 * @param {string} size - Size of spinner ('sm', 'md', 'lg')
 */
export const Loader = ({ fullScreen = false, size = 'lg' }) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <FaSpinner className={`animate-spin text-primary ${sizeClasses[size] || sizeClasses.lg}`} />
      <span className="text-sm font-semibold tracking-wide text-text-muted font-sans">
        Loading MedCare...
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-color">
        {spinner}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[200px] flex items-center justify-center">
      {spinner}
    </div>
  );
};

export default Loader;
