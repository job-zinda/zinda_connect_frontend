import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaSave,
  FaCamera,
  FaUpload,
  FaUser,
  FaLock,
  FaEye,
} from "react-icons/fa";
import {
  getAdminProfileAPI,
  updateAdminProfileAPI,
  updatePasswordAPI,
} from "../apis/Api";
import "../styles/adminSettings.css";

export default function AdminSettings() {
  const [admin, setAdmin] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "Admin",
    date_of_birth: "",
    gender: "", // ✅ default empty, user select ചെയ്യണം
    location: "",
    language: "English",
    bio: "",
    profile_image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchAdminProfile();
  }, []);

   const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const res = await getAdminProfileAPI();
      console.log("Profile Get API Response:", res.data);

      const profileData = res.data.profile || res.data.profiles || res.data;

      // Backend il ninn Male/Female വരും, അത് small ആക്കി select il കാണിക്കുന്നു
      const fetchedGender = profileData.gender? profileData.gender.toLowerCase() : "";

      setAdmin({
        full_name: profileData.full_name || "",
        email: profileData.email || res.data.email || "",
        phone: profileData.phone || "",
        role: profileData.role || "Admin",
        date_of_birth: profileData.date_of_birth || "",
        gender: fetchedGender,
        location: profileData.location || "",
        language: profileData.language || "English",
        bio: profileData.bio || "",
        profile_image: null,
      });

      setPreviewImage(profileData.profile_image_url || profileData.profile_image || null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin((prev) => ({
   ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error("File size is too big. Max allowed is 2MB");
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, GIF, WEBP images are allowed");
      return;
    }

    setAdmin((prev) => ({
   ...prev,
      profile_image: file,
    }));
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSaveChanges = async () => {
    if (!admin.gender) {
      toast.error("Please select gender");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();

      const cleanGender = admin.gender.replace(/['"]+/g, '').trim();

      formData.append("full_name", (admin.full_name || "").trim());
      formData.append("phone", (admin.phone || "").trim());
      formData.append("date_of_birth", admin.date_of_birth || "");
      formData.append("gender", cleanGender); 
      formData.append("location", (admin.location || "").trim());
      formData.append("language", admin.language || "English");
      formData.append("bio", (admin.bio || "").trim());

      if (admin.profile_image) {
        formData.append("profile_image", admin.profile_image);
      }

      console.log("Sending clean gender:", cleanGender);

      const res = await updateAdminProfileAPI(formData);
      console.log("Update Success Response:", res.data);
      toast.success("Profile saved successfully");
      fetchAdminProfile();
    } catch (err) {
      console.error("Update Failure Response:", err.response?.data);
      toast.error(
        err.response?.data?.gender?.[0] || 
        err.response?.data?.profile_image?.[0] || 
        "Failed to update profile settings"
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async () => {
    if (passwordData.new_password!== passwordData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await updatePasswordAPI(passwordData);
      toast.success("Password updated!");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      toast.error("Password update failed");
    }
  };

  if (loading) {
    return <div className="admin-loading-container">Loading...</div>;
  }

  return (
    <div className="admin-settings-layout">
      <div className="admin-settings-main">
        <div className="admin-settings-header-section">
          
        </div>

        <section className="admin-settings-inner-box">
          <div className="admin-settings-top-bar">
            <div>
              <h1>Profile Settings</h1>
              <p>Manage and configure your personal and profile parameters</p>
            </div>
            <button className="admin-global-save-btn" onClick={handleSaveChanges} disabled={saving}>
              <FaSave /> {saving? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="admin-settings-avatar-card">
            <h3><span><FaCamera /></span>Profile Picture</h3>
            <div className="admin-avatar-uploader-circle">
              {previewImage? (
                <img src={previewImage} alt="Admin Profile" className="admin-avatar-img-view" />
              ) : (
                <div className="admin-avatar-placeholder-icon"><FaUser size={50} /></div>
              )}
              <label htmlFor="admin-avatar-file-input" className="admin-avatar-camera-label">
                <FaCamera />
              </label>
              <input
                id="admin-avatar-file-input"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            <p>Select your profile picture to change layout graphics</p>
            <label htmlFor="admin-avatar-file-input" className="admin-avatar-trigger-btn">
              <FaUpload /> Upload Image
            </label>
            <small>Supports JPEG, PNG, GIF, WEBP up to 2MB</small>
          </div>

          <div className="admin-settings-form-card">
            <h3><span><FaUser /></span>Personal Details</h3>
            <div className="admin-settings-grid-container">
              <div className="admin-settings-input-group">
                <label>Full Name</label>
                <input name="full_name" value={admin.full_name} onChange={handleChange} />
              </div>

              <div className="admin-settings-input-group">
                <label>Email Address</label>
                <input name="email" value={admin.email} disabled className="admin-field-disabled" />
              </div>

              <div className="admin-settings-input-group">
                <label>Phone Number</label>
                <input name="phone" value={admin.phone} onChange={handleChange} />
              </div>

              <div className="admin-settings-input-group">
                <label>Role</label>
                <input name="role" value={admin.role} disabled className="admin-field-disabled" />
              </div>

              <div className="admin-settings-input-group">
                <label>Date of Birth</label>
                <input name="date_of_birth" type="date" value={admin.date_of_birth} onChange={handleChange} />
              </div>

              <div className="admin-settings-input-group">
                <label>Gender *</label>
                <select name="gender" value={admin.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="admin-settings-input-group">
                <label>Location</label>
                <input name="location" value={admin.location} onChange={handleChange} />
              </div>

              <div className="admin-settings-input-group">
                <label>Language</label>
                <select name="language" value={admin.language} onChange={handleChange}>
                  <option value="English">English</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>

              <div className="admin-settings-input-group admin-field-fullwidth">
                <label>Bio</label>
                <textarea name="bio" value={admin.bio} onChange={handleChange} rows="4" />
              </div>
            </div>
          </div>

          <div className="admin-settings-form-card">
            <h3><span><FaLock /></span>Security Settings</h3>
            <div className="admin-settings-password-row">
              <div className="admin-settings-input-group">
                <label>Current Password</label>
                <div className="admin-password-wrapper-box">
                  <input
                    type={showPassword.current? "text" : "password"}
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                  />
                  <FaEye onClick={() => setShowPassword({...showPassword, current:!showPassword.current })} />
                </div>
              </div>

              <div className="admin-settings-input-group">
                <label>New Password</label>
                <div className="admin-password-wrapper-box">
                  <input
                    type={showPassword.new? "text" : "password"}
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                  />
                  <FaEye onClick={() => setShowPassword({...showPassword, new:!showPassword.new })} />
                </div>
              </div>

              <div className="admin-settings-input-group">
                <label>Confirm Password</label>
                <div className="admin-password-wrapper-box">
                  <input
                    type={showPassword.confirm? "text" : "password"}
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                  />
                  <FaEye onClick={() => setShowPassword({...showPassword, confirm:!showPassword.confirm })} />
                </div>
              </div>
            </div>
            <button className="admin-password-commit-btn" onClick={handleUpdatePassword}>
              Change Password
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}