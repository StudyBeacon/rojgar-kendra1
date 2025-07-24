const express = require("express");
const { sendToGemini } = require("../controllers/geminiController");

const router = express.Router();

router.post("/career-help", sendToGemini);

module.exports = router;