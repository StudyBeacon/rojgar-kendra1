const mongoose = require("mongoose")

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "A company must have a name"],
      unique: true,
    },
    description: String,
    website: String,
    location: String,
    logo: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "The id of user who listed the company must be present"],
    },
  },
  {
    timestamps: true,
  }
)

const Company = mongoose.model("Company", companySchema)

module.exports = Company
