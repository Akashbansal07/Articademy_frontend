import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBriefcase, 
  FiUsers, 
  FiBarChart2, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiSettings, 
  FiUser, 
  FiClock,
  FiBook
} from 'react-icons/fi';
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
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-100">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
          <FiBook className="h-7 w-7 text-white" />
        </div>
        <div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Articademy
          </span>
          <p className="text-sm text-gray-500 mt-1 font-medium">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {filteredNavItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`group flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
              isActive(item.href) 
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-100' 
                : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className={`h-5 w-5 transition-colors ${
              isActive(item.href) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'
            }`} />
            <span className="font-semibold">{item.name}</span>
            {isActive(item.href) && (
              <div className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></div>
            )}
          </Link>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-full">
              <FiUser className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">{admin?.username}</p>
              <p className="text-sm text-gray-500 truncate">{admin?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              admin?.role === 'main_admin' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-indigo-100 text-indigo-800'
            }`}>
              {admin?.role === 'main_admin' ? 'Main Admin' : 'Admin'}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
        >
          <FiLogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-80 shadow-xl border border-gray-200/60">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="relative flex flex-col w-80 shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
        <header className="lg:hidden bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-xl">
                <FiBook className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Articademy
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-full">
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