// backend/controllers/jobController.js

const Job = require("../models/jobModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.postJob = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    positions,
    experienceLevel,
    company,
  } = req.body;

  const userId = req.user.id;

  const newJob = await Job.create({
    title,
    description,
    requirements: requirements.split(","),
    salary: Number(salary),
    location,
    jobType,
    positions,
    experienceLevel,
    company,
    createdBy: userId,
  });

  res.status(201).json({
    status: "success",
    message: "New job created!",
    data: { newJob },
  });
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const keyword = req.query.keyword || "";

  const query = {
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  };

  const jobs = await Job.find(query)
    .populate({ path: "company" })
    .sort({ createdAt: -1 });

  if (!jobs.length) {
    return next(new AppError("No jobs found!", 404));
  }

  res.status(200).json({
    status: "success",
    data: { jobs },
  });
});

exports.getJobById = catchAsync(async (req, res, next) => {
  const jobId = req.params.jobId;

  const job = await Job.findById(jobId).populate({ path: "applications" });

  if (!job) {
    return next(new AppError(`No such job found with id - ${jobId}`, 404));
  }

  res.status(200).json({
    status: "success",
    data: { job },
  });
});

exports.getJobsByUser = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const jobs = await Job.find({ createdBy: userId }).populate({
    path: "company",
  });

  if (!jobs.length) {
    return next(new AppError("No jobs posted by this user!", 404));
  }

  res.status(200).json({
    status: "success",
    data: { jobs },
  });
});

// ─── DELETE JOB ────────────────────────────────────────────────────────────────

exports.deleteJob = catchAsync(async (req, res, next) => {
  const jobId = req.params.jobId;
  const userId = req.user.id;

  // Attempt to delete only if this user created the job
  const result = await Job.deleteOne({ _id: jobId, createdBy: userId });

  if (result.deletedCount === 0) {
    // No document deleted means either it didn't exist or user isn't the creator
    return next(
      new AppError(
        "Job not found or you are not authorized to delete this job",
        404
      )
    );
  }

  res.status(200).json({
    status: "success",
    message: "Job deleted successfully",
  });
});