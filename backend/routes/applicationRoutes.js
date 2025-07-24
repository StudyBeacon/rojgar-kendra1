const express = require("express")

const applicationController = require("../controllers/applicationController")
const isAuthenticated = require("../middlewares/isAuthenticated")

const router = express.Router()

// authenticate all the routes after this middleware
router.use(isAuthenticated)

router.get("/apply/:jobId", applicationController.applyJob)
router.get("/applied-jobs", applicationController.getAppliedJobs)
router.get("/:jobId/applicants", applicationController.getApplicants)
router.patch(
  "/:applicationId/update-status",
  applicationController.updateStatus
)

module.exports = router
