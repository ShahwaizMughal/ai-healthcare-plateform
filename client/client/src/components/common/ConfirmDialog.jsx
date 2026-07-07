import { MdWarning } from 'react-icons/md';

/**
 * Reusable Confirmation Dialog Modal.
 * Used for soft deletes, deactivations, status overrides or critical overrides.
 *
 * @param {boolean} isOpen - Controls dialogue visibility
 * @param {function} onClose - Discards the dialogue
 * @param {function} onConfirm - Fires the confirmed action callback
 * @param {string} title - Heading title text
 * @param {React.ReactNode} description - Description summary text or strong highlights
 * @param {string} [confirmText="Confirm"] - Text label for confirmation button
 * @param {string} [cancelText="Cancel"] - Text label for cancellation button
 * @param {string} [type="danger"] - Visual color intent: "danger" (red button) or "primary" (teal/brand button)
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}) => {
  if (!isOpen) return null;

  const confirmBtnClasses =
    type === 'danger'
      ? 'bg-danger hover:bg-red-600 text-white'
      : 'bg-primary hover:bg-primary-dark text-white';

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-border-color/10 shadow-premium p-6 space-y-4 text-center">
        {/* Warning Badge Icon */}
        <div className="w-14 h-14 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto">
          <MdWarning size={28} />
        </div>

        {/* Title & Body Description */}
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-text-heading text-lg">{title}</h3>
          <p className="text-text-muted text-sm leading-relaxed">{description}</p>
        </div>

        {/* Confirm and Cancel Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4.5 py-2 border border-border-color/20 text-xs font-semibold rounded-lg hover:bg-bg-color transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-sm ${confirmBtnClasses}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
