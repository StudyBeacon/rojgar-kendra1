const axios = require('axios');
const fs = require('fs');
const pdfParse = require('pdf-parse');

/**
 * Extract text from PDF using the ML service
 * @param {string} pdfUrl - URL of the PDF file
 * @returns {Promise<string>} - Extracted text from PDF
 */
const extractTextFromPDF = async (pdfUrl) => {
  try {
    // Read the PDF file from the local path
    const dataBuffer = fs.readFileSync(pdfUrl);
    
    // Parse the PDF and extract text
    const data = await pdfParse(dataBuffer);
    
    // Return the extracted text
    return data.text;
    
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Get resume match score from ML service
 * @param {string} resumeText - Extracted text from resume
 * @param {Object} jobData - Job information
 * @returns {Promise<Object>} - Match score and extracted data
 */
const getResumeMatchScore = async (resumeText, jobData) => {
  try {
    const response = await axios.post('http://localhost:5001/score', {
      resume_text: resumeText,
      job_description: {
        skills: jobData.requirements || [],
        experience: jobData.experienceLevel ? `${jobData.experienceLevel} years` : '',
        description: jobData.description || ''
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error getting resume match score:', error);
    // Return default values if ML service is unavailable
    return {
      match_score: 50,
      is_match: false,
      extracted_skills: ['Skills not detected'],
      extracted_experience: 'Experience not detected'
    };
  }
};

module.exports = {
  extractTextFromPDF,
  getResumeMatchScore
}; 