const connectDB = require("./utils/db")
require("dotenv").config({})

const app = require("./app")

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  connectDB()
  console.log(`Server running at port ${PORT}`)
})
