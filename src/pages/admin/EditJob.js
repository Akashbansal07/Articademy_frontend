import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiPlus, FiX, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { jobApi } from '../../services/api';
import { toast } from 'react-hot-toast';

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobApi.getJob(id);
      const job = response.data;
      
      setFormData({
        companyName: job.companyName || '',
        companyLogo: job.companyLogo || '',
        role: job.role || '',
        location: job.location || '',
        experience: job.experience || '',
        description: job.description || '',
        requiredDegree: job.requiredDegree || '',
        employmentType: job.employmentType || 'Full-Time',
        hiringLink: job.hiringLink || '',
        estPackage: job.estPackage || '',
        skills: job.skills || {
          languages: [],
          technologies: [],
          frameworks: [],
          databases: [],
          tools: [],
          others: []
        },
        keywords: job.keywords || []
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Error loading job details');
      navigate('/admin/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['companyName', 'role', 'location', 'experience', 'description', 'requiredDegree', 'hiringLink'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }

    setSaving(true);
    try {
      await jobApi.updateJob(id, formData);
      toast.success('Job updated successfully!');
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      if (error.response?.data?.existingJob) {
        const existingJob = error.response.data.existingJob;
        toast.error(
          `Duplicate hiring link! This link is already used by "${existingJob.role}" at ${existingJob.companyName}`,
          { duration: 6000 }
        );
      } else {
        toast.error(error.response?.data?.message || 'Error updating job');
      }
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-800">Edit Job</h1>
            <p className="text-gray-600">Update job posting details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            {saving ? (
              <>
                <FiLoader className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave className="h-4 w-4" />
                <span>Update Job</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;