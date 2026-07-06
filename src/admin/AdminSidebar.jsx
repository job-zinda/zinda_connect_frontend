import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaHeart,
  FaIdCard,
  FaImages,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaCheckCircle,
  FaFileAlt,
  FaCrown,
  FaCreditCard,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/adminSidebar.css";

export default function AdminSidebar({ activeTab, setActiveTab, handleLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const menuCategories = [
    {
      items: [{ name: "Dashboard", icon: <FaTachometerAlt /> }],
    },
    {
      category: "USERS",
      items: [
        { name: "Users", icon: <FaUsers /> },
        { name: "Profiles", icon: <FaIdCard /> },
        { name: "Verification", icon: <FaCheckCircle /> },
      ],
    },
    {
      category: "MATCHES & CHATS",
      items: [{ name: "Matches", icon: <FaHeart /> }],
    },
    {
      category: "CONTENT",
      items: [
        { name: "Success Stories", icon: <FaFileAlt /> },
        { name: "Banners", icon: <FaImages /> },
      ],
    },
    {
      category: "MANAGE",
      items: [
        { name: "Subscription Plans", icon: <FaCrown /> },
        { name: "Payments", icon: <FaCreditCard /> },
        { name: "Settings", icon: <FaCog /> },
      ],
    },
  ];

  const handleItemClick = (itemName) => {
    setActiveTab(itemName);
    setMenuOpen(false);
  };

  const goHome = () => {
    navigate("/");
    setMenuOpen(false);
  };

  const logout = () => {
    setMenuOpen(false);
    handleLogout();
  };

  return (
    <>
      <header className="admin-mobile-navbar">
        <h2>
          Zinda <span>Admin</span>
        </h2>

        <button
          type="button"
          className="admin-menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle admin menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      <div className={`admin-mobile-dropdown ${menuOpen ? "open" : ""}`}>
        <button type="button" onClick={goHome}>
          <FaHome /> Go to Home
        </button>

        {menuCategories.map((cat, catIdx) => (
          <div key={catIdx} className="mobile-category-group">
            {cat.category && (
              <p className="mobile-category-title">{cat.category}</p>
            )}

            {cat.items.map((item) => (
              <button
                type="button"
                key={item.name}
                className={activeTab === item.name ? "active" : ""}
                onClick={() => handleItemClick(item.name)}
              >
                {item.icon} {item.name}
              </button>
            ))}
          </div>
        ))}

        <button type="button" className="logout" onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {menuOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2>
            Zinda <span>Admin</span>
          </h2>
        </div>

        <button type="button" className="sidebar-item home-btn" onClick={goHome}>
          <span className="sidebar-icon">
            <FaHome />
          </span>
          <span className="sidebar-text">Go to Home</span>
        </button>

        <nav className="admin-sidebar-nav">
          {menuCategories.map((cat, catIdx) => (
            <div key={catIdx} className="sidebar-category-group">
              {cat.category && (
                <p className="sidebar-category-title">{cat.category}</p>
              )}

              {cat.items.map((item) => (
                <button
                  type="button"
                  key={item.name}
                  className={`sidebar-item ${
                    activeTab === item.name ? "active" : ""
                  }`}
                  onClick={() => handleItemClick(item.name)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-text">{item.name}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <button type="button" className="sidebar-item logout" onClick={logout}>
          <span className="sidebar-icon">
            <FaSignOutAlt />
          </span>
          <span className="sidebar-text">Logout</span>
        </button>
      </aside>
    </>
  );
}