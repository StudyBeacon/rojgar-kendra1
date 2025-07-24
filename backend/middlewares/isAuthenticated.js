const jwt = require("jsonwebtoken")
const { promisify } = require("util")

const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const User = require("../models/userModel")

const isAuthenticated = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt
  if (!token)
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    )

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)

  const currentUser = await User.findById(decoded.id)
  if (!currentUser)
    return next(new AppError("The user with this token no longer exists!", 401))

  req.user = currentUser
  next()
})

module.exports = isAuthenticated
