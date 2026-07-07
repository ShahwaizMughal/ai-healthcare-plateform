/**
 * Reusable Pagination component matching standard admin control layout.
 *
 * @param {number} page - Current active page number (1-based)
 * @param {number} totalPages - Total number of pages available
 * @param {function} onPageChange - Callback invoked with the target page number
 */
export const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
      >
        Previous
      </button>
      <span className="text-xs text-text-muted font-medium font-sans">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 bg-white border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color disabled:opacity-50 transition-all cursor-pointer"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
