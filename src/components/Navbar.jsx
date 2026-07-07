

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md"; // ✅ Add
import logo from "../assets/image.png";
import "../styles/navbar.css";
import { getProfileAPI, getChatRoomsAPI, getAdminProfileAPI, API_BASE_URL } from "../apis/Api";
import NotificationBell from './NotificationBell';

const BACKEND_URL = API_BASE_URL;

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadChats, setUnreadChats] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadProfile();
    loadUnreadChats();
    const interval = setInterval(() => loadUnreadChats(), 5000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadChats = async () => {
    try {
      const res = await getChatRoomsAPI();
      const totalUnread = res.data.reduce((sum, room) => sum + room.unread_count, 0);
      setUnreadChats(totalUnread);
    } catch (err) {
      console.error("Failed to load unread chats", err);
    }
  };

  const loadProfile = async () => {
    try {
      const role = localStorage.getItem("role");
      const profileType = localStorage.getItem("profile_type");
      
      if (role === "admin" || profileType === "admin") {
        setIsAdmin(true);
        const res = await getAdminProfileAPI();
        console.log("ADMIN PROFILE:", res.data);
        setCurrentUser(res.data);
      } else {
        setIsAdmin(false);
        const res = await getProfileAPI();
        console.log("USER PROFILE:", res.data); // ✅ Check is_verified, is_premium
        setCurrentUser(res.data.profile || res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("profile_type");
    navigate("/login");
  };

  const getProfileImage = () => {
    const imageUrl = currentUser?.profile_image_url || currentUser?.profile_picture || currentUser?.profile_image;
    if (imageUrl) {
      if (imageUrl.startsWith("http")) return imageUrl;
      return `${BACKEND_URL}${imageUrl}`;
    }
    return "/default-avatar.png";
  };

  const getUserName = () => {
    if (isAdmin) return currentUser?.full_name || "Admin";
    return currentUser?.full_name || currentUser?.child_name || "My Profile";
  };

  return (
    <header className="home-navbar">
      <div className="nav-top">
        <img src={logo} alt="Logo" className="home-logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }} />
        <div className="nav-right-desktop">
          {currentUser && <NotificationBell />}
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      <nav className={menuOpen ? "nav-links active" : "nav-links"}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/matches" onClick={() => setMenuOpen(false)}>Matches</Link>
        <Link to="/chat" onClick={() => setMenuOpen(false)} style={{ position: "relative" }}>
          Chats
          {unreadChats > 0 && (
            <span style={{ position: "absolute", top: "-6px", right: "-14px", background: "red", color: "white", borderRadius: "50%", minWidth: "18px", height: "18px", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {unreadChats > 99 ? "99+" : unreadChats}
            </span>
          )}
        </Link>
        
        {!isAdmin && <Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link>}

        {currentUser && <div className="mobile-notification"><NotificationBell /></div>}

        {(isAdmin || currentUser?.profile_type === "admin" || localStorage.getItem("role") === "admin") && (
          <Link to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        )}

        {currentUser ? (
          <div className="mobile-user">
            <img
              src={getProfileImage()}
              alt="Profile"
              style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
              onError={(e) => {
                if (e.target.src.endsWith("/default-avatar.png")) return;
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {getUserName()}
              {/* ✅ Instagram style verified badge */}
              {currentUser.is_verified && (
                <MdVerified style={{ color: '#1d9bf0', fontSize: '16px' }} title="Verified" />
              )}
              {/* ✅ Premium Badge */}
              {currentUser.is_premium && (
                <span style={{ background: '#FFD700', color: '#000', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 'bold' }}>
                  PRO
                </span>
              )}
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="mobile-auth">
            <Link to="/login">Login</Link>
            <Link to="/register" className="signup-btn">Sign Up</Link>
          </div>
        )}
      </nav>
    </header>
  );
}