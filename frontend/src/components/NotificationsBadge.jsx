import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../lib/notificationApi";

const NotificationsBadge = () => {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetchNotifications().then((data) => {
      if (mounted) {
        setUnread(data.filter((n) => !n.read).length);
      }
    });
    return () => { mounted = false; };
  }, []);

  if (unread === 0) return null;

  return (
    <span style={{
      position: "absolute",
      top: -4,
      right: -4,
      background: "red",
      color: "white",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: "0.75em",
      fontWeight: "bold"
    }}>{unread}</span>
  );
};

export default NotificationsBadge; 