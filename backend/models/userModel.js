const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "A user must have a full name"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "A user must have an email address"],
      validate: [validator.isEmail, "Only valid emails are accepted"],
    },
    password: {
      type: String,
      required: [true, "Password can not be empty"],
      minlength: [8, "Password must be atleast 8 characters or more"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (val) {
          return val === this.password
          // 'this' only points on CREATE and SAVE !!!
        },
        message: "Enter the same password",
      },
    },
    phoneNumber: {
      type: Number,
      required: [true, "A user must have a phone number"],
      unique: true,
    },
    role: {
      type: String,
      enum: {
        values: ["jobSeeker", "recruiter"],
        message: "Role is either: jobSeeker or recruiter",
      },
      required: [true, "A user must have a role"],
    },
    profile: {
      bio: String,
      skills: [String],
      resume: String, // URL to resume file
      resumeOriginalName: String,
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined

  next()
})

userSchema.methods.correctPassword = async function (
  plainPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

const User = mongoose.model("User", userSchema)

module.exports = User
