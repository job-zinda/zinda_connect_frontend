import React from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaBell,
  FaShieldAlt,
  FaCog,
  FaBan,
  FaCreditCard,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import '../styles/settings-sidebar.css'

const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: "profile",
      icon: <FaUser />,
      label: "Profile Information",
      path: "/settings/profile-information",
    },
    // ❌ Get Verified kalanju
    {
      id: "password",
      icon: <FaLock />,
      label: "Password & Security",
      path: "/settings/password-security",
    },
    {
      id: "notifications",
      icon: <FaBell />,
      label: "Notifications",
      path: "/settings/notifications",
    },
    {
      id: "privacy",
      icon: <FaShieldAlt />,
      label: "Privacy Settings",
      path: "/settings/privacy-settings",
    },
    {
      id: "preferences",
      icon: <FaCog />,
      label: "Account Preferences",
      path: "/settings/account-preferences",
    },
    {
      id: "blocked",
      icon: <FaBan />,
      label: "Blocked Users",
      path: "/settings/blocked-users",
    },
    {
      id: "subscription",
      icon: <FaCreditCard />,
      label: "Subscription",
      path: "/settings/subscription",
    },
    {
      id: "support",
      icon: <FaQuestionCircle />,
      label: "Help & Support",
      path: "/settings/help-support",
    },
    // ❌ My Favourites kalanju
    // ❌ My Likes kalanju
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className="settings-sidebar">
      <div className="settings-sidebar-header">
        <h2>Settings</h2>
      </div>

      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className={activeTab === item.id ? "active" : ""}>
            <Link
              to={item.path}
              className="sidebar-link"
              onClick={() => setActiveTab(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
};

export default SettingsSidebar;