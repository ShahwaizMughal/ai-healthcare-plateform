/**
 * Reusable EmptyState component for showing a visually polished blank state.
 *
 * @param {React.ComponentType} [Icon] - React-icon component to display (e.g. MdEmail)
 * @param {string} title - Main header text for the empty state
 * @param {string} description - Brief details or call-to-action description text
 */
export const EmptyState = ({ Icon, title, description }) => {
  return (
    <div className="bg-white p-16 text-center rounded-2xl shadow-sm border-2 border-dashed border-border-color/10">
      {Icon && <Icon size={48} className="mx-auto text-border-color mb-3" />}
      <h3 className="font-bold text-text-heading">{title}</h3>
      <p className="text-text-muted text-sm mt-1">{description}</p>
    </div>
  );
};

export default EmptyState;
