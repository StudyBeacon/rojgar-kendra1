const mongoose = require("mongoose");
const Application = require("../models/applicationModel")
const Job = require("../models/jobModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const Notification = require("../models/notificationModel");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");
const { extractTextFromPDF, getResumeMatchScore } = require("../utils/pdfParser");

exports.applyJob = catchAsync(async (req, res, next) => {
  const userId = req.user.id
  const jobId = req.params.jobId

  if (!jobId) return next(new AppError("jobId not found in params", 400))

  // Check if resume file is uploaded
  if (!req.file) {
    return next(new AppError("Resume PDF is required", 400))
  }

  // Check if the job exists
  const job = await Job.findById(jobId)
  if (!job)
    return next(new AppError(`No such job found with id - ${jobId}`, 404))

  if (job.flagged) {
    return next(new AppError("This job is under review and cannot be applied to.", 403));
  }

  // Check for existing application
  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId,
  })

  if (existingApplication)
    return next(new AppError("You've already applied for this job", 400))

  // Get resume URL from uploaded file
  const resumeUrl = req.file.path

  // Extract text from PDF
  const resumeText = await extractTextFromPDF(resumeUrl)

  // Get ML match score
  const matchData = await getResumeMatchScore(resumeText, job)

  // Create a new application with resume and matching data
  const newApplication = await Application.create({
    job: jobId,
    applicant: userId,
    resumeUrl: resumeUrl,
    resumeText: resumeText,
    matchScore: matchData.match_score,
    isMatch: matchData.is_match,
    extractedSkills: matchData.extracted_skills,
    extractedExperience: matchData.extracted_experience,
  })

  job.applications.push(newApplication._id)
  await job.save()

  // Trigger notification to job poster
  await Notification.create({
    recipient: job.createdBy,
    message: `${req.user.name} applied for your job: ${job.title} (Match Score: ${matchData.match_score}%)`,
    link: `/employer/applications/${newApplication._id}`
  });

  // Send email notification to job creator
  const recipientUser = await User.findById(job.createdBy);
  if (recipientUser && recipientUser.email) {
    await sendEmail({
      to: recipientUser.email,
      subject: "New Job Application",
      text: `${req.user.name} applied for your job: ${job.title} with a match score of ${matchData.match_score}%`
    });
  }

  res.status(201).json({
    status: "success",
    message: "Applied to the job!",
    data: {
      newApplication,
      matchScore: matchData.match_score,
      isMatch: matchData.is_match,
    },
  })
})

exports.getAppliedJobs = catchAsync(async (req, res, next) => {
  const userId = req.user.id

  const applications = await Application.find({ applicant: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "job",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "company",
        options: { sort: { createdAt: -1 } },
      },
    })

  if (!applications.length)
    return next(new AppError("No applications found!", 404))

  res.status(200).json({
    status: "success",
    data: {
      applications,
    },
  })
})

exports.getApplicants = catchAsync(async (req, res, next) => {
  const jobId = req.params.jobId
  const { filter = 'all' } = req.query // 'all', 'matched', 'shortlisted'

  if (!jobId) return next(new AppError("jobId not found in the params", 400))

  let query = { job: jobId }

  // Filter based on match score or status
  if (filter === 'matched') {
    query.isMatch = true
  } else if (filter === 'shortlisted') {
    query.status = 'shortlisted'
  }

  const applications = await Application.find(query)
    .populate({
      path: "applicant",
    })
    .sort({ matchScore: -1, createdAt: -1 })

  if (!applications.length)
    return next(
      new AppError("No applications associated with this job found!", 404)
    )

  res.status(200).json({
    status: "success",
    data: {
      applications,
    },
  })
})

exports.getMatchedApplicants = catchAsync(async (req, res, next) => {
  const jobId = req.params.jobId

  if (!jobId) return next(new AppError("jobId not found in the params", 400))

  // Get only applicants with match score >= 60
  const applications = await Application.find({ 
    job: jobId,
    isMatch: true 
  })
    .populate({
      path: "applicant",
    })
    .sort({ matchScore: -1, createdAt: -1 })

  if (!applications.length)
    return next(
      new AppError("No matching applicants found for this job!", 404)
    )

  res.status(200).json({
    status: "success",
    data: {
      applications,
    },
  })
})

