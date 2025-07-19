import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiEye, FiMousePointer, FiUsers, FiDownload, FiCalendar, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { analyticsApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const { hasPermission } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [jobAnalytics, setJobAnalytics] = useState([]);
  const [companyAnalytics, setCompanyAnalytics] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(7);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (hasPermission('canViewAnalytics')) {
      fetchAnalytics();
    }
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [
        dashboardResponse,
        jobsResponse,
        companiesResponse,
        trendsResponse
      ] = await Promise.all([
        analyticsApi.getDashboard({ days: dateRange }),
        analyticsApi.getJobAnalytics({ days: dateRange, limit: 10 }),
        analyticsApi.getCompanyAnalytics({ days: dateRange, limit: 10 }),
        analyticsApi.getTrends({ days: dateRange })
      ]);

      setAnalytics(dashboardResponse.data);
      setJobAnalytics(jobsResponse.data);
      setCompanyAnalytics(companiesResponse.data);
      setTrends(trendsResponse.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Error fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format = 'json') => {
    try {
      const response = await analyticsApi.exportAnalytics({ days: dateRange, format });
      
      if (format === 'csv') {
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${dateRange}days.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${dateRange}days.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      
      toast.success(`Analytics exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast.error('Error exporting analytics');
    }
  };

  const formatChartData = (trendsData) => {
    if (!trendsData) return [];
    
    return trendsData.trends.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visits: day.websiteVisits,
      uniqueVisitors: day.uniqueVisitors,
      jobViews: day.totalJobViews,
      jobClicks: day.totalJobClicks
    }));
  };

  const getDeviceData = () => {
    if (!trends?.trends?.length) return [];
    
    const deviceTotals = trends.trends.reduce((acc, day) => {
      acc.desktop += day.deviceInfo.desktop;
      acc.mobile += day.deviceInfo.mobile;
      acc.tablet += day.deviceInfo.tablet;
      return acc;
    }, { desktop: 0, mobile: 0, tablet: 0 });

    return [
      { name: 'Desktop', value: deviceTotals.desktop, color: '#3b82f6' },
      { name: 'Mobile', value: deviceTotals.mobile, color: '#10b981' },
      { name: 'Tablet', value: deviceTotals.tablet, color: '#f59e0b' }
    ];
  };

  const getBrowserData = () => {
    if (!trends?.trends?.length) return [];
    
    const browserTotals = trends.trends.reduce((acc, day) => {
      acc.chrome += day.browserInfo.chrome;
      acc.firefox += day.browserInfo.firefox;
      acc.safari += day.browserInfo.safari;
      acc.edge += day.browserInfo.edge;
      acc.others += day.browserInfo.others;
      return acc;
    }, { chrome: 0, firefox: 0, safari: 0, edge: 0, others: 0 });

    return [
      { name: 'Chrome', value: browserTotals.chrome, color: '#3b82f6' },
      { name: 'Firefox', value: browserTotals.firefox, color: '#ef4444' },
      { name: 'Safari', value: browserTotals.safari, color: '#06b6d4' },
      { name: 'Edge', value: browserTotals.edge, color: '#8b5cf6' },
      { name: 'Others', value: browserTotals.others, color: '#6b7280' }
    ];
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

  if (!hasPermission('canViewAnalytics')) {
    return (
      <div className="text-center py-12">
        <FiBarChart2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to view analytics</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
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
        
        <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const chartData = formatChartData(trends);
  const deviceData = getDeviceData();
  const browserData = getBrowserData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600">Track your job portal performance</p>
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
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('json')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FiDownload className="h-4 w-4" />
              <span>Export JSON</span>
            </button>
            
            <button
              onClick={() => handleExport('csv')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FiDownload className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
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
            icon={FiBarChart2}
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

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: FiBarChart2 },
            { id: 'jobs', label: 'Job Performance', icon: FiTrendingUp },
            { id: 'companies', label: 'Company Stats', icon: FiUsers },
            { id: 'devices', label: 'Device & Browser', icon: FiPieChart }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Traffic Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Website Traffic</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={2} name="Visits" />
                <Line type="monotone" dataKey="uniqueVisitors" stroke="#10b981" strokeWidth={2} name="Unique Visitors" />
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
                <Bar dataKey="jobViews" fill="#8b5cf6" name="Views" />
                <Bar dataKey="jobClicks" fill="#f59e0b" name="Clicks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Jobs</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Job Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Clicks</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {jobAnalytics.map((job, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{job.role}</td>
                    <td className="py-3 px-4 text-gray-700">{job.companyName}</td>
                    <td className="py-3 px-4 text-gray-700">{job.views}</td>
                    <td className="py-3 px-4 text-gray-700">{job.clicks}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(job.conversionRate) > 5
                          ? 'bg-green-100 text-green-800'
                          : parseFloat(job.conversionRate) > 2
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {job.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'companies' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Company Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Clicks</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {companyAnalytics.map((company, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{company.company}</td>
                    <td className="py-3 px-4 text-gray-700">{company.views}</td>
                    <td className="py-3 px-4 text-gray-700">{company.clicks}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(company.conversionRate) > 5
                          ? 'bg-green-100 text-green-800'
                          : parseFloat(company.conversionRate) > 2
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {company.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Distribution */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Browser Distribution */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Browser Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={browserData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {browserData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Performance Summary */}
      {trends && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {trends.summary.avgDailyVisits}
              </div>
              <p className="text-sm text-gray-600">Avg Daily Visits</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {trends.summary.avgDailyUniqueVisitors}
              </div>
              <p className="text-sm text-gray-600">Avg Daily Unique Visitors</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {trends.summary.avgDailyJobViews}
              </div>
              <p className="text-sm text-gray-600">Avg Daily Job Views</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {trends.summary.conversionRate}%
              </div>
              <p className="text-sm text-gray-600">Overall Conversion Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;