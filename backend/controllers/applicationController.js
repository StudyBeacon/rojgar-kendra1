const Application = require("../models/applicationModel")
const Job = require("../models/jobModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const Notification = require("../models/notificationModel");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");

exports.applyJob = catchAsync(async (req, res, next) => {
  const userId = req.user.id

  const jobId = req.params.jobId
  if (!jobId) return next(new AppError("jobId not found in params", 400))

  // check if the job exists
  const job = await Job.findById(jobId)
  if (!job)
    return next(new AppError(`No such job found with id - ${jobId}`, 404))

  const existingApplication = await Application.findOne({
    job: jobId,
    applicant: userId,
  })

  if (existingApplication)
    return next(new AppError("You've already applied for this job", 400))

  // create a new application
  const newApplication = await Application.create({
    job: jobId,
    applicant: userId,
  })

  job.applications.push(newApplication._id)
  await job.save()

  // Trigger notification to job poster
  await Notification.create({
    recipient: job.createdBy,
    message: `${req.user.name} applied for your job: ${job.title}`,
    link: `/employer/applications/${newApplication._id}`
  });

  // Send email notification to job creator
  const recipientUser = await User.findById(job.createdBy);
  if (recipientUser && recipientUser.email) {
    await sendEmail({
      to: recipientUser.email,
      subject: "New Job Application",
      text: `${req.user.name} applied for your job: ${job.title}`
    });
  }

  res.status(201).json({
    status: "success",
    message: "Applied to the job!",
    data: {
      newApplication,
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

  if (!jobId) return next(new AppError("jobId not found in the params", 400))

  const applications = await Application.find({ job: jobId }).populate({
    path: "applicant",
  })
  if (!applications.length)
    return next(
      new AppError("No applications associated with this job found!", 404)
    )

  // const job = await Job.findById(jobId).populate({
  //   path: "applications",
  //   options: { sort: { createdAt: -1 } },
  //   populate: {
  //     path: "applicant",
  //   },
  // })

  // if (!job) return next(new AppError("No such job found!", 404))

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

  // find the application associated with the applicationId
  const application = await Application.findById(applicationId)
  if (!application)
    return next(
      new AppError(`No application found with id - ${applicationId}`, 404)
    )

  application.status = status.toLowerCase()
  await application.save({
    validateModifiedOnly: true,
  })

  // Find the job for notification message
  const job = await Job.findById(application.job);

  // Trigger notification to applicant
  await Notification.create({
    recipient: application.applicant,
    message: `Your application for "${job.title}" was ${status.toLowerCase()}.`,
    link: `/applications/${application._id}`
  });

  // Send email notification to applicant
  const applicantUser = await User.findById(application.applicant);
  if (applicantUser && applicantUser.email) {
    await sendEmail({
      to: applicantUser.email,
      subject: `Application Status Update for ${job.title}`,
      text: `Your application for "${job.title}" was ${status.toLowerCase()}.`
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
