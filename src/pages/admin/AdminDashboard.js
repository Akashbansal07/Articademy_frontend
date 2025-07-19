import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiUsers, FiEye, FiMousePointer, FiTrendingUp, FiCalendar, FiPlus, FiBarChart2 } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { analyticsApi, jobApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { admin, hasPermission } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsResponse, jobsResponse] = await Promise.all([
        analyticsApi.getDashboard({ days: dateRange }),
        jobApi.getAdminJobs({ limit: 5, sortBy: 'datePosted', sortOrder: 'desc' })
      ]);

      setAnalytics(analyticsResponse.data);
      setRecentJobs(jobsResponse.data.jobs);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = (dailyAnalytics) => {
    if (!dailyAnalytics) return [];
    
    return dailyAnalytics.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visits: day.websiteVisits,
      uniqueVisitors: day.uniqueVisitors.length,
      jobViews: day.jobViews.reduce((sum, view) => sum + view.count, 0),
      jobClicks: day.jobClicks.reduce((sum, click) => sum + click.count, 0)
    }));
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <FiTrendingUp className="h-4 w-4 mr-1" />
              {trend > 0 ? '+' : ''}{trend}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const chartData = formatChartData(analytics?.dailyAnalytics);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {admin?.username}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          
          {hasPermission('canCreateJobs') && (
            <Link
              to="/admin/jobs/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FiPlus className="h-4 w-4" />
              <span>Add Job</span>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Website Visits"
            value={analytics.totalVisits.toLocaleString()}
            icon={FiEye}
            color="blue"
          />
          <StatCard
            title="Unique Visitors"
            value={analytics.totalUniqueVisitors.toLocaleString()}
            icon={FiUsers}
            color="green"
          />
          <StatCard
            title="Job Views"
            value={analytics.totalJobViews.toLocaleString()}
            icon={FiBriefcase}
            color="purple"
          />
          <StatCard
            title="Job Clicks"
            value={analytics.totalJobClicks.toLocaleString()}
            icon={FiMousePointer}
            color="orange"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Website Traffic Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Website Traffic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="uniqueVisitors" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Job Engagement Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Engagement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jobViews" fill="#8b5cf6" />
              <Bar dataKey="jobClicks" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Jobs and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Jobs</h3>
            <Link
              to="/admin/jobs"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job._id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiBriefcase className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">{job.role}</h4>
                  <p className="text-gray-600 text-xs">{job.companyName}</p>
                  <p className="text-gray-500 text-xs">{job.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{job.analytics?.views || 0} views</p>
                  <p className="text-xs text-gray-500">
                    {new Date(job.datePosted).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {hasPermission('canCreateJobs') && (
              <Link
                to="/admin/jobs/create"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FiPlus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Create New Job</h4>
                  <p className="text-sm text-gray-600">Post a new job opening</p>
                </div>
              </Link>
            )}
            
            {hasPermission('canViewAnalytics') && (
              <Link
                to="/admin/analytics"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-green-100 p-2 rounded-lg">
                  <FiBarChart2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">View Analytics</h4>
                  <p className="text-sm text-gray-600">Detailed analytics and reports</p>
                </div>
              </Link>
            )}
            
            {hasPermission('canManageAdmins') && (
              <Link
                to="/admin/admins"
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FiUsers className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Manage Admins</h4>
                  <p className="text-sm text-gray-600">Add or remove admin users</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Conversion Rate */}
      {analytics && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analytics.conversionRate}%
              </div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-xs text-gray-500">Views to clicks ratio</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round(analytics.totalVisits / dateRange)}
              </div>
              <p className="text-sm text-gray-600">Avg Daily Visits</p>
              <p className="text-xs text-gray-500">Last {dateRange} days</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round(analytics.totalJobViews / dateRange)}
              </div>
              <p className="text-sm text-gray-600">Avg Daily Job Views</p>
              <p className="text-xs text-gray-500">Last {dateRange} days</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;