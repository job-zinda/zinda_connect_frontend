import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getNotificationsAPI, markNotificationReadAPI } from "../apis/Api";
import "../styles/notificationBell.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsAPI();
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await markNotificationReadAPI(notification.id);
        fetchNotifications();
      }

      if (notification.notification_type === 'like' && notification.sender_profile_id) {
        navigate(`/profile-details/${notification.sender_profile_id}`);
      } else if (notification.notification_type === 'favourite' && notification.sender_profile_id) {
        navigate(`/profile-details/${notification.sender_profile_id}`);
      } else if (notification.notification_type === 'comment' && notification.profile_id) {
        navigate(`/profile-details/${notification.profile_id}`);
      } else if (notification.notification_type === 'message') {
        navigate("/chat-rooms");
      }
      
      setDropdownOpen(false);
    } catch (error) {
      console.error("Error handling notification:", error);
    }
  };

  const getAvatarUrl = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=ea1e63&color=fff&bold=true`;
  };

  const getProfileImage = (notification) => {
    const imgPath = notification.sender_image || notification.sender_profile_image || notification.sender_image_path;
    
    if (!imgPath) return getAvatarUrl(notification.sender_name);
   
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
      return imgPath;
    }
    
    return `${API_BASE_URL}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
  };

  const handleImageError = (e, name) => {
    e.target.src = getAvatarUrl(name);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <div 
        className="bell-icon-wrapper" 
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {dropdownOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && <span className="unread-count">{unreadCount} new</span>}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications yet</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <img
                    src={getProfileImage(notification)}
                    alt={notification.sender_name || "User"}
                    className="notification-avatar"
                    onError={(e) => handleImageError(e, notification.sender_name)}
                  />
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.created_at)}
                    </span>
                  </div>
                  {!notification.is_read && <div className="unread-dot"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;