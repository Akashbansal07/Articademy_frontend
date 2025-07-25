import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiSearch, 
  FiMapPin, 
  FiBriefcase, 
  FiFilter, 
  FiClock, 
  FiArrowRight, 
  FiX,
  FiSliders,
  FiTrendingUp,
  FiUsers,
  FiDollarSign
} from 'react-icons/fi';
import { jobApi } from '../services/api';

const Jobs = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    keywords: '',
    location: '',
    role: '',
    experience: '',
    employmentType: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    roles: [],
    locations: [],
    companies: [],
    experienceOptions: [],
    employmentTypes: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Parse URL parameters
    const searchParams = new URLSearchParams(location.search);
    const initialFilters = {
      keywords: searchParams.get('keywords') || '',
      location: searchParams.get('location') || '',
      role: searchParams.get('role') || '',
      experience: searchParams.get('experience') || '',
      employmentType: searchParams.get('employmentType') || ''
    };
    setFilters(initialFilters);
    fetchFilterOptions();
  }, [location.search]);

  useEffect(() => {
    fetchJobs();
  }, [filters, currentPage]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      const response = await jobApi.getJobs(params);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await jobApi.getFilterOptions();
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      keywords: '',
      location: '',
      role: '',
      experience: '',
      employmentType: ''
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (!pagination.totalPages || pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            i === currentPage
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="px-6 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 transition-colors"
        >
          Previous
        </button>
        <div className="flex space-x-1">
          {pages}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.hasNext}
          className="px-6 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 transition-colors"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=2000&q=80"
            alt="Professional workspace" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/85 to-purple-900/85"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6 px-4">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Career Match
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-6 sm:mb-8 px-4">
              Discover thousands of opportunities from leading companies worldwide
            </p>
          </div>

          {/* Enhanced Search Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/20 max-w-6xl mx-auto">
            <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 sm:h-6 sm:w-6 z-10" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or skills..."
                    value={filters.keywords}
                    onChange={(e) => handleFilterChange('keywords', e.target.value)}
                    className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 text-base sm:text-lg text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  />
                </div>
                
                {/* Location Filter */}
                <div className="sm:w-64 lg:w-80 relative">
                  <FiMapPin className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 sm:h-6 sm:w-6 z-10" />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 text-base sm:text-lg text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  />
                </div>
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full sm:w-auto sm:self-center flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  showFilters 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                <FiSliders className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>Filters</span>
              </button>
            </div>
            
            {/* Advanced Filters */}
            {showFilters && (
              <div className="bg-gradient-to-r from-gray-50 to-indigo-50 p-6 rounded-xl border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Role Category</label>
                    <select
                      value={filters.role}
                      onChange={(e) => handleFilterChange('role', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                      <option value="">All Roles</option>
                      {filterOptions.roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
                    <select
                      value={filters.experience}
                      onChange={(e) => handleFilterChange('experience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                      <option value="">All Experience</option>
                      {filterOptions.experienceOptions.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Type</label>
                    <select
                      value={filters.employmentType}
                      onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                      <option value="">All Types</option>
                      {filterOptions.employmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <FiX className="h-4 w-4" />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-20 -mt-10 relative z-10">
        <div className="container mx-auto px-6">
          {/* Results Header */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Searching...' : `${pagination.totalJobs || 0} Opportunities Found`}
                </h2>
                {!loading && pagination.totalJobs > 0 && (
                  <p className="text-gray-600 mt-1">
                    Showing {((currentPage - 1) * 12) + 1} - {Math.min(currentPage * 12, pagination.totalJobs)} of {pagination.totalJobs} results
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FiTrendingUp className="h-4 w-4" />
                  <span>Updated daily</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FiUsers className="h-4 w-4" />
                  <span>Verified companies</span>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg animate-pulse border border-gray-100">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                  <div className="h-20 bg-gray-200 rounded w-full mb-6"></div>
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No opportunities found</h3>
              <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                We couldn't find any jobs matching your criteria. Try adjusting your search or filters.
              </p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {jobs.map((job) => (
                  <div key={job._id} className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-4 sm:mb-6">
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                        {job.companyLogo ? (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-md bg-white p-1 flex-shrink-0">
                            <img
                              src={job.companyLogo}
                              alt={job.companyName}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                            <FiBriefcase className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{job.companyName}</h3>
                          <p className="text-gray-500 text-xs sm:text-sm flex items-center mt-1">
                            <FiClock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{new Date(job.datePosted).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2">
                        {job.employmentType}
                      </span>
                    </div>
                    
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {job.role}
                    </h4>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 text-sm mb-4 gap-2 sm:gap-0">
                      <div className="flex items-center">
                        <FiMapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <span className="hidden sm:inline mx-4">•</span>
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto">
                        {job.experience}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                      {job.description.substring(0, 120)}...
                    </p>
                    
                    {job.skills && (job.skills.languages?.length > 0 || job.skills.technologies?.length > 0) && (
                      <div className="mb-4 sm:mb-6">
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {job.skills.languages?.slice(0, 2).map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {job.skills.technologies?.slice(0, 2).map((skill, index) => (
                            <span key={index} className="bg-emerald-100 text-emerald-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {(job.skills.languages?.length + job.skills.technologies?.length > 4) && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium">
                              +{(job.skills.languages?.length || 0) + (job.skills.technologies?.length || 0) - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {job.estPackage && (
                      <div className="flex items-center text-emerald-600 font-bold text-base sm:text-lg mb-4 sm:mb-6">
                        <FiDollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                        <span>₹{job.estPackage}</span>
                      </div>
                    )}
                    
                    <Link
                      to={`/jobs/${job._id}`}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                      <span>View Details</span>
                      <FiArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Jobs;