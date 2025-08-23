const axios = require('axios');

// Test the resume download functionality
async function testResumeDownload() {
  try {
    console.log('Testing resume download functionality...');
    
    // First, let's get some applications to test with
    const applicationsResponse = await axios.get('http://localhost:5000/api/v1/application/your-job-id/applicants', {
      withCredentials: true
    });
    
    console.log('Applications found:', applicationsResponse.data.data.applications.length);
    
    // Find an application with a resume
    const applicationWithResume = applicationsResponse.data.data.applications.find(app => app.resumeUrl);
    
    if (applicationWithResume) {
      console.log('Found application with resume:', applicationWithResume._id);
      
      // Test the metadata endpoint
      const metadataResponse = await axios.get(`http://localhost:5000/api/v1/application/${applicationWithResume._id}/resume-metadata`, {
        withCredentials: true
      });
      
      console.log('Resume metadata:', metadataResponse.data.data);
      
      // Test the download endpoint (this will redirect to Cloudinary)
      console.log('Testing download endpoint...');
      const downloadResponse = await axios.get(`http://localhost:5000/api/v1/application/${applicationWithResume._id}/download-resume`, {
        withCredentials: true,
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Accept redirects
        }
      });
      
      console.log('Download response status:', downloadResponse.status);
      console.log('Download response headers:', downloadResponse.headers);
      
    } else {
      console.log('No applications with resumes found');
    }
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testResumeDownload(); 