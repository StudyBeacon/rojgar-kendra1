const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A job must have a title"],
    },
    description: {
      type: String,
      required: [true, "A job must have a description"],
    },
    requirements: [String],
    salary: {
      type: Number,
      required: [true, "Salary must be assigned to a job"],
    },
    location: {
      type: String,
      required: [true, "Job location must be specified"],
    },
    jobType: {
      type: String,
      required: [true, "A job must have a type"],
    },
    positions: {
      type: Number,
      required: [true, "The number of positions for a job must be specified"],
    },
    experienceLevel: {
      type: Number,
      required: [true, "The years of experience for the job must be specified"],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "There must be a creator of the job"],
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Job = mongoose.model("Job", jobSchema)

module.exports = Job
