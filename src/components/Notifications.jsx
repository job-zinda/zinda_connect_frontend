import React, { useState, useEffect } from "react";
import { FaEnvelope, FaHeart, FaEye, FaBullhorn } from "react-icons/fa";
import { getNotificationsAPI, updateNotificationsAPI } from "../apis/Api";

const Notifications = () => {
  const [settings, setSettings] = useState({
    messages: true,
    favourites: true,
    profile_views: true,
    likes: true,
    updates_news: false,
    email_notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await getNotificationsAPI();
      setSettings({
        messages: res.data.messages?? true,
        favourites: res.data.favourites?? true,
        profile_views: res.data.profile_views?? true,
        likes: res.data.likes?? true,
        updates_news: res.data.updates_news?? false,
        email_notifications: res.data.email_notifications?? true,
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings((prev) => ({...prev, [key]:!prev[key] }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await updateNotificationsAPI(settings);
      alert("നോട്ടിഫിക്കേഷൻ ക്രമീകരണങ്ങൾ മാറ്റിയെഴുതി!");
      await fetchSettings();
    } catch (err) {
      console.error("Save error:", err);
      alert("സേവ് ചെയ്യാൻ സാധിച്ചില്ല.");
    } finally {
      setSaving(false);
    }
  };

  const notificationItems = [
    { key: "messages", icon: <FaEnvelope />, title: "Messages", description: "Notify me when I receive a new message" },
    { key: "favourites", icon: <FaHeart />, title: "Favourites", description: "Notify me when someone makes my profile favourites" },
    { key: "profile_views", icon: <FaEye />, title: "Profile Views", description: "Notify me when someone views my profile" },
    { key: "likes", icon: <FaHeart />, title: "Likes", description: "Notify me when someone likes my profile" },
    { key: "updates_news", icon: <FaBullhorn />, title: "Updates & News", description: "Notify me about new features and updates" },
    { key: "email_notifications", icon: <FaEnvelope />, title: "Email Notifications", description: "Receive notifications via email" },
  ];

  if (loading) return <div className="page-loader">ലോഡ് ചെയ്യുന്നു...</div>;

  return (
    <div className="settings-content" style={{ flex: 1 }}>
      <div className="notifications-page">
        <div className="page-header">
          <h2>Notifications</h2>
        </div>

        <div className="settings-card notification-card">
          {notificationItems.map((item) => (
            <div className="notification-item" key={item.key}>
              <div className="notification-left">
                <div className="notification-icon">{item.icon}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={Boolean(settings[item.key])}
                  onChange={() => handleToggle(item.key)}
                />
                <span className="slider"></span>
              </label>
            </div>
          ))}

          <button
            className="save-btn-full"
            onClick={handleSaveChanges}
            disabled={saving}
          >
            {saving? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;