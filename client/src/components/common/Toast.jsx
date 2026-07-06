import toast, { Toaster } from 'react-hot-toast'

/**
 * Toast — transient success/error/info notification (Section 11.14)
 * The SRS explicitly recommends react-hot-toast rather than a custom
 * toast system, so this file is a thin themed wrapper around it.
 *
 * Usage:
 *   import { showToast } from '../../components/common/Toast'
 *   showToast('success', 'Appointment booked!')
 *   showToast('error', 'Something went wrong')
 */

export function showToast(type, message) {
  const isSuccess = type === 'success'
  toast(message, {
    duration: 3500, // 3–4s auto-dismiss per spec
    position: window.innerWidth < 768 ? 'top-center' : 'top-right',
    style: {
      background: isSuccess ? 'var(--color-accent, #3FB6A8)' : 'var(--color-danger, #D64550)',
      color: '#fff',
      fontWeight: 600,
      fontSize: '14px',
      borderRadius: 'var(--radius-md, 8px)',
      padding: '12px 16px',
    },
    icon: isSuccess ? '✅' : '⚠️',
  })
}

/**
 * Mount this ONCE near the root of the app (e.g. in App.jsx),
 * not on every page — it's the container all toasts render into.
 */
function ToastContainer() {
  return <Toaster />
}

export default ToastContainer