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
    let y = 15;
    doc.setFontSize(22);
    doc.text(form.fullName, 10, y);
    doc.setFontSize(12);
    y += 8;
    doc.text(`Email: ${form.email}`, 10, y);
    y += 7;
    doc.text(`Phone: ${form.phone}`, 10, y);
    y += 7;
    if (form.linkedin) {
      doc.text(`LinkedIn: ${form.linkedin}`, 10, y);
      y += 7;
    }
    if (form.github) {
      doc.text(`GitHub: ${form.github}`, 10, y);
      y += 7;
    }
    y += 2;
    doc.setFontSize(16);
    doc.text("Career Objective", 10, y);
    y += 7;
    doc.setFontSize(12);
    doc.text(form.objective, 10, y, { maxWidth: 190 });
    y += 12;
    doc.setFontSize(16);
    doc.text("Education", 10, y);
    y += 7;
    doc.setFontSize(12);
    form.education.forEach((edu) => {
      doc.text(`${edu.degree} - ${edu.institution} (${edu.year})`, 12, y);
      y += 7;
    });
    y += 2;
    doc.setFontSize(16);
    doc.text("Work Experience", 10, y);
    y += 7;
    doc.setFontSize(12);
    form.experience.forEach((exp) => {
      doc.text(`${exp.jobTitle} at ${exp.company} (${exp.years})`, 12, y);
      y += 6;
      doc.text(exp.description, 14, y, { maxWidth: 180 });
      y += 8;
    });
    y += 2;
    doc.setFontSize(16);
    doc.text("Skills", 10, y);
    y += 7;
    doc.setFontSize(12);
    doc.text(form.skills, 12, y);
    y += 8;
    doc.setFontSize(16);
    doc.text("Projects", 10, y);
    y += 7;
    doc.setFontSize(12);
    form.projects.forEach((proj) => {
      doc.text(`${proj.name} (${proj.link})`, 12, y);
      y += 6;
      doc.text(proj.description, 14, y, { maxWidth: 180 });
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

  // Live Preview (simple, not PDF)
  const ResumePreview = () => (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{form.fullName}</h2>
      <div className="text-sm text-gray-600 mb-2">
        <span>{form.email}</span> | <span>{form.phone}</span>
      </div>
      <div className="text-sm text-blue-600 mb-2">
        {form.linkedin && (
          <span className="mr-2">LinkedIn: {form.linkedin}</span>
        )}
        {form.github && <span>GitHub: {form.github}</span>}
      </div>
      <section className="mb-4">
        <h3 className="font-semibold">Career Objective</h3>
        <p>{form.objective}</p>
      </section>
      <section className="mb-4">
        <h3 className="font-semibold">Education</h3>
        <ul>
          {form.education.map((edu, i) => (
            <li key={i}>
              {edu.degree} - {edu.institution} ({edu.year})
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-4">
        <h3 className="font-semibold">Work Experience</h3>
        <ul>
          {form.experience.map((exp, i) => (
            <li key={i} className="mb-2">
              <div className="font-medium">
                {exp.jobTitle} at {exp.company} ({exp.years})
              </div>
              <div className="text-sm">{exp.description}</div>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-4">
        <h3 className="font-semibold">Skills</h3>
        <p>{form.skills}</p>
      </section>
      <section>
        <h3 className="font-semibold">Projects</h3>
        <ul>
          {form.projects.map((proj, i) => (
            <li key={i} className="mb-2">
              <div className="font-medium">
                {proj.name}{" "}
                <a
                  href={proj.link}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {proj.link}
                </a>
              </div>
              <div className="text-sm">{proj.description}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 py-10 px-2">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Smart Resume Builder
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
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
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
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Generate Resume
            </button>
            {showPreview && (
              <button
                type="button"
                onClick={generatePDF}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
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
