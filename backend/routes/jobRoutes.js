const express = require("express");
const jobController = require("../controllers/jobController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.get("/", jobController.getAllJobs);
router.post("/post", isAuthenticated, jobController.postJob);
router.get("/my-jobs", isAuthenticated, jobController.getJobsByUser);
router.get("/:jobId", jobController.getJobById);

// ← NEW: delete a job by its ID (only recruiter who created it can delete)
router.delete("/:jobId", isAuthenticated, jobController.deleteJob);

module.exports = router;