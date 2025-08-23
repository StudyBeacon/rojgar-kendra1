const express = require("express")

const applicationController = require("../controllers/applicationController")
const isAuthenticated = require("../middlewares/isAuthenticated")
const { upload } = require("../middlewares/multer")

const router = express.Router()

// authenticate all the routes after this middleware
router.use(isAuthenticated)

// Apply for a job with resume upload
router.post("/apply/:jobId", upload.single('resume'), applicationController.applyJob)

// Get user's applied jobs
router.get("/applied-jobs", applicationController.getAppliedJobs)

// Get all applicants for a job (with optional filtering)
router.get("/:jobId/applicants", applicationController.getApplicants)

// Get only matched applicants for a job
router.get("/:jobId/matched-applicants", applicationController.getMatchedApplicants)

// Get application statistics for a job
router.get("/:jobId/stats", applicationController.getApplicationStats)

// Download resume for an application
router.get("/:applicationId/download-resume", applicationController.downloadResume)

// Get resume metadata
router.get("/:applicationId/resume-metadata", applicationController.getResumeMetadata)

// Update application status
router.patch(
  "/:applicationId/update-status",
  applicationController.updateStatus
)

module.exports = router
