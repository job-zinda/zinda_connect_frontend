import React, { useState } from "react";
import { updatePasswordAPI } from "../apis/Api";
import "../styles/password-security.css";

export default function PasswordSecurity() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.currentPassword ||!formData.newPassword ||!formData.confirmPassword) {
      setMessage({ type: "error", text: "Please fill all fields" });
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({ type: "error", text: "New password 8 characters minimum needed" });
      return;
    }

    if (formData.newPassword!== formData.confirmPassword) {
      setMessage({ type: "error", text: "New password not matching" });
      return;
    }

    setSaving(true);

    try {
      await updatePasswordAPI({
        current_password: formData.currentPassword, 
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });

      setMessage({ type: "success", text: "Password successfully updated!" });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Password update failed";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="password-security">
      <h2>Password & Security</h2>
      <p>Change your password here</p>

      {message.text && (
        <div className={`alert ${message.type}`}>{message.text}</div>
      )}

      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
          />
        </div>

        <button type="submit" className="save-btn" disabled={saving}>
          {saving? "Saving..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}