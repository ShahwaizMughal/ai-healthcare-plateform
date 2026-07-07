import { MdClose } from 'react-icons/md';

/**
 * Reusable Modal overlay component.
 *
 * @param {boolean} isOpen - Controls visibility of the modal
 * @param {function} onClose - Function called when clicking the close button or background overlay
 * @param {string} title - The title text displayed in the header bar
 * @param {React.ReactNode} children - Scrollable form, body text or grid elements to display inside
 * @param {string} [maxWidth="max-w-xl"] - Tailwind width class (e.g. 'max-w-lg', 'max-w-xl', 'max-w-2xl')
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-xl',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in">
      <div className={`bg-white rounded-2xl ${maxWidth} w-full border border-border-color/10 shadow-premium flex flex-col max-h-[90vh]`}>
        {/* Modal Header */}
        <div className="p-5 border-b border-border-color/10 flex items-center justify-between shrink-0">
          <h3 className="font-heading font-bold text-text-heading text-lg">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-text-muted hover:bg-bg-color hover:text-text-heading cursor-pointer transition-colors"
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Modal Content / Children */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
