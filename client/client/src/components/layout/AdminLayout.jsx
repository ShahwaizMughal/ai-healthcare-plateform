import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { MdMenu, MdNotificationsNone, MdAccountCircle } from 'react-icons/md';
import useAuth from '../../hooks/useAuth';

/**
 * AdminLayout Component
 * Master container structure wrapping nested subpages with sidebar and headers.
 */
export const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Helper to map route pathnames to human-readable titles
  const getHeaderTitle = (pathname) => {
    switch (pathname) {
      case '/admin':
        return 'Dashboard Overview';
      case '/admin/doctors':
        return 'Manage Doctor Profiles';
      case '/admin/medicines':
        return 'Pharmacy Inventory Manager';
      case '/admin/blogs':
        return 'Health Blog Publisher';
      case '/admin/appointments':
        return 'Appointment Bookings';
      case '/admin/orders':
        return 'Pharmacy Orders Dashboard';
      case '/admin/lab-bookings':
        return 'Laboratory Bookings';
      case '/admin/messages':
        return 'Customer Inquiries Support';
      default:
        return 'Admin Panel';
    }
  };

  return (
    <div className="min-h-screen bg-bg-color flex font-sans antialiased text-text-body">
      {/* Admin Left Sidebar */}
      <AdminSidebar 
        isMobileOpen={isMobileOpen} 
        onClose={() => setIsMobileOpen(false)} 
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col lg:pl-[260px] min-w-0">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-border-color/20 flex items-center justify-between px-4 sm:px-6 md:px-8 shadow-sm flex-shrink-0">
          
          {/* Left: Mobile Menu & Current Path Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-1.5 rounded-lg border border-border-color/30 hover:bg-bg-color transition-colors lg:hidden text-text-heading cursor-pointer"
            >
              <MdMenu size={24} />
            </button>
            <h1 className="font-heading font-bold text-text-heading text-lg sm:text-xl truncate">
              {getHeaderTitle(location.pathname)}
            </h1>
          </div>

          {/* Right: Notifications & Profile Summary */}
          <div className="flex items-center gap-4">
            {/* Mock Notification Counter */}
            <button className="p-2 text-text-muted hover:bg-bg-color hover:text-text-heading rounded-full relative transition-colors cursor-pointer">
              <MdNotificationsNone size={22} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* Splitter Line */}
            <div className="h-6 w-px bg-border-color/20" />

            {/* User Metadata */}
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-text-muted">Logged in as</p>
                <p className="text-sm font-semibold text-text-heading leading-tight truncate max-w-[150px]">
                  {user?.fullName}
                </p>
              </div>
              <div className="p-1 text-text-heading hover:bg-bg-color rounded-lg transition-colors cursor-pointer flex items-center">
                <MdAccountCircle size={28} className="text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Children Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
