const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "An application must have a job name"],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A job application must have an applicant"],
    },
    // Resume upload fields
    resumeUrl: {
      type: String,
      required: [true, "Resume URL is required"],
    },
    resumeText: {
      type: String,
      required: [true, "Parsed resume text is required"],
    },
    // ML matching fields
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      required: [true, "Match score is required"],
    },
    isMatch: {
      type: Boolean,
      default: false,
    },
    extractedSkills: [String],
    extractedExperience: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["applied", "shortlisted", "rejected"],
        message: "Status is either: applied, shortlisted or rejected",
      },
      default: "applied",
    },
  },
  {
    timestamps: true,
  }
)

// Prevent duplicate applications for the same job by the same applicant
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })

const Application = mongoose.model("Application", applicationSchema)

module.exports = Application
