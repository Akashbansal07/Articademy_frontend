import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSearch, 
  FiMapPin, 
  FiBriefcase, 
  FiTrendingUp, 
  FiUsers, 
  FiClock, 
  FiArrowRight,
  FiTarget,
  FiAward,
  FiStar
} from 'react-icons/fi';
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Unsplash image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=2000&q=80"
            alt="Team collaboration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-purple-900/85 to-slate-900/90"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20">
                <FiStar className="h-4 w-4 mr-2 text-yellow-400" />
                Trusted by 10,000+ professionals
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 text-white leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Dream Career
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed px-4">
              Connect with leading companies, explore exciting opportunities, and take the next step in your professional journey with Articademy's comprehensive career platform.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl max-w-5xl mx-auto border border-white/20">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 sm:h-6 sm:w-6 z-10" />
                    <input
                      type="text"
                      placeholder="Job title, skills, or company name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 text-base sm:text-lg text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                    />
                  </div>
                  <div className="flex-1 sm:max-w-xs relative">
                    <FiMapPin className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 sm:h-6 sm:w-6 z-10" />
                    <input
                      type="text"
                      placeholder="City, state, or remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 text-base sm:text-lg text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSearch}
                  className="w-full sm:w-auto sm:self-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <FiSearch className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-base sm:text-lg">Search Jobs</span>
                </button>
              </div>
              
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 justify-center">
                {['Remote', 'Full-time', 'Software Engineer', 'Data Science', 'Marketing'].map((tag, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                    onClick={() => setSearchTerm(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
              <FiClock className="h-4 w-4 mr-2" />
              Latest Opportunities
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Fresh <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Opportunities</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most recent job postings from innovative companies looking for talented professionals like you.
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-8 shadow-lg animate-pulse">
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
              {recentJobs.map((job) => (
                <div key={job._id} className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
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
                    <span className="bg-green-100 text-green-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex-shrink-0">
                      {job.employmentType}
                    </span>
                  </div>
                  
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {job.role}
                  </h4>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-4 gap-2 sm:gap-0">
                    <div className="flex items-center">
                      <FiMapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm truncate">{job.location}</span>
                    </div>
                    <span className="hidden sm:inline mx-4">•</span>
                    <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto">
                      {job.experience}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                    {job.description.substring(0, 120)}...
                  </p>
                  
                  {job.estPackage && (
                    <p className="text-emerald-600 font-bold mb-4 sm:mb-6 text-base sm:text-lg">
                      ₹{job.estPackage}
                    </p>
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
          )}
          
          <div className="text-center mt-16">
            <Link
              to="/jobs"
              className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-indigo-600 font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-300"
            >
              <span>Explore All Opportunities</span>
              <FiArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=2000&q=80"
            alt="Modern office space" 
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <FiTarget className="h-4 w-4 mr-2" />
              Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Success Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From discovery to dream job - we make your career transition seamless and successful.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                step: '01',
                icon: FiSearch,
                title: 'Discover Opportunities',
                description: 'Browse through thousands of carefully curated job listings from top companies across various industries and experience levels.',
                color: 'from-indigo-500 to-blue-600'
              },
              {
                step: '02',
                icon: FiTarget,
                title: 'Apply with Confidence',
                description: 'Get detailed job insights and company information to make informed decisions. Apply directly through our streamlined process.',
                color: 'from-purple-500 to-pink-600'
              },
              {
                step: '03',
                icon: FiAward,
                title: 'Land Your Dream Role',
                description: 'Connect with hiring managers, showcase your skills, and secure your ideal position with our career advancement support.',
                color: 'from-emerald-500 to-teal-600'
              }
            ].map((step, index) => (
              <div key={index} className="group relative">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full blur-3xl opacity-50 transform translate-x-8 -translate-y-8"></div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-6xl font-black text-gray-100 group-hover:text-gray-200 transition-colors">
                        {step.step}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <FiArrowRight className="h-8 w-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;