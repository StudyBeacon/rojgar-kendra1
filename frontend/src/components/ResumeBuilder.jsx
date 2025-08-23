import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Navbar from "./shared/Navbar";

// Professional color themes
const themes = {
  modern: {
    primary: "#2563eb",
    secondary: "#1e40af", 
    accent: "#3b82f6",
    background: "#f8fafc",
    text: "#1f2937"
  },
  elegant: {
    primary: "#7c3aed",
    secondary: "#5b21b6",
    accent: "#8b5cf6", 
    background: "#faf5ff",
    text: "#1f2937"
  },
  corporate: {
    primary: "#059669",
    secondary: "#047857",
    accent: "#10b981",
    background: "#f0fdf4",
    text: "#1f2937"
  },
  creative: {
    primary: "#dc2626",
    secondary: "#b91c1c",
    accent: "#ef4444",
    background: "#fef2f2", 
    text: "#1f2937"
  }
};

// ML-Optimized resume templates for different industries
const mlTemplates = {
  software: {
    objective: "Experienced software developer with expertise in modern web technologies, seeking opportunities to contribute to innovative projects and grow technical skills.",
    skills: "JavaScript, React, Node.js, Python, MongoDB, Git, REST API, Docker, AWS, Agile",
    experienceTemplate: "Developed and maintained web applications using React and Node.js, implemented RESTful APIs, collaborated with cross-functional teams using Agile methodologies, deployed applications using Docker and AWS.",
    educationTemplate: "Bachelor's degree in Computer Science or related field with coursework in algorithms, data structures, and software engineering principles."
  },
  dataScience: {
    objective: "Data scientist with strong analytical skills and experience in machine learning, seeking to leverage data-driven insights to solve complex business problems.",
    skills: "Python, Pandas, NumPy, Scikit-learn, TensorFlow, SQL, Tableau, Jupyter, Machine Learning, Statistical Analysis",
    experienceTemplate: "Applied machine learning algorithms to analyze large datasets, created predictive models, developed data visualization dashboards, performed statistical analysis and hypothesis testing.",
    educationTemplate: "Advanced degree in Data Science, Statistics, or related field with coursework in machine learning, statistics, and programming."
  },
  marketing: {
    objective: "Creative marketing professional with experience in digital marketing strategies, seeking to drive brand growth through innovative campaigns and data-driven insights.",
    skills: "Digital Marketing, Social Media, Google Analytics, SEO, Content Creation, Email Marketing, Campaign Management, Brand Strategy",
    experienceTemplate: "Developed and executed digital marketing campaigns, managed social media presence, analyzed campaign performance using analytics tools, created engaging content for various platforms.",
    educationTemplate: "Bachelor's degree in Marketing, Communications, or related field with coursework in consumer behavior and marketing strategies."
  },
  finance: {
    objective: "Finance professional with strong analytical skills and experience in financial modeling, seeking opportunities to contribute to strategic financial decision-making.",
    skills: "Financial Modeling, Excel, Financial Analysis, Risk Management, Budgeting, Forecasting, Financial Reporting, Investment Analysis",
    experienceTemplate: "Conducted financial analysis and modeling, prepared financial reports and budgets, performed risk assessments, supported strategic financial planning and decision-making.",
    educationTemplate: "Bachelor's degree in Finance, Accounting, or related field with coursework in financial analysis and accounting principles."
  }
};

