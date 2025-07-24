const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/notificationController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.use(isAuthenticated); // protect all routes

router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);

module.exports = router; 