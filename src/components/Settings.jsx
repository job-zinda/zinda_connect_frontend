import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import SettingsSidebar from "./Settingssidebar";
import VerifyAadhaar from "./VerifyAadhaar";
import PasswordSecurity from "./PasswordSecurity";
import Notifications from "./Notifications";
import PrivacySettings from "./PrivacySettings";
import AccountPreferences from "./AccountPreferences";
import BlockedUsers from "./BlockedUsers";
import Subscription from "./Subscription";
import HelpSupport from "./HelpSupport";
import FavouriteProfiles from "./FavouriteProfiles";
import LikedProfiles from "./LikedProfiles";
import { getProfileAPI, updateProfileAPI } from "../apis/Api";

import "../styles/settings-layout.css";
import "../styles/settings-sidebar.css";
import "../styles/profile-information.css";
import "../styles/password-security.css";
import "../styles/notifications.css";
import "../styles/privacy-preferences.css";
import "../styles/blocked-users.css";
import "../styles/subscription.css";
import "../styles/help-support.css";
import "../styles/profile-lists.css";
import "../styles/verify-aadhaar.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/150";
  return path.startsWith("http")? path : `${API_BASE_URL}${path}`;
};

export default function Settings() {
  const location = useLocation();

  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes("get-verified")) return "get-verified";
    if (path.includes("profile-information")) return "profile";
    if (path.includes("password-security")) return "password";
    if (path.includes("notifications")) return "notifications";
    if (path.includes("privacy-settings")) return "privacy";
    if (path.includes("account-preferences")) return "preferences";
    if (path.includes("blocked-users")) return "blocked";
    if (path.includes("subscription")) return "subscription";
    if (path.includes("help-support")) return "support";
    if (path.includes("favourites")) return "favourites";
    if (path.includes("likes")) return "likes";
    return "profile";
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profileData, setProfileData] = useState({
    fullName: "", email: "", phone: "", dob: "", gender: "", location: "",
    profilePic: "", galleryImages: [], religion: "", caste: "", motherTongue: "",
    education: "", profession: "", company: "", annualIncome: "", country: "",
    state: "", city: "", maritalStatus: "", height: "", fatherName: "",
    motherName: "", familyType: "", siblings: "", aboutMe: ""
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  useEffect(() => { setActiveTab(getActiveTabFromPath()); }, [location.pathname]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getProfileAPI();
        const profile = response.data.profile || response.data;

        setProfileData({
          fullName: profile.full_name || "",
          email: profile.email || "",
          phone: profile.phone || profile.phone_number || "",
          dob: profile.date_of_birth || "",
          gender: profile.gender === "F"? "Female" : profile.gender === "M"? "Male" : profile.gender === "Other"? "Other" : "",
          location: profile.district || "",
          profilePic: profile.profile_picture || "",
          galleryImages: profile.gallery_images || [],
          religion: profile.religion || "",
          caste: profile.caste || "",
          motherTongue: profile.mother_tongue || "",
          education: profile.education || "",
          profession: profile.occupation || "",
          company: profile.company || "",
          annualIncome: profile.annual_income || "",
          country: profile.country || "",
          state: profile.state || "",
          city: profile.city || "",
          maritalStatus: profile.marital_status || "",
          height: profile.height || "",
          fatherName: profile.father_name || "",
          motherName: profile.mother_name || "",
          familyType: profile.family_type || "",
          siblings: profile.siblings || "",
          aboutMe: profile.about_me || ""
        });
      } catch (err) {
        console.error("Profile load ചെയ്യാൻ സാധിച്ചില്ല", err);
        setMessage({ type: "error", text: "വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നതിൽ പരാജയം. ദയവായി ലോഗിൻ ചെയ്യുക." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("ഫയൽ സൈസ് 2MB-യിൽ കൂടരുത്!"); return; }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 2 * 1024 * 1024) { alert(`${file.name} 2MB-യിൽ കൂടുതലാണ്, അത് ഒഴിവാക്കി.`); return false; }
      return true;
    });
    setSelectedGalleryFiles((prev) => [...prev,...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setGalleryPreviews((prev) => [...prev,...newPreviews]);
  };

  const removeSelectedGalleryImage = (index) => {
    setSelectedGalleryFiles((prev) => prev.filter((_, i) => i!== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i!== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    const appendIfNotEmpty = (key, value) => {
      if (value!== null && value!== undefined && value!== "") { formData.append(key, value); }
    };

    appendIfNotEmpty("full_name", profileData.fullName);
    appendIfNotEmpty("phone", profileData.phone);
    appendIfNotEmpty("dob", profileData.dob);
    appendIfNotEmpty("gender", profileData.gender);
    appendIfNotEmpty("location", profileData.location);
    appendIfNotEmpty("religion", profileData.religion);
    appendIfNotEmpty("caste", profileData.caste);
    appendIfNotEmpty("motherTongue", profileData.motherTongue);
    appendIfNotEmpty("education", profileData.education);
    appendIfNotEmpty("profession", profileData.profession);
    appendIfNotEmpty("company", profileData.company);
    appendIfNotEmpty("annualIncome", profileData.annualIncome);
    appendIfNotEmpty("country", profileData.country);
    appendIfNotEmpty("state", profileData.state);
    appendIfNotEmpty("city", profileData.city);
    appendIfNotEmpty("maritalStatus", profileData.maritalStatus);
    appendIfNotEmpty("height", profileData.height);
    appendIfNotEmpty("fatherName", profileData.fatherName);
    appendIfNotEmpty("motherName", profileData.motherName);
    appendIfNotEmpty("familyType", profileData.familyType);
    appendIfNotEmpty("siblings", profileData.siblings);
    appendIfNotEmpty("aboutMe", profileData.aboutMe);

    if (selectedFile) { formData.append("profile_picture", selectedFile); }
    selectedGalleryFiles.forEach((file) => { formData.append("gallery_images", file); });

    try {
      const response = await updateProfileAPI(formData);
      setMessage({ type: "success", text: "Successfully saved the updations!" });
      setSelectedGalleryFiles([]); setGalleryPreviews([]); setSelectedFile(null); setPreviewUrl("");

      const updatedProfile = response.data.profile || response.data;
      setProfileData({
        fullName: updatedProfile.full_name || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || updatedProfile.phone_number || "",
        dob: updatedProfile.date_of_birth || "",
        gender: updatedProfile.gender === "F"? "Female" : updatedProfile.gender === "M"? "Male" : updatedProfile.gender === "Other"? "Other" : "",
        location: updatedProfile.district || "",
        profilePic: updatedProfile.profile_picture || "",
        galleryImages: updatedProfile.gallery_images || [],
        religion: updatedProfile.religion || "",
        caste: updatedProfile.caste || "",
        motherTongue: updatedProfile.mother_tongue || "",
        education: updatedProfile.education || "",
        profession: updatedProfile.occupation || "",
        company: updatedProfile.company || "",
        annualIncome: updatedProfile.annual_income || "",
        country: updatedProfile.country || "",
        state: updatedProfile.state || "",
        city: updatedProfile.city || "",
        maritalStatus: updatedProfile.marital_status || "",
        height: updatedProfile.height || "",
        fatherName: updatedProfile.father_name || "",
        motherName: updatedProfile.mother_name || "",
        familyType: updatedProfile.family_type || "",
        siblings: updatedProfile.siblings || "",
        aboutMe: updatedProfile.about_me || ""
      });
    } catch (err) {
      console.error("Cannot Save ", err);
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to save! Save again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) { return <div className="home-loading">Settings loading.....</div>; }

  return (
    <div>
      <Navbar/>
      <div className="settings-page">
        <div className="settings-container" style={{ display: "flex", marginTop: "20px", padding: "0 5%", gap: "30px" }}>
          <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "profile"? (
            <form className="settings-content" onSubmit={handleSave} style={{ flex: 1 }}>
              <div className="settings-header">
                <div>
                  <h1>Profile Information</h1>
                  <p>Update your personal details and profile information.</p>
                </div>
                <button type="submit" className="save-btn" disabled={saving}>{saving? "Saving..." : "Save Changes"}</button>
              </div>

              {message.text && (
                <div style={{ padding: "12px", marginBottom: "20px", borderRadius: "4px", backgroundColor: message.type === "success"? "#d4edda" : "#f8d7da", color: message.type === "success"? "#155724" : "#721c24", fontWeight: "500" }}>
                  {message.text}
                </div>
              )}

              <div className="profile-card">
                <div className="profile-left">
                  <div className="profile-image-box" style={{ flexShrink: 0, overflow: "hidden", borderRadius: "50%" }}>
                    <img
                      src={previewUrl || getImageUrl(profileData.profilePic)}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => {e.target.src = 'https://via.placeholder.com/150'}}
                    />
                    <label htmlFor="file-input" className="upload-icon" style={{ cursor: "pointer" }}>📷</label>
                    <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
                  </div>

                  <label htmlFor="file-input" className="upload-btn" style={{ cursor: "pointer", display: "inline-block", textAlign: "center" }}>Upload New Photo</label>
                  <span>JPG, PNG or GIF. Max size 2MB.</span>

                  <hr style={{ width: "100%", margin: "20px 0", border: "0", borderTop: "1px solid #eee" }} />

                  <div className="gallery-upload-section" style={{ width: "100%", textAlign: "left" }}>
                    <h4 style={{ marginBottom: "10px", color: "#333" }}>More Photos (Gallery)</h4>
                    <label htmlFor="gallery-input" className="upload-btn" style={{ cursor: "pointer", display: "block", textAlign: "center", backgroundColor: "#f0f0f0", color: "#333", border: "1px dashed #ccc" }}>+ Add Gallery Photos</label>
                    <input id="gallery-input" type="file" accept="image/*" multiple onChange={handleGalleryChange} style={{ display: "none" }} />

                    {galleryPreviews.length > 0 && (
                      <div style={{ marginTop: "10px" }}>
                        <p style={{ fontSize: "12px", color: "#666" }}>New images (Not saved):</p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "5px" }}>
                          {galleryPreviews.map((url, index) => (
                            <div key={index} style={{ position: "relative", width: "60px", height: "60px" }}>
                              <img src={url} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }} />
                              <button type="button" onClick={() => removeSelectedGalleryImage(index)} style={{ position: "absolute", top: "-5px", right: "-5px", background: "red", color: "white", border: "none", borderRadius: "50%", width: "18px", height: "18px", fontSize: "10px", cursor: "pointer" }}>✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {profileData.galleryImages.length > 0 && (
                      <div style={{ marginTop: "15px" }}>
                        <p style={{ fontSize: "12px", color: "#666" }}>Saved images ({profileData.galleryImages.length}):</p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "5px" }}>
                          {profileData.galleryImages.map((imgObj, index) => (
                            <img
                              key={imgObj.id || index}
                              src={getImageUrl(imgObj.image)}
                              alt="Gallery"
                              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }}
                              onError={(e) => {e.target.src = '/placeholder.png'}}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-right">
                  <h3>Basic Details</h3>
                  <div className="form-group"><label>Full Name</label><input type="text" name="fullName" value={profileData.fullName} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Email Address</label><input type="email" name="email" value={profileData.email} disabled style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }} /></div>
                  <div className="form-group"><label>Phone Number</label><input type="text" name="phone" value={profileData.phone} onChange={handleChange} placeholder="Phone Number" /></div>
                  <div className="form-group"><label>Date of Birth</label><input type="date" name="dob" value={profileData.dob} onChange={handleChange} /></div>
                  <div className="form-group"><label>Gender</label><select name="gender" value={profileData.gender} onChange={handleChange}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
                  <div className="form-group"><label>Height</label><input type="text" name="height" value={profileData.height} onChange={handleChange} placeholder="5'6 or 168 cm" /></div>
                  <div className="form-group"><label>Marital Status</label><select name="maritalStatus" value={profileData.maritalStatus} onChange={handleChange}><option value="">Select</option><option value="never_married">Never Married</option><option value="divorced">Divorced</option><option value="widowed">Widowed</option><option value="awaiting_divorce">Awaiting Divorce</option></select></div>

                  <h3>Religion & Community</h3>
                  <div className="form-group"><label>Religion</label><input type="text" name="religion" value={profileData.religion} onChange={handleChange} placeholder="Religion" /></div>
                  <div className="form-group"><label>Caste</label><input type="text" name="caste" value={profileData.caste} onChange={handleChange} placeholder="Caste" /></div>
                  <div className="form-group"><label>Mother Tongue</label><input type="text" name="motherTongue" value={profileData.motherTongue} onChange={handleChange} placeholder="Mother Tongue" /></div>

                  <h3>Education & Career</h3>
                  <div className="form-group"><label>Education</label><input type="text" name="education" value={profileData.education} onChange={handleChange} placeholder="Highest Education" /></div>
                  <div className="form-group"><label>Profession/Occupation</label><input type="text" name="profession" value={profileData.profession} onChange={handleChange} placeholder="Your Profession" /></div>
                  <div className="form-group"><label>Company</label><input type="text" name="company" value={profileData.company} onChange={handleChange} placeholder="Company Name" /></div>
                  <div className="form-group"><label>Annual Income</label><input type="text" name="annualIncome" value={profileData.annualIncome} onChange={handleChange} placeholder="Annual Income" /></div>

                  <h3>Location</h3>
                  <div className="form-group"><label>Country</label><input type="text" name="country" value={profileData.country} onChange={handleChange} placeholder="Country" /></div>
                  <div className="form-group"><label>State</label><input type="text" name="state" value={profileData.state} onChange={handleChange} placeholder="State" /></div>
                  <div className="form-group"><label>District</label><input type="text" name="location" value={profileData.location} onChange={handleChange} placeholder="District" /></div>
                  <div className="form-group"><label>City</label><input type="text" name="city" value={profileData.city} onChange={handleChange} placeholder="City" /></div>

                  <h3>Family Details</h3>
                  <div className="form-group"><label>Father's Name</label><input type="text" name="fatherName" value={profileData.fatherName} onChange={handleChange} placeholder="Father's Name" /></div>
                  <div className="form-group"><label>Mother's Name</label><input type="text" name="motherName" value={profileData.motherName} onChange={handleChange} placeholder="Mother's Name" /></div>
                  <div className="form-group"><label>Family Type</label><select name="familyType" value={profileData.familyType} onChange={handleChange}><option value="">Select</option><option value="nuclear">Nuclear Family</option><option value="joint">Joint Family</option><option value="single_parent">Single Parent Family</option><option value="blended">Blended Family</option></select></div>
                  <div className="form-group"><label>Siblings</label><input type="text" name="siblings" value={profileData.siblings} onChange={handleChange} placeholder="Eg: 1 Brother, 1 Sister" /></div>

                  <h3>About</h3>
                  <div className="form-group"><label>About Me</label><textarea name="aboutMe" rows="4" value={profileData.aboutMe} onChange={handleChange} placeholder="Tell us about yourself..." /></div>
                </div>
              </div>
            </form>
          ) : activeTab === "get-verified"? <VerifyAadhaar />
            : activeTab === "password"? <PasswordSecurity />
            : activeTab === "notifications"? <Notifications />
            : activeTab === "privacy"? <PrivacySettings />
            : activeTab === "preferences"? <AccountPreferences />
            : activeTab === "blocked"? <BlockedUsers />
            : activeTab === "subscription"? <Subscription />
            : activeTab === "support"? <HelpSupport />
            : activeTab === "favourites"? <FavouriteProfiles />
            : activeTab === "likes"? <LikedProfiles />
            : (<div className="settings-content"><h3>ഈ ഭാഗം നിർമ്മാണത്തിലാണ്...</h3></div>)
          }
        </div>
      </div>
    </div>
  );
}