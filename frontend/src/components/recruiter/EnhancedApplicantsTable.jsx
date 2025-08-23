import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { toast } from 'sonner';
import axios from 'axios';

const EnhancedApplicantsTable = ({ jobId, jobTitle }) => {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingResume, setDownloadingResume] = useState(null);

  const fetchApplications = async (filterType = 'all') => {
    try {
      const endpoint = filterType === 'matched' 
        ? `/api/v1/application/${jobId}/matched-applicants`
        : `/api/v1/application/${jobId}/applicants?filter=${filterType}`;

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
        {
          withCredentials: true
        }
      );

      console.log('Fetched applications:', response.data.data.applications);
      setApplications(response.data.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/application/${jobId}/stats`,
        {
          withCredentials: true
        }
      );

      setStats(response.data.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchApplications(filter);
    fetchStats();
    setIsLoading(false);
  }, [jobId, filter]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/application/${applicationId}/update-status`,
        { status: newStatus },
        {
          withCredentials: true
        }
      );

      toast.success(`Application ${newStatus} successfully`);
      
      // Refresh data
      fetchApplications(filter);
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    }
  };

  const downloadResume = async (applicationId, applicantName) => {
    try {
      setDownloadingResume(applicationId);
      
      // Create a temporary link to trigger the download
      const downloadUrl = `${import.meta.env.VITE_BACKEND_URL}/api/v1/application/${applicationId}/download-resume`;
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${applicantName}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Resume download started');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    } finally {
      setDownloadingResume(null);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  // Handle case where applications data is malformed
  if (!Array.isArray(applications)) {
    return <div className="text-center py-8 text-red-600">Error: Invalid applications data</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Applicants for {jobTitle}</h2>
        
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.matchedApplications}</div>
              <div className="text-sm text-gray-600">Matched</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.shortlistedApplications}</div>
              <div className="text-sm text-gray-600">Shortlisted</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.rejectedApplications}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(stats.averageMatchScore || 0)}%
              </div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter applications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="matched">Matched Only (≥60%)</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              applications
                .filter(application => application.applicant) // Only show applications with valid applicant data
                .map((application) => {
                  try {
                    return (
                      <TableRow key={application._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{application.applicant?.name || 'Unknown Applicant'}</div>
                      <div className="text-sm text-gray-500">{application.applicant?.email || 'No email'}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getMatchScoreColor(application.matchScore)}>
                      {application.matchScore}%
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {application.extractedSkills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {application.extractedSkills?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{application.extractedSkills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {application.extractedExperience || 'Not specified'}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-2">
                      {application.resumeUrl ? (
                        <div className="flex flex-col space-y-1">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                console.log('Resume URL:', application.resumeUrl)
                                console.log('Application ID:', application._id)
                                // If it's a Cloudinary URL, open it directly
                                if (application.resumeUrl && application.resumeUrl.startsWith('http')) {
                                  console.log('Opening Cloudinary URL directly')
                                  window.open(application.resumeUrl, '_blank')
                                } else if (application.resumeUrl && application.resumeUrl.startsWith('uploads/')) {
                                  console.log('Opening local file directly')
                                  window.open(`${import.meta.env.VITE_BACKEND_URL}/${application.resumeUrl}`, '_blank')
                                } else {
                                  console.log('Using backend route for local file')
                                  window.open(`${import.meta.env.VITE_BACKEND_URL}/api/v1/application/${application._id}/download-resume`, '_blank')
                                }
                              }}
                            >
                              👁️ View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadResume(application._id, application.applicant?.name || 'Unknown')}
                              disabled={downloadingResume === application._id}
                            >
                              {downloadingResume === application._id ? (
                                '⏳ Downloading...'
                              ) : (
                                '📥 Download'
                              )}
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500">
                            PDF • {(application.applicant?.name || 'Unknown').replace(/\s+/g, '_')}_resume.pdf
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 px-2 py-1">
                          No Resume
                        </span>
                      )}
                      
                      {application.status === 'applied' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(application._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      
                      {application.status === 'shortlisted' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(application._id, 'rejected')}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
                  } catch (error) {
                    console.error('Error rendering application row:', error, application);
                    return (
                      <TableRow key={application._id}>
                        <TableCell colSpan={7} className="text-center py-4 text-red-600">
                          Error rendering application data
                        </TableCell>
                      </TableRow>
                    );
                  }
                })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EnhancedApplicantsTable; 