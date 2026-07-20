import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdVerified } from "react-icons/md"; 
import {
  getProfileAPI,
  getPublicProfilesAPI,
  getPreferencesAPI
} from "../apis/Api";

import Navbar from "./Navbar";
import Footer from "./Footer"; 
import "../styles/home.css";
import search from "../assets/image copy 8.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const STATES_DISTRICTS = {
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Vellore", "Erode", "Thanjavur"],
  "Karnataka": ["Bangalore Urban", "Bengaluru Urban", "Mysore", "Mysuru", "Mangalore", "Mangaluru", "Hubli", "Belgaum", "Belagavi", "Gulbarga", "Kalaburagi", "Davanagere", "Shimoga", "Shivamogga"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Thane"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kurnool"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut", "Noida"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Haryana": ["Gurgaon", "Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar"],
};

const MARITAL_STATUS_OPTIONS = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];

const normalizeString = (str) => {
  if (!str) return "";
  return str.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
};

export default function Home() {
  const navigate = useNavigate();
  const searchSectionRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [allProfilesList, setAllProfilesList] = useState([]);
  const [brides, setBrides] = useState([]);
  const [grooms, setGrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPreferences, setUserPreferences] = useState(null);
  const [showSearchForm, setShowSearchForm] = useState(false);

  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const [searchFilters, setSearchFilters] = useState({
    lookingFor: "Select",
    ageRange: "Select Age",
    religion: "Select Religion",
    maritalStatus: "",
    state: "",
    district: "",
  });

  const fetchAds = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/ads/`);
      const activeAds = (response.data || []).filter(ad => ad.is_active !== false);
      setAds(activeAds);
    } catch (err) {
      console.error("Ads ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു", err);
    }
  };

  useEffect(() => {
    fetchAds();
    const fetchHomeData = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await getPublicProfilesAPI();
        const profiles = res.data || [];
        setAllProfilesList(profiles);
        splitBridesAndGrooms(profiles);

        if (token) {
          try {
            const prefRes = await getPreferencesAPI();
            setUserPreferences(prefRes.data);
            setSearchFilters(prev => ({
              ...prev,
              lookingFor: prefRes.data.show_me === 'Men' ? 'Groom' : 
                        prefRes.data.show_me === 'Women' ? 'Bride' : 'Select',
              ageRange: prefRes.data.age_preference || 'Select Age'
            }));
          } catch (prefErr) {
            console.error("Preferences load failed", prefErr);
          }
          try {
            const userResponse = await getProfileAPI();
            setCurrentUser(userResponse.data.profile);
          } catch (userErr) {
            console.error("User profile load failed", userErr);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Profiles load ചെയ്യാൻ സാധിച്ചില്ല.");
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (ads.length > 1) {
      const currentAd = ads[currentAdIndex];
      if (currentAd?.file_type === 'video') return; 
      const timer = setTimeout(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 30000);
      return () => clearTimeout(timer);
    }
  }, [ads, currentAdIndex]);

  const handleVideoEnded = () => {
    if (ads.length > 1) {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }
  };

  const splitBridesAndGrooms = (profilesArray) => {
    setBrides(profilesArray.filter(p => 
      p.gender?.toLowerCase() === "f" || p.gender?.toLowerCase() === "female"
    ));
    setGrooms(profilesArray.filter(p => 
      p.gender?.toLowerCase() === "m" || p.gender?.toLowerCase() === "male"
    ));
  };

  const handleFilterChange = (e, fieldName) => {
    const value = e.target.value;
    if (fieldName === "state") {
      setSearchFilters(prev => ({...prev, state: value, district: ""}));
    } else {
      setSearchFilters(prev => ({...prev, [fieldName]: value}));
    }
  };

  const handleSearch = () => {
    let filtered = [...allProfilesList];
    if (searchFilters.lookingFor !== "Select") {
      const targetGender = searchFilters.lookingFor.toLowerCase() === "bride" ? ["f", "female"] : ["m", "male"];
      filtered = filtered.filter((p) => targetGender.includes(p.gender?.toLowerCase()));
    }
    if (searchFilters.religion !== "Select Religion") {
      filtered = filtered.filter((p) => normalizeString(p.religion) === normalizeString(searchFilters.religion));
    }
    if (searchFilters.maritalStatus) {
      filtered = filtered.filter((p) => normalizeString(p.marital_status) === normalizeString(searchFilters.maritalStatus));
    }
    if (searchFilters.state) {
      filtered = filtered.filter((p) => normalizeString(p.state) === normalizeString(searchFilters.state));
    }
    if (searchFilters.district) {
      filtered = filtered.filter((p) => normalizeString(p.district) === normalizeString(searchFilters.district));
    }
    if (searchFilters.ageRange !== "Select Age") {
      const [minAge, maxAge] = searchFilters.ageRange.split(" - ").map(Number);
      filtered = filtered.filter((p) => p.age >= minAge && p.age <= maxAge);
    }
    splitBridesAndGrooms(filtered);
    setShowSearchForm(false);
    setTimeout(() => {
      document.getElementById("featured-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleOpenSearch = () => {
    setShowSearchForm(true);
    setTimeout(() => {
      searchSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  if (loading) {
    return <div className="home-loading">Zinda Connect loading.....</div>;
  }

  return (
    <div className="home-container">
      <Navbar currentUser={currentUser} />

      {/* BANNER / ADS SECTION */}
      <div className="ads-wrapper">
        {ads.length > 0 ? (
          <div className="ad-container">
            {ads[currentAdIndex].file_type === 'video' ? (
              <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
               
                <video
                  src={ads[currentAdIndex].file_url}
                  autoPlay 
                  controls
                  playsInline 
                  onEnded={handleVideoEnded}
                  onClick={() => ads[currentAdIndex].link_url && window.open(ads[currentAdIndex].link_url, "_blank")}
                  style={{ width: "100%", maxHeight: "420px", objectFit: "cover", display: "block", cursor: ads[currentAdIndex].link_url ? "pointer" : "default" }}
                />
              </div>
            ) : (
              <a href={ads[currentAdIndex].link_url || "#"} target="_blank" rel="noopener noreferrer">
                <img
                  src={ads[currentAdIndex].file_url}
                  alt={ads[currentAdIndex].title || "Advertisement"}
                />
              </a>
            )}
          </div>
        ) : (
          <div className="ad-placeholder">
            <span>Zinda Connect Matrimony - നിങ്ങളുടെ പരസ്യങ്ങൾ ഇവിടെ നൽകാം</span>
          </div>
        )}

        {/*  BUTTON BANNER  */}
        <div className="cta-wrapper">
          <button className="cta-find-btn" onClick={handleOpenSearch}>
            Find Your Perfect Match
          </button>
        </div>
      </div>

      {/* SEARCH FORM - CONDITIONAL */}
      {showSearchForm && (
        <section ref={searchSectionRef} className="search-card show">
          <div className="search-card-header">
            <h3>Find Your Perfect Match</h3>
            <button className="close-btn" onClick={() => setShowSearchForm(false)}>×</button>
          </div>
          <div className="search-grid">
            <label>Looking For
              <select value={searchFilters.lookingFor} onChange={(e) => handleFilterChange(e, "lookingFor")}>
                <option>Select</option>
                <option>Bride</option>
                <option>Groom</option>
              </select>
            </label>
            <label>Age Range
              <select value={searchFilters.ageRange} onChange={(e) => handleFilterChange(e, "ageRange")}>
                <option>Select Age</option>
                <option>18 - 25</option>
                <option>26 - 30</option>
                <option>31 - 40</option>
                <option>41 - 50</option>
              </select>
            </label>
            <label>Religion
              <select value={searchFilters.religion} onChange={(e) => handleFilterChange(e, "religion")}>
                <option>Select Religion</option>
                <option>Muslim</option>
                <option>Hindu</option>
                <option>Christian</option>
              </select>
            </label>
            <label>Marital Status
              <select value={searchFilters.maritalStatus} onChange={(e) => handleFilterChange(e, "maritalStatus")}>
                <option value="">Select Marital Status</option>
                {MARITAL_STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label>State
              <select value={searchFilters.state} onChange={(e) => handleFilterChange(e, "state")}>
                <option value="">Select State</option>
                {Object.keys(STATES_DISTRICTS).sort().map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </label>
            <label>District
              <select value={searchFilters.district} onChange={(e) => handleFilterChange(e, "district")} disabled={!searchFilters.state}>
                <option value="">Select District</option>
                {searchFilters.state && STATES_DISTRICTS[searchFilters.state]?.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </label>
          </div>
          <button className="search-btn" onClick={handleSearch}>
            <img src={search} alt="" />
            Search Matches
          </button>
        </section>
      )}

      <main id="featured-section" className="featured-section">
        {error && <p className="home-error">{error}</p>}
        {(searchFilters.lookingFor === "Select" || searchFilters.lookingFor === "Bride") && (
          <ProfileSection title="Featured Brides" profiles={brides} navigate={navigate} viewAllText="View All Brides" sectionId="brides-section" />
        )}
        {(searchFilters.lookingFor === "Select" || searchFilters.lookingFor === "Groom") && (
          <ProfileSection title="Featured Grooms" profiles={grooms} navigate={navigate} viewAllText="View All Grooms" sectionId="grooms-section" />
        )}
      </main>
      <Footer />
    </div>
  );
}

function ProfileSection({ title, profiles, navigate, viewAllText, sectionId }) {
  const [showAll, setShowAll] = useState(false);
  const displayedProfiles = showAll ? profiles : profiles.slice(0, 4);
  const handleToggleView = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };
  return (
    <section id={sectionId} className="profile-list-section">
      <div className="section-header">
        <h2>{title}</h2>
        {profiles.length > 4 && (
          <button onClick={handleToggleView} className="view-toggle-btn">
            {showAll ? "Show Less" : viewAllText} {showAll ? "↑" : "→"}
          </button>
        )}
      </div>
      <div className="profile-card-grid">
        {displayedProfiles.length > 0 ? (
          displayedProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} navigate={navigate} />
          ))
        ) : (
          <p className="empty-text">Matching profiles ലഭ്യമല്ല.</p>
        )}
      </div>
    </section>
  );
}

function ProfileCard({ profile, navigate }) {
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x350";
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };
  const isIncomplete = !profile.is_completed;
  return (
    <div className="match-profile-card" style={{ opacity: isIncomplete ? 0.7 : 1 }}>
      <img src={getImageUrl(profile.profile_picture)} alt={profile.full_name || "Profile"} onError={(e) => { e.target.src = "https://via.placeholder.com/300x350"; }} />
      <div className="match-card-body">
        <h3>
          {profile.full_name || "Name N/A"}
          {profile.is_verified && <MdVerified className="verified-icon" title="Verified Profile" />}
          {profile.is_premium && <span className="premium-badge">PREMIUM</span>}
        </h3>
        <p>
          {profile.religion || "N/A"} | {profile.occupation || "Professional"}
          <br />
          {profile.district || "Kerala"}, {profile.state || "India"}
        </p>
        {isIncomplete && <span className="incomplete-badge">Profile Incomplete</span>}
        <button onClick={() => navigate(`/profile-details/${profile.id}`)}>Connect</button>
      </div>
    </div>
  );
}