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
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected"],
        message: "Status is either: pending, accepted or rejected",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)

const Application = mongoose.model("Application", applicationSchema)

module.exports = Application
