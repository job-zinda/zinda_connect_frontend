import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md"; 
import { getMyLikesAPI, API_BASE_URL } from "../apis/Api";
import "../styles/profileLists.css";

export default function LikedProfiles() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    if (!path) return "/default-avatar.png";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  useEffect(() => {
    fetchLikedProfiles();
  }, []);

  const fetchLikedProfiles = async () => {
    try {
      const res = await getMyLikesAPI();
      console.log("Liked profiles:", res.data);
      setProfiles(res.data.likes || res.data || []);
    } catch (err) {
      console.error("Liked profiles fetch error:", err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-loader">Loading...</div>;
  }

  return (
    <div className="profile-list-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>❤️ Liked Profiles</h2>
      </div>

      {profiles.length === 0? (
        <div className="empty-state">No liked profiles found</div>
      ) : (
        <div className="profile-grid">
          {profiles.map((item) => {
            const profile = item.liked_user || item;
            return (
              <div key={profile.id} className="profile-card-item">
                <div className="profile-img-wrapper">
                  <img
                    src={getImageUrl(profile.profile_picture)}
                    alt={profile.full_name}
                    onError={(e) => {
                      if (e.target.src.endsWith("/default-avatar.png")) return;
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </div>

                <div className="profile-details">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {profile.full_name}
                    
                    {profile.is_verified && (
                      <MdVerified 
                        style={{ color: '#1d9bf0', fontSize: '16px' }}
                        title="Verified Profile"
                      />
                    )}
                    
                    {profile.is_premium && (
                      <span style={{ 
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)', 
                        color: '#000', 
                        padding: '2px 6px', 
                        borderRadius: '8px', 
                        fontSize: '9px', 
                        fontWeight: 'bold' 
                      }}>
                        PREMIUM
                      </span>
                    )}
                  </h3>
                  <p className="profile-age">{profile.age} Years</p>
                  <p className="profile-job">{profile.occupation || "Not Specified"}</p>
                  <p className="profile-location">{profile.city}, {profile.district}</p>

                  <button 
                    className="view-profile-btn"
                    onClick={() => navigate(`/profile-details/${profile.id}`)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}