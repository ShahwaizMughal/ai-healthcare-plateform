import { MdWarning, MdRefresh } from 'react-icons/md';

/**
 * Reusable ErrorState component for API or server connection failures.
 *
 * @param {string} [title="Connection Failure"] - The heading of the error panel
 * @param {string} [message="Could not connect to the clinical database server. Please check your network connection and verify if the service is running."] - The body details
 * @param {function} onRetry - The action callback to try reloading/fetching the query again
 */
export const ErrorState = ({
  title = 'Connection Failure',
  message = 'Could not connect to the clinical database server. Please check your network connection and verify if the service is running.',
  onRetry,
}) => {
  return (
    <div className="bg-white p-12 text-center rounded-2xl border border-danger/25 shadow-sm max-w-lg mx-auto my-8 space-y-4">
      <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center text-danger mx-auto">
        <MdWarning size={32} />
      </div>
      <h3 className="font-heading font-bold text-text-heading text-lg">{title}</h3>
      <p className="text-text-muted text-sm leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer mx-auto"
        >
          <MdRefresh size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
