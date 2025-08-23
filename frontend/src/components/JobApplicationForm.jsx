import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const JobApplicationForm = ({ jobId, jobTitle, onSuccess, onCancel }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [isMatch, setIsMatch] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast.error('Please select a resume file');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/application/apply/${jobId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      const { matchScore, isMatch } = response.data.data;
      setMatchScore(matchScore);
      setIsMatch(isMatch);

      toast.success(`Application submitted successfully! Match Score: ${matchScore}%`);
      
      if (onSuccess) {
        onSuccess(response.data.data.newApplication);
      }
    } catch (error) {
      console.error('Application error:', error);
      const message = error.response?.data?.message || 'Failed to submit application';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Apply for {jobTitle}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF only)
          </Label>
          <Input
            id="resume"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Maximum file size: 5MB
          </p>
        </div>

        {resumeFile && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700">
              Selected: {resumeFile.name}
            </p>
          </div>
        )}

        {matchScore !== null && (
          <div className={`p-3 rounded-md ${
            isMatch ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <p className={`text-sm font-medium ${
              isMatch ? 'text-green-700' : 'text-yellow-700'
            }`}>
              Match Score: {matchScore}% {isMatch ? '✓ Good Match' : '⚠ Low Match'}
            </p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading || !resumeFile}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>• Your resume will be analyzed for job compatibility</p>
        <p>• Applications with higher match scores are prioritized</p>
        <p>• You can only apply once per job</p>
      </div>
    </div>
  );
};

export default JobApplicationForm; 