import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { 
  MdDashboard, 
  MdPeople, 
  MdLocalPharmacy, 
  MdBook, 
  MdEvent, 
  MdShoppingCart, 
  MdBiotech, 
  MdEmail, 
  MdExitToApp 
} from 'react-icons/md';

/**
 * AdminSidebar Component
 * Provides clean side navigation for the admin dashboard panel.
 * Collaborates with Tailwind CSS for off-canvas drawer states on mobile.
 */
export const AdminSidebar = ({ isMobileOpen, onClose }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <MdDashboard size={20} />, end: true },
    { name: 'Manage Doctors', path: '/admin/doctors', icon: <MdPeople size={20} /> },
    { name: 'Manage Medicines', path: '/admin/medicines', icon: <MdLocalPharmacy size={20} /> },
    { name: 'Manage Blogs', path: '/admin/blogs', icon: <MdBook size={20} /> },
    { name: 'Appointments', path: '/admin/appointments', icon: <MdEvent size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <MdShoppingCart size={20} /> },
    { name: 'Lab Bookings', path: '/admin/lab-bookings', icon: <MdBiotech size={20} /> },
    { name: 'Inquiries Messages', path: '/admin/messages', icon: <MdEmail size={20} /> }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-45 
        w-[260px] bg-white border-r border-border-color/20 
        flex flex-col justify-between
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Upper Sidebar Brand & User Profile */}
        <div>
          <div className="h-16 flex items-center px-6 border-b border-border-color/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm">
                M
              </div>
              <span className="font-heading font-bold text-lg text-text-heading">
                MedCare <span className="text-primary">Admin</span>
              </span>
            </div>
          </div>

          {/* Quick Profile Summary */}
          <div className="p-4 mx-4 my-3 bg-bg-color/50 rounded-xl border border-border-color/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-text-heading truncate">{user?.fullName}</p>
              <p className="text-xs text-text-muted capitalize">{user?.role || 'Administrator'}</p>
            </div>
          </div>

          {/* Menu Links */}
          <nav className="px-4 py-2 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-text-muted hover:bg-bg-color hover:text-text-heading'
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Lower Sidebar Logout */}
        <div className="p-4 border-t border-border-color/10">
          <button
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium text-danger hover:bg-red-50 transition-all duration-200 cursor-pointer"
          >
            <MdExitToApp size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
