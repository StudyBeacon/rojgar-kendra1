import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/notifications";

export const fetchNotifications = async () => {
  const res = await axios.get(API_BASE, { withCredentials: true });
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  await axios.patch(`${API_BASE}/${id}/read`, {}, { withCredentials: true });
}; 