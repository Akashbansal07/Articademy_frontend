import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiAlertCircle, FiCheckCircle, FiXCircle, FiRefreshCw, FiEye, FiCalendar } from 'react-icons/fi';
import { jobApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const DumpJobs = () => {
  const { hasPermission } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [processingStatus, setProcessingStatus] = useState({});

  useEffect(() => {
    fetchDumpJobs();
  }, [currentPage]);

  const fetchDumpJobs = async () => {
    setLoading(true);
    try {
      const response = await jobApi.getDumpJobs({
        page: currentPage,
        limit: 20
      });
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching dump jobs:', error);
      toast.error('Error fetching dump jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    if (!hasPermission('canCreateJobs')) {
      toast.error('You do not have permission to change job status');
      return;
    }

    setProcessingStatus(prev => ({ ...prev, [jobId]: true }));
    
    try {
      await jobApi.updateJobStatus(jobId, newStatus);
      toast.success(`Job moved to ${newStatus}`);
      fetchDumpJobs(); // Refresh the list
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Error updating job status');
    } finally {
      setProcessingStatus(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const handleProcessStatusChanges = async () => {
    if (!hasPermission('canCreateJobs')) {
      toast.error('You do not have permission to process status changes');
      return;
    }

    try {
      const response = await jobApi.processStatusChanges();
      toast.success(`Processed: ${response.data.result.movedToDump} to dump, ${response.data.result.movedToInactive} to inactive`);
      fetchDumpJobs();
    } catch (error) {
      console.error('Error processing status changes:', error);
      toast.error('Error processing status changes');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysInDump = (movedToDumpAt) => {
    if (!movedToDumpAt) return 0;
    const days = Math.floor((new Date() - new Date(movedToDumpAt)) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getDumpStatusColor = (days) => {
    if (days >= 25) return 'text-red-600 bg-red-50';
    if (days >= 15) return 'text-yellow-600 bg-yellow-50';
    return 'text-blue-600 bg-blue-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dump Jobs</h1>
          <p className="text-gray-600">Jobs waiting for review before becoming inactive</p>
        </div>
        
        {hasPermission('canCreateJobs') && (
          <button
            onClick={handleProcessStatusChanges}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <FiRefreshCw className="h-4 w-4" />
            <span>Process Status Changes</span>
          </button>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FiAlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Automatic Status Management</p>
            <ul className="space-y-1">
              <li>• Jobs are automatically moved to dump after 7 days of being active</li>
              <li>• Jobs in dump for 30 days are automatically marked as inactive</li>
              <li>• You can manually change status before automatic processing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days in Dump
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Analytics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/4"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No jobs in dump. Jobs older than 7 days will appear here automatically.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => {
                  const daysInDump = getDaysInDump(job.movedToDumpAt);
                  const statusColorClass = getDumpStatusColor(daysInDump);
                  
                  return (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {job.companyLogo ? (
                            <img
                              src={job.companyLogo}
                              alt={job.companyName}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-xs font-medium">
                                {job.companyName.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{job.role}</div>
                            <div className="text-sm text-gray-500">{job.location}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{job.companyName}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiCalendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDate(job.datePosted)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColorClass}`}>
                          <FiClock className="h-4 w-4 mr-1" />
                          {daysInDump} days
                        </div>
                        {daysInDump >= 25 && (
                          <p className="text-xs text-red-600 mt-1">
                            Will be inactive in {30 - daysInDump} days
                          </p>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">{job.analytics?.views || 0} views</div>
                          <div className="text-gray-500">{job.analytics?.clicks || 0} clicks</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/jobs/${job._id}`}
                            target="_blank"
                            className="text-blue-600 hover:text-blue-800"
                            title="View Job"
                          >
                            <FiEye className="h-4 w-4" />
                          </Link>
                          
                          {hasPermission('canCreateJobs') && (
                            <>
                              <button
                                onClick={() => handleStatusChange(job._id, 'active')}
                                disabled={processingStatus[job._id]}
                                className="text-green-600 hover:text-green-800 disabled:opacity-50"
                                title="Reactivate Job"
                              >
                                <FiCheckCircle className="h-4 w-4" />
                              </button>
                              
                              <button
                                onClick={() => handleStatusChange(job._id, 'inactive')}
                                disabled={processingStatus[job._id]}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                title="Mark as Inactive"
                              >
                                <FiXCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-700">
              Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, pagination.totalJobs)} of {pagination.totalJobs} jobs
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-700">
                Page {currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DumpJobs;