const initialEducation = [{ degree: "", institution: "", year: "" }];
const initialExperience = [
  { jobTitle: "", company: "", years: "", description: "" },
];
const initialProjects = [{ name: "", link: "", description: "" }];

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    objective: "",
    education: initialEducation,
    experience: initialExperience,
    skills: "",
    projects: initialProjects,
  });
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("modern");
  const [currentTheme] = useState(themes.modern);
  const [showTips, setShowTips] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("software");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Dynamic fields handlers
  const handleDynamicChange = (section, idx, e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = prev[section].map((item, i) =>
        i === idx ? { ...item, [name]: value } : item
      );
      return { ...prev, [section]: updated };
    });
  };

  const addDynamicField = (section, template) => {
    setForm((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...template }],
    }));
  };

  const removeDynamicField = (section, idx) => {
    setForm((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== idx),
    }));
  };

  // ML Optimization: Apply industry template for better matching scores
  const applyIndustryTemplate = () => {
    const template = mlTemplates[selectedIndustry];
    if (template) {
      setForm(prev => ({
        ...prev,
        objective: template.objective,
        skills: template.skills,
        experience: [{
          jobTitle: selectedIndustry === "software" ? "Software Developer" : 
                   selectedIndustry === "dataScience" ? "Data Scientist" :
                   selectedIndustry === "marketing" ? "Digital Marketing Specialist" : "Financial Analyst",
          company: "Professional Company",
          years: "2+ years",
          description: template.experienceTemplate
        }],
        education: [{
          degree: template.educationTemplate.split("degree in")[0] + "degree in Computer Science",
          institution: "University",
          year: "2022"
        }]
      }));
    }
  };

  // ML Optimization: Get industry-specific tips for better scores
  const getIndustryTips = () => {
    const tips = {
      software: [
        "Use specific technology names (React, Node.js, MongoDB)",
        "Include quantifiable achievements (improved performance by 40%)",
        "Mention methodologies (Agile, Scrum, DevOps)",
        "Add technical keywords (REST API, Microservices, Cloud)"
      ],
      dataScience: [
        "Include specific ML algorithms (Random Forest, Neural Networks)",
        "Mention tools (Jupyter, Tableau, Power BI)",
        "Add statistical terms (Hypothesis Testing, A/B Testing)",
        "Include data sizes (analyzed 1M+ records)"
      ],
      marketing: [
        "Use marketing metrics (ROI, CTR, Conversion Rate)",
        "Include platform names (Google Ads, Facebook, LinkedIn)",
        "Mention tools (Google Analytics, HubSpot, Mailchimp)",
        "Add campaign results (increased leads by 50%)"
      ],
      finance: [
        "Include financial terms (DCF, NPV, IRR)",
        "Mention tools (Excel, Bloomberg, QuickBooks)",
        "Add quantifiable results (reduced costs by 25%)",
        "Include compliance knowledge (SOX, GAAP)"
      ]
    };
    return tips[selectedIndustry] || [];
  };





  // Validation
  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!form.objective.trim())
      newErrors.objective = "Career Objective is required";
    if (!form.education[0].degree.trim())
      newErrors.education = "At least one education entry is required";
    if (!form.experience[0].jobTitle.trim())
      newErrors.experience = "At least one experience entry is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced PDF Generation with ML optimization
  const generatePDF = () => {
    const doc = new jsPDF();
    const theme = themes[selectedTheme];
    
    // Set theme colors
    doc.setTextColor(theme.text);
    
    let y = 20;
    
    // Header with theme color
    doc.setFillColor(theme.primary);
    doc.rect(0, 0, 210, 30, 'F');
    
    // Name in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(form.fullName, 20, 18);
    
    // Contact info in header
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Email: ${form.email} | Phone: ${form.phone}`, 20, 25);
    
    // Reset text color for content
    doc.setTextColor(theme.text);
    y = 40;
    
    // Career Objective
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Career Objective", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(form.objective, 20, y, { maxWidth: 170 });
    y += 15;
    
    // Education
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Education", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    form.education.forEach((edu) => {
      doc.text(`${edu.degree} - ${edu.institution} (${edu.year})`, 22, y);
      y += 6;
    });
    y += 8;
    
    // Work Experience
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Work Experience", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    form.experience.forEach((exp) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${exp.jobTitle} at ${exp.company} (${exp.years})`, 22, y);
      y += 6;
      doc.setFont(undefined, 'normal');
      doc.text(exp.description, 24, y, { maxWidth: 160 });
      y += 10;
    });
    y += 5;
    
    // Skills
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Skills", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(form.skills, 22, y);
    y += 8;
    
    // Projects
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("Projects", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    form.projects.forEach((proj) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${proj.name}`, 22, y);
      y += 5;
      doc.setFont(undefined, 'normal');
      doc.text(`Link: ${proj.link}`, 24, y);
      y += 5;
      doc.text(proj.description, 24, y, { maxWidth: 160 });
      y += 8;
    });
    
    doc.save(`resume_${form.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowPreview(true);
    }
  };

  // Enhanced Live Preview with ML analysis
  const ResumePreview = () => {
    const theme = themes[selectedTheme];
    
    return (
      <div className="bg-white shadow-xl rounded-lg overflow-hidden mt-8 max-w-4xl mx-auto">
        {/* Header with theme color */}
        <div 
          className="p-6 text-white"
          style={{ backgroundColor: theme.primary }}
        >
          <h2 className="text-3xl font-bold mb-2">{form.fullName}</h2>
          <div className="text-sm opacity-90">
        <span>{form.email}</span> | <span>{form.phone}</span>
      </div>
          <div className="text-sm mt-2">
        {form.linkedin && (
              <span className="mr-4">LinkedIn: {form.linkedin}</span>
        )}
        {form.github && <span>GitHub: {form.github}</span>}
      </div>
        </div>
        

        
        {/* Content */}
        <div className="p-6">
          <section className="mb-6">
            <h3 className="font-bold text-lg mb-2" style={{ color: theme.primary }}>
              Career Objective
            </h3>
            <p className="text-gray-700">{form.objective}</p>
      </section>
          
          <section className="mb-6">
            <h3 className="font-bold text-lg mb-3" style={{ color: theme.primary }}>
              Education
            </h3>
            <ul className="space-y-2">
          {form.education.map((edu, i) => (
                <li key={i} className="border-l-4 pl-4" style={{ borderColor: theme.accent }}>
                  <div className="font-semibold">{edu.degree}</div>
                  <div className="text-sm text-gray-600">{edu.institution} ({edu.year})</div>
            </li>
          ))}
        </ul>
      </section>
          
          <section className="mb-6">
            <h3 className="font-bold text-lg mb-3" style={{ color: theme.primary }}>
              Work Experience
            </h3>
            <ul className="space-y-4">
          {form.experience.map((exp, i) => (
                <li key={i} className="border-l-4 pl-4" style={{ borderColor: theme.accent }}>
                  <div className="font-semibold">
                    {exp.jobTitle} at {exp.company}
              </div>
                  <div className="text-sm text-gray-600 mb-1">({exp.years})</div>
                  <div className="text-gray-700">{exp.description}</div>
            </li>
          ))}
        </ul>
      </section>
          
          <section className="mb-6">
            <h3 className="font-bold text-lg mb-2" style={{ color: theme.primary }}>
              Skills
            </h3>
            <p className="text-gray-700">{form.skills}</p>
      </section>
          
      <section>
            <h3 className="font-bold text-lg mb-3" style={{ color: theme.primary }}>
              Projects
            </h3>
            <ul className="space-y-4">
          {form.projects.map((proj, i) => (
                <li key={i} className="border-l-4 pl-4" style={{ borderColor: theme.accent }}>
                  <div className="font-semibold">{proj.name}</div>
                  <div className="text-sm text-gray-600 mb-1">
                <a
                  href={proj.link}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {proj.link}
                </a>
              </div>
                  <div className="text-gray-700">{proj.description}</div>
            </li>
          ))}
        </ul>
      </section>
        </div>
    </div>
  );
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-10 px-2">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🚀 Smart Resume Builder
        </h1>
        
        {/* ML Optimization Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mb-6 border border-blue-200">
          <h2 className="text-xl font-bold mb-4 text-blue-800">🎯 Industry Templates for Better Matching</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-blue-700 mb-2">Select Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full border border-blue-300 rounded px-3 py-2 bg-white"
              >
                <option value="software">Software Development</option>
                <option value="dataScience">Data Science</option>
                <option value="marketing">Digital Marketing</option>
                <option value="finance">Finance & Accounting</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={applyIndustryTemplate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                🎨 Apply Industry Template
              </button>
            </div>
          </div>
          
          {/* Industry-specific tips */}
          <div className="mt-4">
            <h4 className="font-medium text-blue-700 mb-2">💡 Tips for {selectedIndustry === "software" ? "Software Development" : 
              selectedIndustry === "dataScience" ? "Data Science" : 
              selectedIndustry === "marketing" ? "Digital Marketing" : "Finance & Accounting"}:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              {getIndustryTips().map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          
          <p className="text-sm text-blue-600 mt-3">
            🚀 These templates use industry-standard keywords and structure that work better with job matching algorithms!
          </p>
        </div>
        
        {/* Theme Selector */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Choose Theme</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedTheme(key)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedTheme === key 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: theme.background }}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                  <span className="capitalize font-medium" style={{ color: theme.text }}>
                    {key}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
              {errors.fullName && (
                <span className="text-red-500 text-xs">{errors.fullName}</span>
              )}
            </div>
            <div>
              <label className="block font-medium">Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">{errors.email}</span>
              )}
            </div>
            <div>
              <label className="block font-medium">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
              {errors.phone && (
                <span className="text-red-500 text-xs">{errors.phone}</span>
              )}
            </div>
            <div>
              <label className="block font-medium">LinkedIn Profile</label>
              <input
                type="text"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="block font-medium">GitHub Profile</label>
              <input
                type="text"
                name="github"
                value={form.github}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </div>
          </div>
          <div>
            <label className="block font-medium">Career Objective *</label>
            <textarea
              name="objective"
              value={form.objective}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              rows={2}
            />
            {errors.objective && (
              <span className="text-red-500 text-xs">{errors.objective}</span>
            )}
          </div>
          {/* Education Section */}
          <div>
            <label className="block font-medium">Education *</label>
            {form.education.map((edu, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-2 mb-2">
                <input
                  type="text"
                  name="degree"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleDynamicChange("education", idx, e)}
                  className="border rounded px-2 py-1 flex-1"
                />
                <input
                  type="text"
                  name="institution"
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => handleDynamicChange("education", idx, e)}
                  className="border rounded px-2 py-1 flex-1"
                />
                <input
                  type="text"
                  name="year"
                  placeholder="Year"
                  value={edu.year}
                  onChange={(e) => handleDynamicChange("education", idx, e)}
                  className="border rounded px-2 py-1 w-24"
                />
                {form.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDynamicField("education", idx)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addDynamicField("education", {
                  degree: "",
                  institution: "",
                  year: "",
                })
              }
              className="text-blue-600 mt-1"
            >
              + Add Education
            </button>
            {errors.education && (
              <span className="text-red-500 text-xs block">
                {errors.education}
              </span>
            )}
          </div>
          {/* Experience Section */}
          <div>
            <label className="block font-medium">Work Experience *</label>
            {form.experience.map((exp, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-2 mb-2">
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title"
                  value={exp.jobTitle}
                  onChange={(e) => handleDynamicChange("experience", idx, e)}
                  className="border rounded px-2 py-1 flex-1"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleDynamicChange("experience", idx, e)}
                  className="border rounded px-2 py-1 flex-1"
                />
                <input
                  type="text"
                  name="years"
                  placeholder="Years"
                  value={exp.years}
                  onChange={(e) => handleDynamicChange("experience", idx, e)}
                  className="border rounded px-2 py-1 w-24"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => handleDynamicChange("experience", idx, e)}
                  className="border rounded px-2 py-1 flex-1"
                />
                {form.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDynamicField("experience", idx)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addDynamicField("experience", {
                  jobTitle: "",
                  company: "",
                  years: "",
                  description: "",
                })
              }
              className="text-blue-600 mt-1"
            >
              + Add Experience
            </button>
            {errors.experience && (
              <span className="text-red-500 text-xs block">
                {errors.experience}
              </span>
            )}
          </div>
          {/* Skills */}
          <div>
            <label className="block font-medium">
              Skills (comma separated) *
            </label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="e.g., JavaScript, React, Node.js, MongoDB, Git"
            />
            <p className="text-sm text-gray-500 mt-1">
              💡 Use specific technology names and industry-standard terms for better job matching
            </p>
          </div>
          {/* Projects */}
          <div>
            <label className="block font-medium">Projects</label>
            {form.projects.map((proj, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-2 mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Project Name"
                  value={proj.name}
                  onChange={(e) => handleDynamicChange("projects", idx, e)}
                  className="border rounded px-2 py-1 flex-1"
                />
                <input
                  type="text"
                  name="link"
                  placeholder="Project Link"
                  value={proj.link}
                  onChange={(e) => handleDynamicChange("projects", idx, e)}
                  className="border rounded px-2 py-1 flex-1"
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) => handleDynamicChange("projects", idx, e)}
                  className="border rounded px-2 py-1 flex-1"
                />
                {form.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDynamicField("projects", idx)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addDynamicField("projects", {
                  name: "",
                  link: "",
                  description: "",
                })
              }
              className="text-blue-600 mt-1"
            >
              + Add Project
            </button>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
              style={{ 
                backgroundColor: themes[selectedTheme].primary,
                color: 'white'
              }}
            >
              🚀 Generate Resume
            </button>
            {showPreview && (
              <button
                type="button"
                onClick={generatePDF}
                className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
                style={{ 
                  backgroundColor: themes[selectedTheme].accent,
                  color: 'white'
                }}
              >
                📥 Download Resume
              </button>
            )}
          </div>
        </form>
        {showPreview && <ResumePreview />}
      </div>
    </div>
    </>
  );
}
