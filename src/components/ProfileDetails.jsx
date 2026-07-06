import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdVerified } from "react-icons/md"; // ✅ Instagram blue tick
import {
  getProfileDetailsAPI,
  likeProfileAPI,
  unlikeProfileAPI,
  favouriteProfileAPI,
  removeFavouriteAPI,
  getMyLikesAPI,
  getMyFavouritesAPI,
} from "../apis/Api";
import "../styles/profileDetails.css";

export default function ProfileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [liked, setLiked] = useState(false);
  const [favourite, setFavourite] = useState(false);

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/600x400";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://127.0.0.1:8000${imagePath}`;
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfileDetailsAPI(id);
      console.log("Profile Data:", res.data);
      setProfile(res.data);

      if (res.data.profile_picture) {
        setSelectedImage(getFullImageUrl(res.data.profile_picture));
      }

      try {
        const likeRes = await getMyLikesAPI();
        const alreadyLiked = likeRes.data.some((item) => item.id === Number(id));
        setLiked(alreadyLiked);
      } catch {
        setLiked(false);
      }

      try {
        const favRes = await getMyFavouritesAPI();
        const alreadyFavourite = favRes.data.some((item) => item.id === Number(id));
        setFavourite(alreadyFavourite);
      } catch {
        setFavourite(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikeProfileAPI(profile.id);
        setLiked(false);
      } else {
        await likeProfileAPI(profile.id);
        setLiked(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFavorite = async () => {
    try {
      if (favourite) {
        await removeFavouriteAPI(profile.id);
        setFavourite(false);
      } else {
        await favouriteProfileAPI(profile.id);
        setFavourite(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/matches");
    }
  };

  if (loading) {
    return <div className="loading">Loading Profile Details...</div>;
  }

  if (!profile) {
    return <div className="error-msg">Profile not found</div>;
  }

  const interests = Array.isArray(profile.interests)
    ? profile.interests
    : typeof profile.interests === "string"
    ? profile.interests.split(",")
    : [];

  return (
    <main className="details-page">
      <section className="profile-detail-card">
        <div className="detail-cover">
          <img
            src={selectedImage || getFullImageUrl(profile.profile_picture)}
            alt={profile.full_name}
          />
          <div className="detail-overlay">
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {profile.full_name}, {profile.age || "N/A"}
              {/* ✅ Instagram Blue Tick Badge */}
              {profile.is_verified && (
                <MdVerified
                  style={{ 
                    color: '#1d9bf0', 
                    fontSize: '28px',
                    verticalAlign: 'middle'
                  }}
                  title="Verified Profile"
                />
              )}
            </h1>
            
            {/* ✅ Premium Badge - Image പോലെ */}
            {profile.is_premium && (
              <div style={{
                background: '#FFD700',
                color: '#000',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'inline-block',
                marginTop: '8px',
                letterSpacing: '0.5px'
              }}>
                PREMIUM
              </div>
            )}

            <p>💼 {profile.occupation || "Not Specified"}</p>
            <p>📍{profile.city && profile.district ? `${profile.city}, ${profile.district}` : profile.city || profile.district || "Not Specified"}</p>
          </div>
        </div>

        <div className="thumbnail-gallery">
          {profile.profile_picture && (
            <img
              src={getFullImageUrl(profile.profile_picture)}
              alt="main"
              className={selectedImage === getFullImageUrl(profile.profile_picture) ? "thumb-img active" : "thumb-img"}
              onClick={() => setSelectedImage(getFullImageUrl(profile.profile_picture))}
            />
          )}
          {profile.gallery_images?.map((img, index) => (
            <img
              key={index}
              src={getFullImageUrl(img.image)}
              alt="gallery"
              className={selectedImage === getFullImageUrl(img.image) ? "thumb-img active" : "thumb-img"}
              onClick={() => setSelectedImage(getFullImageUrl(img.image))}
            />
          ))}
        </div>

        <div className="about-me-section">
          <h3>About Me</h3>
          <p>{profile.about_me || "No description available"}</p>
        </div>

        <div className="personal-info-section">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item"><span>EDUCATION</span><h4>{profile.education || "Not Specified"}</h4></div>
            <div className="info-item"><span>PROFESSION</span><h4>{profile.occupation || "Not Specified"}</h4></div>
            <div className="info-item"><span>COMPANY</span><h4>{profile.company || "Not Specified"}</h4></div>
            <div className="info-item"><span>ANNUAL INCOME</span><h4>{profile.annual_income || "Not Specified"}</h4></div>
            <div className="info-item"><span>RELIGION</span><h4>{profile.religion || "Not Specified"}</h4></div>
            <div className="info-item"><span>MARITAL STATUS</span><h4>{profile.marital_status || "Not Specified"}</h4></div>
            <div className="info-item"><span>HEIGHT</span><h4>{profile.height || "Not Specified"}</h4></div>
            <div className="info-item"><span>AGE</span><h4>{profile.age ? `${profile.age} Years` : "N/A"}</h4></div>
            <div className="info-item"><span>FATHER NAME</span><h4>{profile.father_name || "Not Specified"}</h4></div>
            <div className="info-item"><span>MOTHER NAME</span><h4>{profile.mother_name || "Not Specified"}</h4></div>
            <div className="info-item"><span>SIBLINGS</span><h4>{profile.siblings || "Not Specified"}</h4></div>
            <div className="info-item"><span>FAMILY TYPE</span><h4>{profile.family_type || "Not Specified"}</h4></div>
            <div className="info-item"><span>CITY</span><h4>{profile.city || "Not Specified"}</h4></div>
            <div className="info-item"><span>DISTRICT</span><h4>{profile.district || "Not Specified"}</h4></div>
          </div>
        </div>

        <div className="interests-section">
          <h3>Interests & Hobbies</h3>
          <div className="interest-tags">
            {interests.length > 0 ? (
              interests.map((interest, index) => (
                <span key={index} className="interest-pill">{interest}</span>
              ))
            ) : (
              <p>No interests added</p>
            )}
          </div>
        </div>
      </section>

      <div className="profile-actions-floating">
        <button className="action-btn close-btn" onClick={handleClose}>✕</button>
        <button className={`action-btn star-btn ${favourite ? "active" : ""}`} onClick={handleFavorite}>★</button>
        <button className={`action-btn heart-btn ${liked ? "active" : ""}`} onClick={handleLike}>♥</button>
      </div>
    </main>
  );
}