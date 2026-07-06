import { useEffect } from 'react'

/**
 * Modal — reusable overlay dialog (Lab booking, Admin forms, confirmations)
 * Props: isOpen, onClose, title, children
 * Spec refs: Section 11.4 (radius lg = 12px), Section 11.13 (fade-in 200–300ms)
 */
function Modal({ isOpen, onClose, title, children }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--spacing-md, 16px)',
        animation: 'modalFadeIn 250ms ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          background: '#fff',
          borderRadius: 'var(--radius-lg, 12px)',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          animation: 'modalSlideUp 250ms ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-lg, 24px)',
            borderBottom: '1px solid #EEEEEE',
          }}
        >
          {title && (
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--color-primary-dark, #0A5C63)',
                margin: 0,
              }}
            >
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '22px',
              lineHeight: 1,
              cursor: 'pointer',
              color: '#666',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: 'var(--spacing-lg, 24px)' }}>{children}</div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Modal