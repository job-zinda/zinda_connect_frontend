import React, { useState, useEffect } from "react";
import { getBlockedUsersAPI, unblockUserAPI } from "../apis/Api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const getImageUrl = (path) => {
  if (!path) return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  return path.startsWith("http")? path : `${API_BASE_URL}${path}`;
};

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const res = await getBlockedUsersAPI();
      setBlockedUsers(res.data);
    } catch (err) {
      console.error("Error fetching blocked users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (blockedUserId) => {
    try {
      await unblockUserAPI(blockedUserId);
      setBlockedUsers((prev) => prev.filter((user) => user.blocked_user_id!== blockedUserId));
      alert("യൂസറെ അൺബ്ലോക്ക് ചെയ്തു!");
    } catch (err) {
      console.error("Error unblocking user:", err);
      alert("അൺബ്ലോക്ക് ചെയ്യാൻ സാധിച്ചില്ല.");
    }
  };

  if (loading) return <p style={{ padding: "20px" }}>ലോഡ് ചെയ്യുന്നു...</p>;

  return (
    <div className="settings-content" style={{ flex: 1 }}>
      <div className="settings-header">
        <div>
          <h1>Blocked Users</h1>
          <p>Manage users you have blocked.</p>
        </div>
      </div>

      <div className="settings-card blocked-card">
        {blockedUsers.length > 0? (
          blockedUsers.map((user) => (
            <div className="blocked-user-row" key={user.id}>
              <div className="blocked-user-info">
                <img
                  src={getImageUrl(user.image)}
                  alt={user.name}
                  className="blocked-user-img"
                  onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                />
                <div>
                  <h4>{user.name}</h4>
                  <p>{user.date}</p>
                </div>
              </div>
              <button type="button" className="unblock-btn" onClick={() => handleUnblock(user.blocked_user_id)}>
                Unblock
              </button>
            </div>
          ))
        ) : (
          <div className="empty-blocked">
            <h3>No blocked users</h3>
            <p>You have not blocked anyone yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockedUsers;