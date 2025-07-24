import React, { useEffect, useState } from "react";
import { fetchNotifications, markNotificationAsRead } from "../lib/notificationApi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  if (loading) return <div>Loading notifications...</div>;

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length === 0 && <div>No notifications.</div>}
      <ul>
        {notifications.map((n) => (
          <li key={n._id} style={{ background: n.read ? "#eee" : "#ffeeba", margin: "8px 0", padding: "8px" }}>
            <span>{n.message}</span>
            {n.link && (
              <a href={n.link} style={{ marginLeft: 8 }}>View</a>
            )}
            {!n.read && (
              <button style={{ marginLeft: 16 }} onClick={() => handleMarkAsRead(n._id)}>
                Mark as read
              </button>
            )}
            <span style={{ float: "right", fontSize: "0.8em", color: "#888" }}>
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications; 