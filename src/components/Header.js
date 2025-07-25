import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBook, FiHome, FiSearch } from 'react-icons/fi';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <FiBook className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                Articademy
              </span>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Learn • Grow • Succeed</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`group relative flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isActive('/') 
                  ? 'text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <FiHome className={`h-5 w-5 transition-all duration-300 ${
                isActive('/') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'
              }`} />
              <span>Home</span>
              {isActive('/') && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
              )}
            </Link>
            
            <Link
              to="/jobs"
              className={`group relative flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isActive('/jobs') 
                  ? 'text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <FiSearch className={`h-5 w-5 transition-all duration-300 ${
                isActive('/jobs') ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'
              }`} />
              <span>Browse Jobs</span>
              {isActive('/jobs') && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
              )}
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Link
              to="/"
              className={`relative p-3 rounded-xl transition-all duration-300 ${
                isActive('/') 
                  ? 'text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <FiHome className={`h-6 w-6 ${
                isActive('/') ? 'text-indigo-600' : 'text-gray-500'
              }`} />
              {isActive('/') && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
              )}
            </Link>
            
            <Link
              to="/jobs"
              className={`relative p-3 rounded-xl transition-all duration-300 ${
                isActive('/jobs') 
                  ? 'text-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-sm' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
              }`}
            >
              <FiSearch className={`h-6 w-6 ${
                isActive('/jobs') ? 'text-indigo-600' : 'text-gray-500'
              }`} />
              {isActive('/jobs') && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;