exports.updateStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body
  const applicationId = req.params.applicationId

  if (!status) return next(new AppError("Application status is required", 400))
  if (!applicationId)
    return next(new AppError("applicationId not found in params", 400))

  // Validate status
  const validStatuses = ['applied', 'shortlisted', 'rejected']
  if (!validStatuses.includes(status)) {
    return next(new AppError("Invalid status. Must be: applied, shortlisted, or rejected", 400))
  }

  // find the application associated with the applicationId
  const application = await Application.findById(applicationId)
  if (!application)
    return next(
      new AppError(`No application found with id - ${applicationId}`, 404)
    )

  application.status = status
  await application.save({
    validateModifiedOnly: true,
  })

  // Find the job for notification message
  const job = await Job.findById(application.job);

  // Trigger notification to applicant
  await Notification.create({
    recipient: application.applicant,
    message: `Your application for "${job.title}" was ${status}.`,
    link: `/applications/${application._id}`
  });

  // Send email notification to applicant
  const applicantUser = await User.findById(application.applicant);
  if (applicantUser && applicantUser.email) {
    await sendEmail({
      to: applicantUser.email,
      subject: `Application Status Update for ${job.title}`,
      text: `Your application for "${job.title}" was ${status}.`
    });
  }

  res.status(200).json({
    status: "success",
    message: "Application status updated successfully!",
    data: {
      application,
    },
  })
})

exports.getApplicationStats = catchAsync(async (req, res, next) => {
  const jobId = req.params.jobId

  if (!jobId) return next(new AppError("jobId not found in the params", 400))

  const stats = await Application.aggregate([
    { $match: { job: new mongoose.Types.ObjectId(jobId) } },
    {
      $group: {
        _id: null,
        totalApplications: { $sum: 1 },
        matchedApplications: { $sum: { $cond: ['$isMatch', 1, 0] } },
        shortlistedApplications: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } },
        rejectedApplications: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
        averageMatchScore: { $avg: '$matchScore' }
      }
    }
  ])

  res.status(200).json({
    status: "success",
    data: {
      stats: stats[0] || {
        totalApplications: 0,
        matchedApplications: 0,
        shortlistedApplications: 0,
        rejectedApplications: 0,
        averageMatchScore: 0
      }
    },
  })
})

exports.downloadResume = catchAsync(async (req, res, next) => {
  const applicationId = req.params.applicationId

  if (!applicationId) {
    return next(new AppError("Application ID is required", 400))
  }

  // Find the application and populate applicant details
  const application = await Application.findById(applicationId)
    .populate('applicant', 'name email')
    .populate('job', 'title')

  if (!application) {
    return next(new AppError("Application not found", 404))
  }

  if (!application.resumeUrl) {
    return next(new AppError("No resume uploaded for this application", 404))
  }

  // Create a more descriptive filename
  const applicantName = application.applicant?.fullName?.replace(/\s+/g, '_') || 'Unknown_Applicant'
  const jobTitle = application.job?.title?.replace(/\s+/g, '_') || 'Unknown_Job'
  const downloadFilename = `${applicantName}_${jobTitle}_resume.pdf`

  // Set headers for file download
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename="${downloadFilename}"`)
  
  // Check if it's a local file or Cloudinary URL
  if (application.resumeUrl.startsWith('uploads/')) {
    // Local file - serve it directly
    const filePath = require('path').join(__dirname, '..', application.resumeUrl)
    res.sendFile(filePath, (err) => {
      if (err) {
        return next(new AppError("Error serving file", 500))
      }
    })
  } else {
    // Cloudinary URL - serve it directly without redirect
    res.setHeader('Location', application.resumeUrl)
    res.status(200).send()
  }
})

// Get resume metadata (for frontend display)
exports.getResumeMetadata = catchAsync(async (req, res, next) => {
  const applicationId = req.params.applicationId

  if (!applicationId) {
    return next(new AppError("Application ID is required", 400))
  }

  const application = await Application.findById(applicationId)
    .populate('applicant', 'name email')
    .populate('job', 'title')

  if (!application) {
    return next(new AppError("Application not found", 404))
  }

  if (!application.resumeUrl) {
    return next(new AppError("No resume uploaded for this application", 404))
  }

  // Extract filename from URL
  const urlParts = application.resumeUrl.split('/')
  const filename = urlParts[urlParts.length - 1]
  
  // Create descriptive filename
  const applicantName = application.applicant?.fullName?.replace(/\s+/g, '_') || 'Unknown_Applicant'
  const jobTitle = application.job?.title?.replace(/\s+/g, '_') || 'Unknown_Job'
  const downloadFilename = `${applicantName}_${jobTitle}_resume.pdf`

  res.status(200).json({
    status: "success",
    data: {
      resumeUrl: application.resumeUrl,
      filename: downloadFilename,
      fileType: 'PDF',
      applicantName: application.applicant?.fullName || 'Unknown',
      jobTitle: application.job?.title || 'Unknown'
    }
  })
})
