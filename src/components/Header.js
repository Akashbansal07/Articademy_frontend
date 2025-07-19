import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBriefcase, FiHome, FiSearch } from 'react-icons/fi';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="nav-3d sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="card-3d-dark p-3 group-hover:shadow-3d-medium transition-all duration-300">
              <FiBriefcase className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              JobPortal
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`nav-item-3d flex items-center space-x-2 ${
                isActive('/') ? 'active' : ''
              }`}
            >
              <FiHome className="h-5 w-5" />
              <span className="font-semibold">Home</span>
            </Link>
            
            <Link
              to="/jobs"
              className={`nav-item-3d flex items-center space-x-2 ${
                isActive('/jobs') ? 'active' : ''
              }`}
            >
              <FiSearch className="h-5 w-5" />
              <span className="font-semibold">Browse Jobs</span>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              to="/"
              className={`nav-item-3d p-3 ${
                isActive('/') ? 'active' : ''
              }`}
            >
              <FiHome className="h-6 w-6" />
            </Link>
            
            <Link
              to="/jobs"
              className={`nav-item-3d p-3 ${
                isActive('/jobs') ? 'active' : ''
              }`}
            >
              <FiSearch className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;