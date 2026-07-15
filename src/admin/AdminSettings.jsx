import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // ✅ ശരിയായ രീതിയിലേക്ക് മാറ്റി
import { toast } from 'react-toastify';
import { FaUser, FaCamera, FaSave, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/adminSettings.css';

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export default function AdminSettings() {
  const [admin, setAdmin] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "Admin",
    date_of_birth: "",
    gender: "",
    location: "",
    language: "English",
    bio: "",
    profile_image: null,
  });

  // 🔐 പാസ്‌വേഡ് ചേഞ്ച് സ്റ്റേറ്റുകൾ
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("access");

  const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/auth/admin/profile/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = res.data;

      setAdmin({
        full_name: profileData.full_name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        role: profileData.role || "Admin",
        date_of_birth: profileData.date_of_birth || "",
        gender: profileData.gender || "",
        location: profileData.location || "",
        language: profileData.language || "English",
        bio: profileData.bio || "",
        profile_image: null,
      });

      setPreviewImage(getImageUrl(profileData.profile_image_url || profileData.profile_image));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdmin(prev => ({ ...prev, profile_image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      
      Object.keys(admin).forEach(key => {
        if (admin[key] !== null && admin[key] !== "") {
          formData.append(key, admin[key]);
        }
      });

      const res = await axios.put(`${API_BASE_URL}/api/auth/admin/profile/`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      toast.success(res.data.message || "Profile updated successfully");
      fetchAdminProfile();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      return toast.error("New passwords do not match!");
    }

    try {
      setPasswordSaving(true);
      // 🔄 400 എറർ പൂർണ്ണമായി ഒഴിവാക്കാൻ 'old_password', 'current_password' എന്നിവ ഒന്നിച്ച് അയക്കുന്നു
      const res = await axios.put(`${API_BASE_URL}/api/auth/change-password/`, {
        old_password: passwordData.current_password,
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(res.data.message || "Password changed successfully");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to change password";
      toast.error(errorMsg);
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) return <div className="admin-loading-container">Loading...</div>;

  return (
    <div className="admin-settings-layout">
      <div className="admin-settings-main">
        <div className="admin-settings-inner-box">
          
          {/* Top Bar */}
          <div className="admin-settings-top-bar">
            <div>
              <h1>Admin Settings</h1>
              <p>Manage your admin profile and account settings</p>
            </div>
            <button className="admin-global-save-btn" onClick={handleSave} disabled={saving}>
              <FaSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Avatar Card */}
          <div className="admin-settings-avatar-card">
            <h3><span><FaUser /></span>Profile Picture</h3>
            <div className="admin-avatar-uploader-circle">
              {previewImage ? (
                <img src={previewImage} alt="avatar" className="admin-avatar-img-view" />
              ) : (
                <div className="admin-avatar-placeholder-icon"><FaUser size={40} /></div>
              )}
              <label htmlFor="avatar-upload" className="admin-avatar-camera-label">
                <FaCamera />
              </label>
              <input id="avatar-upload" type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
            </div>
            <p>Upload a new avatar</p>
            <small>JPG, PNG or GIF. Max 2MB</small>
          </div>

          {/* Personal Information */}
          <div className="admin-settings-form-card">
            <h3><span><FaUser /></span>Personal Information</h3>
            <div className="admin-settings-grid-container">
              <div className="admin-settings-input-group">
                <label>Full Name</label>
                <input type="text" name="full_name" value={admin.full_name} onChange={handleChange} />
              </div>
              <div className="admin-settings-input-group">
                <label>Email Address</label>
                <input type="email" name="email" value={admin.email} disabled className="admin-field-disabled" />
              </div>
              <div className="admin-settings-input-group">
                <label>Phone Number</label>
                <input type="text" name="phone" value={admin.phone} onChange={handleChange} />
              </div>
              <div className="admin-settings-input-group">
                <label>Role</label>
                <input type="text" name="role" value={admin.role} disabled className="admin-field-disabled" />
              </div>
              <div className="admin-settings-input-group">
                <label>Date of Birth</label>
                <input type="date" name="date_of_birth" value={admin.date_of_birth} onChange={handleChange} />
              </div>
              <div className="admin-settings-input-group">
                <label>Gender</label>
                <select name="gender" value={admin.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="admin-settings-input-group admin-field-fullwidth">
                <label>Location</label>
                <input type="text" name="location" value={admin.location} onChange={handleChange} />
              </div>
              <div className="admin-settings-input-group admin-field-fullwidth">
                <label>Bio</label>
                <textarea name="bio" value={admin.bio} onChange={handleChange} rows="3"></textarea>
              </div>
            </div>
          </div>

          {/* 🔐 Change Password Card */}
          <div className="admin-settings-form-card">
            <h3><span><FaLock /></span>Change Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="admin-settings-password-row">
                
                {/* Current Password */}
                <div className="admin-settings-input-group">
                  <label>Current Password</label>
                  <div className="admin-password-wrapper-box">
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      name="current_password" 
                      value={passwordData.current_password} 
                      onChange={handlePasswordChange} 
                      required 
                    />
                    {showCurrentPassword ? 
                      <FaEyeSlash onClick={() => setShowCurrentPassword(false)} /> : 
                      <FaEye onClick={() => setShowCurrentPassword(true)} />
                    }
                  </div>
                </div>
                
                {/* New Password */}
                <div className="admin-settings-input-group">
                  <label>New Password</label>
                  <div className="admin-password-wrapper-box">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      name="new_password" 
                      value={passwordData.new_password} 
                      onChange={handlePasswordChange} 
                      required 
                    />
                    {showNewPassword ? 
                      <FaEyeSlash onClick={() => setShowNewPassword(false)} /> : 
                      <FaEye onClick={() => setShowNewPassword(true)} />
                    }
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="admin-settings-input-group">
                  <label>Confirm New Password</label>
                  <div className="admin-password-wrapper-box">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      name="confirm_password" 
                      value={passwordData.confirm_password} 
                      onChange={handlePasswordChange} 
                      required 
                    />
                    {showConfirmPassword ? 
                      <FaEyeSlash onClick={() => setShowConfirmPassword(false)} /> : 
                      <FaEye onClick={() => setShowConfirmPassword(true)} />
                    }
                  </div>
                </div>

              </div>

              {/* Submit Button Row */}
              <div style={{ maxWidth: '200px', marginTop: '20px' }}>
                <button type="submit" className="admin-password-commit-btn" disabled={passwordSaving}>
                  {passwordSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}