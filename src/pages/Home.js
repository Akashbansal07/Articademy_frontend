import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBriefcase, FiTrendingUp, FiUsers, FiClock, FiArrowRight } from 'react-icons/fi';
import { jobApi } from '../services/api';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [recentJobs, setRecentJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    recentJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentJobs();
    fetchStats();
  }, []);

  const fetchRecentJobs = async () => {
    try {
      const response = await jobApi.getJobs({ limit: 6, sortBy: 'datePosted', sortOrder: 'desc' });
      setRecentJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching recent jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await jobApi.getJobs({ limit: 1 });
      setStats({
        totalJobs: response.data.pagination.totalJobs,
        totalCompanies: new Set(response.data.jobs.map(job => job.companyName)).size,
        recentJobs: response.data.jobs.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.append('keywords', searchTerm);
    if (location) searchParams.append('location', location);
    
    window.location.href = `/jobs?${searchParams.toString()}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-white leading-tight">
              Find Your 
              <span className="block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Dream Job
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
              Connect with top companies and discover opportunities that match your skills and aspirations
            </p>
            
            {/* Search Bar */}
            <div className="card-3d p-8 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input-3d pl-14 text-lg h-14"
                  />
                </div>
                <div className="flex-1 relative">
                  <FiMapPin className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="input-3d pl-14 text-lg h-14"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="btn-3d-primary h-14 px-8 text-lg font-bold min-w-[180px]"
                >
                  <FiSearch className="h-5 w-5 mr-2" />
                  Search Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card-3d p-10 text-center group hover:shadow-3d-medium">
              <div className="card-3d-dark w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <FiBriefcase className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">{stats.totalJobs}+</h3>
              <p className="text-gray-600 text-lg font-medium">Active Job Listings</p>
            </div>
            
            <div className="card-3d p-10 text-center group hover:shadow-3d-medium">
              <div className="card-3d-dark w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <FiUsers className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">{stats.totalCompanies}+</h3>
              <p className="text-gray-600 text-lg font-medium">Trusted Companies</p>
            </div>
            
            <div className="card-3d p-10 text-center group hover:shadow-3d-medium">
              <div className="card-3d-dark w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300">
                <FiTrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-3">95%</h3>
              <p className="text-gray-600 text-lg font-medium">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Latest Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most recent job postings from top companies
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card-3d p-8 loading-3d">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
                  <div className="h-12 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {recentJobs.map((job) => (
                <div key={job._id} className="card-3d p-8 group hover:shadow-3d-heavy transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
                          className="w-16 h-16 rounded-xl object-cover shadow-3d-light"
                        />
                      ) : (
                        <div className="w-16 h-16 card-3d-dark rounded-xl flex items-center justify-center">
                          <FiBriefcase className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{job.companyName}</h3>
                        <p className="text-gray-500 text-sm flex items-center mt-1">
                          <FiClock className="h-4 w-4 mr-1" />
                          {new Date(job.datePosted).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="badge-3d badge-success">
                      {job.employmentType}
                    </span>
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{job.role}</h4>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <FiMapPin className="h-4 w-4 mr-2" />
                    <span className="mr-4">{job.location}</span>
                    <span className="badge-3d badge-info text-xs">
                      {job.experience}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {job.description.substring(0, 120)}...
                  </p>
                  
                  {job.estPackage && (
                    <p className="text-green-600 font-bold mb-4 text-lg">
                      ₹{job.estPackage}
                    </p>
                  )}
                  
                  <Link
                    to={`/jobs/${job._id}`}
                    className="btn-3d-primary w-full justify-center group-hover:shadow-3d-medium"
                  >
                    <span>View Details</span>
                    <FiArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-16">
            <Link
              to="/jobs"
              className="btn-3d-secondary text-lg px-12 py-4 hover:shadow-3d-heavy"
            >
              <span>View All Jobs</span>
              <FiArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your dream job in 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card-3d p-10 text-center group hover:shadow-3d-medium">
              <div className="card-3d-dark w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300">
                <FiSearch className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Search Jobs</h3>
              <p className="text-gray-600 text-lg">
                Browse through thousands of job listings from top companies across various industries and locations.
              </p>
            </div>
            
            <div className="card-3d p-10 text-center group hover:shadow-3d-medium">
              <div className="card-3d-dark w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300">
                <FiBriefcase className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Apply Easily</h3>
              <p className="text-gray-600 text-lg">
                Click on the job that interests you and get redirected to the company's application page instantly.
              </p>
            </div>
            
            <div className="card-3d p-10 text-center group hover:shadow-3d-medium">
              <div className="card-3d-dark w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-300">
                <FiTrendingUp className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Get Hired</h3>
              <p className="text-gray-600 text-lg">
                Connect with employers, showcase your skills, and land your dream job with our trusted platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;