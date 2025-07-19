import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiUpload, FiPlus, FiX, FiArrowLeft, FiCode, FiAlertCircle, FiExternalLink } from 'react-icons/fi';
import { jobApi } from '../../services/api';
import { toast } from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('form');
  const [loading, setLoading] = useState(false);
  const [duplicateJob, setDuplicateJob] = useState(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyLogo: '',
    role: '',
    location: '',
    experience: '',
    description: '',
    requiredDegree: '',
    employmentType: 'Full-Time',
    hiringLink: '',
    estPackage: '',
    skills: {
      languages: [],
      technologies: [],
      frameworks: [],
      databases: [],
      tools: [],
      others: []
    },
    keywords: []
  });
  const [jsonData, setJsonData] = useState('');
  const [skillInputs, setSkillInputs] = useState({
    languages: '',
    technologies: '',
    frameworks: '',
    databases: '',
    tools: '',
    others: ''
  });
  const [keywordInput, setKeywordInput] = useState('');

  const experienceOptions = [
    '0-1', '1-2', '2-3', '3+', '4+', '5+', '6+', 
    'intern', '2026 passout', '2025 passout', '2027 passout'
  ];

  const employmentTypes = [
    'Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const checkDuplicateHiringLink = async (hiringLink) => {
    try {
      const response = await jobApi.checkDuplicateHiringLink(hiringLink);
      if (response.data.isDuplicate) {
        setDuplicateJob(response.data.existingJob);
        setShowDuplicateModal(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  };

  const handleSkillAdd = (category) => {
    const skill = skillInputs[category].trim();
    if (skill && !formData.skills[category].includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill]
        }
      }));
      setSkillInputs(prev => ({
        ...prev,
        [category]: ''
      }));
    }
  };

  const handleSkillRemove = (category, skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter(skill => skill !== skillToRemove)
      }
    }));
  };

  const handleKeywordAdd = () => {
    const keyword = keywordInput.trim();
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }));
      setKeywordInput('');
    }
  };

  const handleKeywordRemove = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['companyName', 'role', 'location', 'experience', 'description', 'requiredDegree', 'hiringLink'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    // Check for duplicate hiring link
    const isDuplicate = await checkDuplicateHiringLink(formData.hiringLink);
    if (isDuplicate) {
      return;
    }

    setLoading(true);
    try {
      await jobApi.createJob(formData);
      toast.success('Job created successfully!');
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      if (error.response?.data?.existingJob) {
        setDuplicateJob(error.response.data.existingJob);
        setShowDuplicateModal(true);
      } else {
        toast.error(error.response?.data?.message || 'Error creating job');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJsonSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const parsedData = JSON.parse(jsonData);
      
      if (!parsedData.jobs || !Array.isArray(parsedData.jobs)) {
        toast.error('JSON must contain a "jobs" array');
        return;
      }

      setLoading(true);
      const response = await jobApi.createBulkJobs(parsedData.jobs);
      
      const { summary, duplicates, errors } = response.data;
      
      if (summary.created > 0) {
        toast.success(`${summary.created} jobs created successfully!`);
      }
      
      if (duplicates && duplicates.length > 0) {
        toast.error(`${duplicates.length} jobs rejected due to duplicate hiring links`);
        console.log('Duplicate jobs:', duplicates);
      }
      
      if (errors && errors.length > 0) {
        toast.error(`${errors.length} jobs failed to create`);
        console.error('Errors:', errors);
      }
      
      if (summary.created > 0) {
        navigate('/admin/jobs');
      }
    } catch (error) {
      console.error('Error creating jobs:', error);
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON format');
      } else {
        toast.error(error.response?.data?.message || 'Error creating jobs');
      }
    } finally {
      setLoading(false);
    }
  };

  const DuplicateJobModal = () => {
    if (!showDuplicateModal || !duplicateJob) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <FiAlertCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">Duplicate Job Detected</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            A job with this hiring link already exists in active jobs:
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2">
              <p className="font-semibold text-gray-900">{duplicateJob.role}</p>
              <p className="text-sm text-gray-600">{duplicateJob.companyName}</p>
              <p className="text-sm text-gray-600">{duplicateJob.location}</p>
              <p className="text-sm text-gray-500">
                Posted on: {new Date(duplicateJob.datePosted).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDuplicateModal(false);
                setDuplicateJob(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                navigate(`/admin/jobs/edit/${duplicateJob._id}`);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FiExternalLink className="h-4 w-4" />
              <span>View/Edit Existing Job</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const jsonExample = `{
  "jobs": [
    {
      "companyName": "Tech Corp",
      "companyLogo": "https://example.com/logo.png",
      "role": "Frontend Developer",
      "location": "San Francisco, CA",
      "experience": "2-3",
      "description": "We are looking for a skilled Frontend Developer...",
      "requiredDegree": "Bachelor's degree in Computer Science",
      "employmentType": "Full-Time",
      "hiringLink": "https://company.com/apply",
      "estPackage": "8-12 LPA",
      "skills": {
        "languages": ["JavaScript", "TypeScript"],
        "technologies": ["React", "Node.js"],
        "frameworks": ["Next.js", "Express"],
        "databases": ["MongoDB", "PostgreSQL"],
        "tools": ["Git", "Docker"],
        "others": ["REST APIs", "GraphQL"]
      },
      "keywords": ["frontend", "react", "javascript"]
    }
  ]
}`;

  const SkillSection = ({ title, category, placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={placeholder}
            value={skillInputs[category]}
            onChange={(e) => setSkillInputs(prev => ({ ...prev, [category]: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSkillAdd(category))}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => handleSkillAdd(category)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="h-4 w-4" />
          </button>
        </div>
        
        {formData.skills[category].length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.skills[category].map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillRemove(category, skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/jobs')}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Create New Job</h1>
            <p className="text-gray-600">Add a new job posting to your portal</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FiAlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Duplicate Prevention</p>
            <p>Jobs with duplicate hiring links in active status will be automatically rejected to prevent duplicates.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('form')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'form'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Form Input
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'json'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            JSON Upload
          </button>
        </nav>
      </div>

      {/* Form Tab */}
      {activeTab === 'form' && (
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo URL
                </label>
                <input
                  type="url"
                  name="companyLogo"
                  value={formData.companyLogo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Role *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience *
                </label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Experience</option>
                  {experienceOptions.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type *
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {employmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hiring Link *
                </label>
                <input
                  type="url"
                  name="hiringLink"
                  value={formData.hiringLink}
                  onChange={handleInputChange}
                  required
                  placeholder="https://company.com/apply"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Package
                </label>
                <input
                  type="text"
                  name="estPackage"
                  value={formData.estPackage}
                  onChange={handleInputChange}
                  placeholder="8-12 LPA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the job responsibilities, requirements, and benefits..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Degree *
                </label>
                <textarea
                  name="requiredDegree"
                  value={formData.requiredDegree}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Bachelor's degree in Computer Science or related field..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Keywords</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillSection 
                title="Programming Languages" 
                category="languages" 
                placeholder="e.g., JavaScript, Python, Java"
              />
              
              <SkillSection 
                title="Technologies" 
                category="technologies" 
                placeholder="e.g., React, Node.js, Docker"
              />
              
              <SkillSection 
                title="Frameworks" 
                category="frameworks" 
                placeholder="e.g., Express, Django, Spring"
              />
              
              <SkillSection 
                title="Databases" 
                category="databases" 
                placeholder="e.g., MongoDB, PostgreSQL, MySQL"
              />
              
              <SkillSection 
                title="Tools" 
                category="tools" 
                placeholder="e.g., Git, VS Code, Postman"
              />
              
              <SkillSection 
                title="Other Skills" 
                category="others" 
                placeholder="e.g., REST APIs, GraphQL, Testing"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add searchable keywords"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleKeywordAdd())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleKeywordAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
                
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleKeywordRemove(keyword)}
                          className="ml-2 text-gray-600 hover:text-gray-800"
                        >
                          <FiX className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/jobs')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FiSave className="h-4 w-4" />
              )}
              <span>{loading ? 'Creating...' : 'Create Job'}</span>
            </button>
          </div>
        </form>
      )}

      {/* JSON Tab */}
      {activeTab === 'json' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">JSON Format Guide</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <FiAlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Duplicate Prevention</p>
                  <p>Jobs with duplicate hiring links will be skipped during bulk upload. You'll see a summary of created, duplicated, and failed jobs.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Required Fields:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <code>companyName</code> - Company name</li>
                <li>• <code>role</code> - Job title/position</li>
                <li>• <code>location</code> - Job location</li>
                <li>• <code>experience</code> - One of: {experienceOptions.join(', ')}</li>
                <li>• <code>description</code> - Job description</li>
                <li>• <code>requiredDegree</code> - Required qualifications</li>
                <li>• <code>hiringLink</code> - Valid URL for applications (must be unique)</li>
              </ul>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Example JSON:</span>
                <button
                  onClick={() => setJsonData(jsonExample)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                >
                  <FiCode className="h-3 w-3" />
                  <span>Use Example</span>
                </button>
              </div>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                {jsonExample}
              </pre>
            </div>
          </div>

          <form onSubmit={handleJsonSubmit} className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">JSON Data</h3>
              
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder="Paste your JSON data here..."
                rows={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/jobs')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiUpload className="h-4 w-4" />
                )}
                <span>{loading ? 'Uploading...' : 'Upload Jobs'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Duplicate Job Modal */}
      <DuplicateJobModal />
    </div>
  );
};

export default CreateJob;