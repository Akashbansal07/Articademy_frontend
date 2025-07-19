import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBriefcase, FiUsers, FiBarChart2, FiLogOut, FiMenu, FiX, FiSettings, FiUser, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminLayout = ({ children }) => {
  const { admin, logout, hasPermission, isMainAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: FiHome,
      permission: null
    },
    {
      name: 'Manage Jobs',
      href: '/admin/jobs',
      icon: FiBriefcase,
      permission: 'canCreateJobs'
    },
    {
      name: 'Dump Jobs',
      href: '/admin/jobs/dump',
      icon: FiClock,
      permission: 'canCreateJobs'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: FiBarChart2,
      permission: 'canViewAnalytics'
    },
    {
      name: 'Manage Admins',
      href: '/admin/admins',
      icon: FiUsers,
      permission: 'canManageAdmins'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
        <div className="card-3d-dark p-3 rounded-xl">
          <FiSettings className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-2xl font-bold text-gray-900">Admin Portal</span>
          <p className="text-sm text-gray-500 mt-1">Management Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`nav-item-3d flex items-center space-x-3 text-sm font-medium ${
              isActive(item.href) ? 'active' : ''
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="card-3d p-4 mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="card-3d-dark p-2 rounded-full">
              <FiUser className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{admin?.username}</p>
              <p className="text-sm text-gray-500">{admin?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`badge-3d ${admin?.role === 'main_admin' ? 'badge-info' : 'badge-success'} text-xs`}>
              {admin?.role === 'main_admin' ? 'Main Admin' : 'Admin'}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="btn-3d-secondary w-full justify-center"
        >
          <FiLogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-80 card-3d rounded-none border-r">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-80 card-3d rounded-none shadow-3d-heavy">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="btn-3d-secondary p-2"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="nav-3d lg:hidden border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn-3d-secondary p-2"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="card-3d-dark p-2 rounded-xl">
                <FiSettings className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">Admin Portal</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="card-3d-dark p-2 rounded-full">
                <FiUser className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">{admin?.username}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;