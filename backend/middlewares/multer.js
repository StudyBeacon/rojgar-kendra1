const multer = require("multer")
const path = require("path")

// Configure storage for resume uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// File filter for PDF files only
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype === 'application/pdf') {
    cb(null, true)
  } else {
    cb(new Error('Only PDF files are allowed for resumes'), false)
  }
}

// Configure multer for resume uploads
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

// Keep the original singleUpload for other file uploads
const singleUpload = multer({ storage: multer.memoryStorage() }).single("file")

module.exports = {
  upload,
  singleUpload
}
