const jwt = require("jsonwebtoken")

const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const getDataUri = require("../utils/dataURI")
const cloudinary = require("../utils/cloudinary")

const User = require("../models/userModel")

const signAndSendToken = (user, statusCode, res) => {
  // signing the jwt token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "strict",
  }

  // passwords should not show up even if its hashed
  user.password = undefined

  res
    .status(statusCode)
    .cookie("jwt", token, cookieOptions) // sending jwt token via cookie
    .json({
      status: "success",
      message: `Welcome ${user.fullName}!`,
      token,
      data: {
        user,
      },
    })
}

exports.register = catchAsync(async (req, res, next) => {
  const { fullName, email, password, passwordConfirm, phoneNumber, role } =
    req.body

  // receiving profile pic file and uploading it to cloudinary
  if (req.file) {
    const file = req.file
    const fileUri = getDataUri(file)
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

    if (cloudResponse) {
      var profileURL = cloudResponse.secure_url // cloudinary url to the profile picture file
    }
  }

  const newUser = await User.create({
    fullName,
    email,
    password, // password is hashed in mongoose middleware
    passwordConfirm,
    phoneNumber,
    role,
    profile: {
      profilePhoto: profileURL,
    },
  })

  signAndSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password, role } = req.body

  if (!email || !password || !role) {
    return next(new AppError("Please provide email, password and role", 400))
  }

  const user = await User.findOne({ email }).select("+password")

  if (
    !user ||
    !(await user.correctPassword(password, user.password)) || // method on a user instance
    role !== user.role
  ) {
    return next(new AppError("Incorrect email, password or role", 401))
  }

  signAndSendToken(user, 200, res)
})

exports.logout = catchAsync(async (req, res, next) => {
  res
    .status(200)
    .cookie("jwt", "", {
      expires: new Date(Date.now() - 1000),
      httpOnly: true,
    })
    .json({
      status: "success",
      message: "Logged out successfully!",
    })
})

exports.updateProfile = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for password updates!", 400))
  }

  const { fullName, email, phoneNumber, bio, skills } = req.body

  const skillsArray = skills?.split(",")

  const user = await User.findById(req.user._id) // from the middleware
  if (!user) {
    return next(new AppError("The user no longer exists", 401))
  }

  if (fullName) user.fullName = fullName
  if (email) user.email = email
  if (phoneNumber) user.phoneNumber = phoneNumber
  if (bio) user.profile.bio = bio
  if (skills) user.profile.skills = skillsArray

  // receiving resume file and uploading it to cloudinary
  if (req.file) {
    const file = req.file
    const fileUri = getDataUri(file)
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url // cloudinary url to the resume file
      user.profile.resumeOriginalName = file.originalname // display name of the resume
    }
  }

  await user.save({
    validateModifiedOnly: true,
  })

  res.status(200).json({
    status: "success",
    message: "User updated successfully!",
    data: {
      user,
    },
  })
})
