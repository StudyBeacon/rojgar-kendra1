import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Navbar from "./shared/Navbar";

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

  // PDF Generation
  const generatePDF = () => {
    const doc = new jsPDF();
    
    let y = 20;
    
    // Header
    doc.setFillColor(59, 130, 246);
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
    doc.setTextColor(31, 41, 55);
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

  // Live Preview
  const ResumePreview = () => {
    return (
      <div className="bg-white shadow-xl rounded-lg overflow-hidden mt-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-6 text-white bg-blue-600">
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
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              Career Objective
            </h3>
            <p className="text-gray-700">{form.objective}</p>
          </section>
          
          <section className="mb-6">
            <h3 className="font-bold text-lg mb-3 text-blue-600">
              Education
            </h3>
            <ul className="space-y-2">
              {form.education.map((edu, i) => (
                <li key={i} className="border-l-4 pl-4 border-blue-400">
                  <div className="font-semibold">{edu.degree}</div>
                  <div className="text-sm text-gray-600">{edu.institution} ({edu.year})</div>
                </li>
              ))}
            </ul>
          </section>
          
          <section className="mb-6">
            <h3 className="font-bold text-lg mb-3 text-blue-600">
              Work Experience
            </h3>
            <ul className="space-y-4">
              {form.experience.map((exp, i) => (
                <li key={i} className="border-l-4 pl-4 border-blue-400">
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
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              Skills
            </h3>
            <p className="text-gray-700">{form.skills}</p>
          </section>
          
          <section>
            <h3 className="font-bold text-lg mb-3 text-blue-600">
              Projects
            </h3>
            <ul className="space-y-4">
              {form.projects.map((proj, i) => (
                <li key={i} className="border-l-4 pl-4 border-blue-400">
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
            Resume Builder
          </h1>
          
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
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all hover:bg-blue-700"
              >
                Generate Resume
              </button>
              {showPreview && (
                <button
                  type="button"
                  onClick={generatePDF}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition-all hover:bg-green-700"
                >
                  Download Resume
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
