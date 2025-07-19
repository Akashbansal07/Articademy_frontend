import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiClock, FiCalendar, FiExternalLink, FiArrowLeft, FiShare2, FiBookmark } from 'react-icons/fi';
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
      // Open in new tab
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
      // Fallback to clipboard
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
              <div className="h-32 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/jobs"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
            <span>Back to Jobs</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              {/* Job Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiBriefcase className="h-8 w-8 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{job.role}</h1>
                    <p className="text-lg text-gray-600">{job.companyName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Share Job"
                  >
                    <FiShare2 className="h-5 w-5" />
                  </button>
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Save Job"
                  >
                    <FiBookmark className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Job Meta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiMapPin className="h-5 w-5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiBriefcase className="h-5 w-5" />
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <FiClock className="h-5 w-5" />
                  <span>{job.employmentType}</span>
                </div>
              </div>

              {/* Job Details */}
              <div className="space-y-6">
                {/* Package */}
                {job.estPackage && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Salary</h3>
                    <p className="text-2xl font-bold text-green-600">₹{job.estPackage}</p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">{job.description}</div>
                </div>

                {/* Required Degree */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Required Qualifications</h3>
                  <p className="text-gray-700">{job.requiredDegree}</p>
                </div>

                {/* Skills */}
                {job.skills && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Required Skills</h3>
                    <div className="space-y-3">
                      {job.skills.languages && job.skills.languages.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Programming Languages</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.languages.map((skill, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {job.skills.technologies && job.skills.technologies.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Technologies</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.technologies.map((skill, index) => (
                              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {job.skills.frameworks && job.skills.frameworks.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Frameworks</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.frameworks.map((skill, index) => (
                              <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {job.skills.databases && job.skills.databases.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Databases</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.databases.map((skill, index) => (
                              <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {job.skills.tools && job.skills.tools.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Tools</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.tools.map((skill, index) => (
                              <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {job.skills.others && job.skills.others.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Other Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.others.map((skill, index) => (
                              <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {applying ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <FiExternalLink className="h-5 w-5" />
                    <span>Apply Now</span>
                  </>
                )}
              </button>
              
              <div className="mt-4 text-sm text-gray-600 text-center">
                <p>You'll be redirected to the company's application page</p>
              </div>
            </div>

            {/* Job Info Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Job ID</span>
                  <span className="font-medium text-gray-800">{job.jobId}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date Posted</span>
                  <span className="font-medium text-gray-800">{formatDate(job.datePosted)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Employment Type</span>
                  <span className="font-medium text-gray-800">{job.employmentType}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Experience Level</span>
                  <span className="font-medium text-gray-800">{job.experience}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-medium text-gray-800">{job.analytics?.views || 0}</span>
                </div>
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Jobs</h3>
                
                <div className="space-y-4">
                  {relatedJobs.slice(0, 3).map((relatedJob) => (
                    <Link
                      key={relatedJob._id}
                      to={`/jobs/${relatedJob._id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        {relatedJob.companyLogo ? (
                          <img
                            src={relatedJob.companyLogo}
                            alt={relatedJob.companyName}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiBriefcase className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm line-clamp-1">
                            {relatedJob.role}
                          </h4>
                          <p className="text-gray-600 text-xs">{relatedJob.companyName}</p>
                          <p className="text-gray-500 text-xs">{relatedJob.location}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Link
                    to="/jobs"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    View All Jobs →
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