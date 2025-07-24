const express = require("express")
const authController = require("../controllers/authController")
const isAuthenticated = require("../middlewares/isAuthenticated")
const singleUpload = require("../middlewares/multer")

const router = express.Router()

router.post("/register", singleUpload, authController.register)
router.post("/login", authController.login)
router.get("/logout", authController.logout)
router.patch(
  "/profile/update",
  isAuthenticated,
  singleUpload,
  authController.updateProfile
)

module.exports = router
