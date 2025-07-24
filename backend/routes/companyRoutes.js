const express = require("express")

const companyController = require("../controllers/companyController")
const isAuthenticated = require("../middlewares/isAuthenticated")
const singleUpload = require("../middlewares/multer")

const router = express.Router()

router.post("/register", isAuthenticated, companyController.registerCompany)
router.get("/my-companies", isAuthenticated, companyController.getCompany)
router
  .route("/:companyId")
  .get(isAuthenticated, companyController.getCompanyById)
  .patch(isAuthenticated, singleUpload, companyController.updateCompany)

module.exports = router
