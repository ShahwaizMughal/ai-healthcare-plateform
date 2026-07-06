/**
 * Pagination — page number controls for all list pages
 * Props: currentPage, totalPages, onPageChange
 * Uses the same button/radius tokens as the rest of the design system.
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  // Build a simple page list: always show first, last, current, and neighbors
  const getPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  const buttonBase = {
    minWidth: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md, 8px)',
    border: '1px solid #CCCCCC',
    background: '#fff',
    color: 'var(--color-primary-dark, #0A5C63)',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 150ms ease',
  }

  const activeButton = {
    ...buttonBase,
    background: 'var(--color-primary, #0E7C86)',
    borderColor: 'var(--color-primary, #0E7C86)',
    color: '#fff',
  }

  const disabledButton = {
    ...buttonBase,
    opacity: 0.5,
    cursor: 'not-allowed',
  }

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-sm, 8px)',
        flexWrap: 'wrap',
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        style={currentPage === 1 ? disabledButton : buttonBase}
      >
        ‹
      </button>

      {getPageNumbers().map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: '#999' }}>
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            style={page === currentPage ? activeButton : buttonBase}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        style={currentPage === totalPages ? disabledButton : buttonBase}
      >
        ›
      </button>
    </nav>
  )
}

export default Pagination