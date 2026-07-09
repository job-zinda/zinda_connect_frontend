import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegCommentDots,
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md"; // ✅ Add
import { toast } from "react-toastify";

import Navbar from "./Navbar";
import "../styles/matches.css";
import { getMyMatchesAPI, createChatAPI, getAdminStatsAPI } from "../apis/Api";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();
  const [chatLoading, setChatLoading] = useState(false);

  console.log("Profile Data:", profile);
  console.log("is_verified:", profile.is_verified, "is_premium:", profile.is_premium);

  const imageSrc = profile.profile_picture
    ? profile.profile_picture.startsWith("http")
      ? profile.profile_picture
      : `${BACKEND_URL}${profile.profile_picture}`
    : "https://via.placeholder.com/300x350";

  const handleStartChat = async (e) => {
    e.stopPropagation();
    setChatLoading(true);
    try {
      const userId = profile.user_id;
      if (!userId) {
        toast.error("User ID not found in profile data");
        return;
      }
      const res = await createChatAPI(Number(userId));
      const roomId = res?.data?.room_id || res?.data?.id;
      if (!roomId) {
        toast.error("Chat room ID not found");
        return;
      }
      toast.success("Chat opened!");
      navigate(`/chat?room_id=${roomId}`);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || "Failed to start chat";
      toast.error(errorMsg);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="match-card">
      <div className="match-img-box">
        <img
          src={imageSrc}
          alt={profile.full_name}
          onError={(e) => e.target.src = "https://via.placeholder.com/300x350"}
        />
        <span className="online-badge">❤ Match</span>
      </div>

      <div className="match-info">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
          {profile.full_name}, {profile.age || "N/A"}
         
          {profile.is_verified && (
            <MdVerified 
              style={{ color: '#1d9bf0', fontSize: '18px' }}
              title="Verified"
            />
          )}
        </h3>

        
        {profile.is_premium && (
          <span style={{
            background: '#FFD700',
            color: '#000',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: 'bold',
            display: 'inline-block',
            marginTop: '4px',
            marginBottom: '4px'
          }}>
            PREMIUM
          </span>
        )}

        <p>{profile.religion || "Not Specified"}</p>

        <div className="match-meta">
          <span><FaBriefcase /> {profile.occupation || "Not Specified"}</span>
          <span><FaGraduationCap /> {profile.education || "Not Specified"}</span>
          <span><FaMapMarkerAlt /> {profile.district || profile.city || "Not Specified"}</span>
        </div>

        <div className="match-actions">
          <button
            className="connect-profile-btn"
            onClick={() => navigate(`/profile-details/${profile.id}`)}
          >
            <FaHeart /> View Profile
          </button>
          <button
            className="chat-profile-btn"
            onClick={handleStartChat}
            disabled={chatLoading}
          >
            <FaRegCommentDots /> {chatLoading? "..." : "Chat"}
          </button>
        </div>
      </div>
    </div>
  );
};



const AdminMatchCard = ({ match }) => {
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/100x100";
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}${path}`;
  };

  return (
    <div className="match-card admin-match-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <img
            src={getImageUrl(match.user_one_img)}
            alt={match.user_one_name}
            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => e.target.src = "https://via.placeholder.com/100x100"}
          />
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {match.user_one_name}
              {match.user_one_verified && <MdVerified style={{ color: '#1d9bf0', fontSize: '14px' }} />}
            </h4>
          </div>
        </div>

        <FaHeart style={{ color: '#e91e63', fontSize: '24px', margin: '0 15px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <h4 style={{ margin: 0, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
              {match.user_two_name}
              {match.user_two_verified && <MdVerified style={{ color: '#1d9bf0', fontSize: '14px' }} />}
            </h4>
          </div>
          <img
            src={getImageUrl(match.user_two_img)}
            alt={match.user_two_name}
            style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => e.target.src = "https://via.placeholder.com/100x100"}
          />
        </div>
      </div>

      <div className="match-actions" style={{ justifyContent: 'space-between', gap: '10px' }}>
        <button
          className="connect-profile-btn"
          onClick={() => navigate(`/profile-details/${match.user_one_profile_id}`)}
          style={{ fontSize: '12px', padding: '8px 12px', flex: 1 }}
          disabled={!match.user_one_profile_id}
        >
          View {match.user_one_name}
        </button>
        <button
          className="connect-profile-btn"
          onClick={() => navigate(`/profile-details/${match.user_two_profile_id}`)}
          style={{ fontSize: '12px', padding: '8px 12px', flex: 1 }}
          disabled={!match.user_two_profile_id}
        >
          View {match.user_two_name}
        </button>
      </div>
    </div>
  );
};

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const profileType = localStorage.getItem("profile_type");

    if (role === "admin" || profileType === "admin") {
      setIsAdmin(true);
      fetchAdminMatches();
    } else {
      setIsAdmin(false);
      fetchUserMatches();
    }
  }, []);

  const fetchUserMatches = async () => {
    try {
      const res = await getMyMatchesAPI();
      console.log("User matches data:", res.data);
      setMatches(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminMatches = async () => {
    try {
      const res = await getAdminStatsAPI();
      console.log("Admin matches:", res.data.recent_matches);
      setMatches(res.data.recent_matches || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load recent matches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="matches-page">
        <section className="matches-hero">
          <h1>{isAdmin? "Recent Matches" : "My Matches"}</h1>
          <p>{isAdmin? "Latest mutual likes across platform" : "People who liked you back ❤️"}</p>
        </section>

        {loading? (
          <div className="loading-box">
            <h3>Loading Matches...</h3>
          </div>
        ) : matches.length === 0? (
          <div style={{ textAlign: "center", padding: "80px" }}>
            <FaHeart size={60} color="#ff5c8a" />
            <h2>{isAdmin? "No Recent Matches" : "No Matches Yet"}</h2>
            <p>{isAdmin? "No mutual likes found in the system yet." : "When someone likes you back, they will appear here."}</p>
          </div>
        ) : (
          <section className="profiles-section">
            <div className="section-head">
              <h2>{isAdmin? `Recent Matches (${matches.length})` : `My Matches (${matches.length})`}</h2>
            </div>

            <div className="profiles-grid">
              {isAdmin? (
                matches.map((match) => (
                  <AdminMatchCard key={match.id} match={match} />
                ))
              ) : (
                matches.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Matches;