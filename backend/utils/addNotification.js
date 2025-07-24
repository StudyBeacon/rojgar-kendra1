const Notification = require("../models/notificationModel");

const addNotification = async ({ recipient, message, link }) => {
  try {
    await Notification.create({ recipient, message, link });
  } catch (error) {
    console.error("Notification error:", error.message);
  }
};

module.exports = addNotification; 