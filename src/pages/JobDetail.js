import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiMapPin, 
  FiBriefcase, 
  FiClock, 
  FiCalendar, 
  FiExternalLink, 
  FiArrowLeft, 
  FiShare2, 
  FiBookmark,
  FiDollarSign,
  FiEye,
  FiBook,
  FiUsers,
  FiTrendingUp
} from 'react-icons/fi';
import { jobApi } from '../services/api';
import { toast } from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState([]);

  useEffect(() => {
    if (id) {
      // Scroll to top when component mounts or id changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
      fetchJob();
      fetchRelatedJobs();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobApi.getJob(id);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Job not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedJobs = async () => {
    try {
      const response = await jobApi.getJobs({ limit: 4 });
      setRelatedJobs(response.data.jobs.filter(j => j._id !== id));
    } catch (error) {
      console.error('Error fetching related jobs:', error);
    }
  };

  const handleApply = async () => {
    if (!job) return;
    
    setApplying(true);
    try {
      await jobApi.clickJob(job._id);
      toast.success('Redirecting to application...');
      window.open(job.hiringLink, '_blank');
    } catch (error) {
      console.error('Error tracking application:', error);
      toast.error('Failed to track application');
    } finally {
      setApplying(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: job.role,
        text: `Check out this job at ${job.companyName}`,
        url: window.location.href
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiBriefcase className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-8 text-lg">The position you're looking for doesn't exist or has been filled.</p>
          <Link 
            to="/jobs" 
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Explore Other Opportunities</span>
            <FiArrowLeft className="h-5 w-5 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt="Modern office workspace" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/jobs"
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white font-medium transition-colors group"
            >
              <FiArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Jobs</span>
            </Link>
          </div>

          {/* Job Header */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
                <div className="flex items-start space-x-4 sm:space-x-6 flex-1">
                  {job.companyLogo ? (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg bg-white p-2 flex-shrink-0">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <FiBriefcase className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{job.role}</h1>
                    <p className="text-lg sm:text-xl text-gray-700 mb-3">{job.companyName}</p>
                    
                    {/* Mobile Apply Button - Shows only on mobile */}
                    <div className="sm:hidden mb-4">
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                      >
                        {applying ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <FiExternalLink className="h-5 w-5" />
                            <span>Apply Now</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        <FiMapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        <FiBriefcase className="h-4 w-4 mr-1" />
                        {job.experience}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        <FiClock className="h-4 w-4 mr-1" />
                        {job.employmentType}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 sm:self-start">
                  <button
                    onClick={handleShare}
                    className="p-3 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
                    title="Share Job"
                  >
                    <FiShare2 className="h-5 w-5" />
                  </button>
                  <button
                    className="p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                    title="Save Job"
                  >
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-20 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Details Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {/* Package */}
              {job.estPackage && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl mb-8 border border-emerald-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-500 p-2 rounded-lg">
                      <FiDollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-emerald-700 font-medium">Estimated Package</p>
                      <p className="text-3xl font-bold text-emerald-600">₹{job.estPackage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FiBook className="h-6 w-6 mr-3 text-indigo-600" />
                  Job Description
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-xl">
                  {job.description}
                </div>
              </div>

              {/* Required Qualifications */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FiUsers className="h-6 w-6 mr-3 text-purple-600" />
                  Required Qualifications
                </h3>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                  <p className="text-gray-700 leading-relaxed">{job.requiredDegree}</p>
                </div>
              </div>

              {/* Skills */}
              {job.skills && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <FiTrendingUp className="h-6 w-6 mr-3 text-indigo-600" />
                    Required Skills
                  </h3>
                  <div className="space-y-6">
                    {Object.entries(job.skills).map(([category, skills]) => {
                      if (!skills || skills.length === 0) return null;
                      
                      const categoryColors = {
                        languages: 'from-blue-500 to-indigo-500',
                        technologies: 'from-emerald-500 to-teal-500',
                        frameworks: 'from-purple-500 to-pink-500',
                        databases: 'from-orange-500 to-red-500',
                        tools: 'from-cyan-500 to-blue-500',
                        others: 'from-gray-500 to-slate-500'
                      };
                      
                      const categoryNames = {
                        languages: 'Programming Languages',
                        technologies: 'Technologies',
                        frameworks: 'Frameworks',
                        databases: 'Databases',
                        tools: 'Tools',
                        others: 'Other Skills'
                      };
                      
                      return (
                        <div key={category} className="bg-white border border-gray-200 rounded-xl p-6">
                          <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                            <div className={`w-3 h-3 bg-gradient-to-r ${categoryColors[category]} rounded-full mr-3`}></div>
                            {categoryNames[category]}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                              <span 
                                key={index} 
                                className={`px-4 py-2 bg-gradient-to-r ${categoryColors[category]} text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card - Desktop only */}
            <div className="hidden sm:block bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-6">
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mb-4"
              >
                {applying ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <FiExternalLink className="h-5 w-5" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Quick & Secure Application</p>
                <p className="text-xs text-gray-500">You'll be redirected to the company's application page</p>
              </div>
            </div>

            {/* Job Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FiBriefcase className="h-5 w-5 mr-2 text-indigo-600" />
                Job Information
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Job ID', value: job.jobId, icon: FiBriefcase },
                  { label: 'Date Posted', value: formatDate(job.datePosted), icon: FiCalendar },
                  { label: 'Employment Type', value: job.employmentType, icon: FiClock },
                  { label: 'Experience Level', value: job.experience, icon: FiUsers },
                  { label: 'Views', value: job.analytics?.views || 0, icon: FiEye }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 text-sm">{item.label}</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <FiTrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  Similar Opportunities
                </h3>
                
                <div className="space-y-4">
                  {relatedJobs.slice(0, 3).map((relatedJob) => (
                    <Link
                      key={relatedJob._id}
                      to={`/jobs/${relatedJob._id}`}
                      className="block group"
                    >
                      <div className="p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-200 group-hover:bg-indigo-50/50">
                        <div className="flex items-center space-x-3">
                          {relatedJob.companyLogo ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-1">
                              <img
                                src={relatedJob.companyLogo}
                                alt={relatedJob.companyName}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FiBriefcase className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                              {relatedJob.role}
                            </h4>
                            <p className="text-gray-600 text-xs">{relatedJob.companyName}</p>
                            <p className="text-gray-500 text-xs flex items-center mt-1">
                              <FiMapPin className="h-3 w-3 mr-1" />
                              {relatedJob.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    to="/jobs"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>View All Opportunities</span>
                    <FiArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;