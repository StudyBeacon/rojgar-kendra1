const DatauriParser = require("datauri/parser")
const path = require("path")

const getDataUri = file => {
  const parser = new DatauriParser()
  const fileExtension = path.extname(file.originalname).toString()

  return parser.format(fileExtension, file.buffer)
}

module.exports = getDataUri
