import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaEye, FaRegCommentDots } from "react-icons/fa";
import { getAllProfilesAPI, createChatAPI, API_BASE_URL } from "../apis/Api";
import "../styles/adminMatches.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminMatches() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Matches");
  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(null);

  const tabs = ["All Matches", "New Matches", "Accepted", "Pending", "Rejected"];

  const backendBaseURL = API_BASE_URL;

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await getAllProfilesAPI();
      setProfiles(res.data || []);
    } catch (err) {
      console.error("Failed to fetch profiles", err);
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (profile) => {
    setChatLoading(profile.id);
    try {
      const userId = profile.user?.id || profile.user;
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const res = await createChatAPI(userId);
      toast.success("Chat started!");
      navigate(`/chat?room_id=${res.data.room_id}`);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "Failed to start chat";
      toast.error(errorMsg);
    } finally {
      setChatLoading(null);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

 
  const getProfileImage = (profile) => {
    const imgPath = profile.profile_image_url || profile.profile_image || profile.profile_picture;
    
    if (!imgPath) return "https://via.placeholder.com/150"; // ഡിഫോൾട്ട് പ്ലേസ്ഹോൾഡർ
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    
    return `${backendBaseURL}${imgPath}`;
  };

  const filteredProfiles = profiles.filter((profile) => {
    const searchMatch =
      profile.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      profile.user?.email?.toLowerCase().includes(search.toLowerCase());

   
    const status = profile.verification_status?.toLowerCase();
    const tabMatch =
      activeTab === "All Matches" ||
      (activeTab === "New Matches" && status === "pending") ||
      (activeTab === "Accepted" && (status === "verified" || status === "accepted")) ||
      (activeTab === "Pending" && status === "pending") ||
      (activeTab === "Rejected" && status === "rejected");

    return searchMatch && tabMatch;
  });

  if (loading) {
    return (
      <div className="admin-matches-loading-box">
        <div className="admin-matches-spinner"></div>
        <p>Loading profiles...</p>
      </div>
    );
  }

  return (
    <div className="admin-users-content">
      <div className="admin-matches-top">
        <h1>Matches Control Panel</h1>
      </div>

      <section className="admin-matches-content">
        <div className="matches-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="matches-toolbar">
          <div className="matches-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="matches-filter-btn">
            <FaFilter /> Filter
          </button>
        </div>

        <div className="matches-table-card">
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Age</th>
                <th>Location</th>
                <th>Occupation</th>
                <th>Religion</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProfiles.map((profile) => (
                <tr key={profile.id}>
                  <td data-label="Profile">
                    <div className="match-person">
                      <img
                        src={getProfileImage(profile)}
                        alt={profile.full_name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                      <div className="match-person-info">
                        <span className="match-person-name">{profile.full_name}</span>
                        <span className="match-person-email">{profile.user?.email || "No Email"}</span>
                      </div>
                    </div>
                  </td>

                  <td data-label="Age">
                    <span className="match-table-text-bold">{calculateAge(profile.date_of_birth)} yrs</span>
                  </td>

                  <td data-label="Location">
                    <span className="match-table-text-regular">
                      {profile.district || profile.location || "N/A"}, {profile.state || "Kerala"}
                    </span>
                  </td>

                  <td data-label="Occupation">
                    <span className="match-table-text-regular">{profile.occupation || "N/A"}</span>
                  </td>

                  <td data-label="Religion">
                    <span className="match-table-text-regular">{profile.religion || "N/A"}</span>
                  </td>

                  <td data-label="Status">
                    <span className={`match-status ${profile.verification_status?.toLowerCase()}`}>
                      {profile.verification_status || "Pending"}
                    </span>
                  </td>

                  <td data-label="Actions">
                    <div className="match-actions-admin">
                      <button
                        className="match-action-btn view"
                        title="View Profile"
                        onClick={() => navigate(`/profile-details/${profile.id}`)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="match-action-btn chat"
                        title="Chat"
                        onClick={() => handleChat(profile)}
                        disabled={chatLoading === profile.id}
                      >
                        <FaRegCommentDots />
                        {chatLoading === profile.id && <span className="btn-dots">...</span>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProfiles.length === 0 && (
            <div className="matches-empty-state">
              <p>No matches found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}