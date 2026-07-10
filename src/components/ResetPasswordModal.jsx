import React, { useState } from "react";
import { resetPasswordAPI } from "../apis/Api"; 
import "../styles/resetPassword.css";

export default function ResetPasswordModal({ onClose, onBack, email }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");

    if (!newPassword ||!confirmPassword) {
      setError("Please fill both fields");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (newPassword!== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordAPI({ // ✅ Api.js use cheyyunnu
        email: email.toLowerCase(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      alert("Password reset successful! Please login with new password.");
      onClose();
    } catch (err) {
      console.log("RESET ERROR:", err.response?.data);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.password) {
        setError(err.response.data.password[0]);
      } else {
        setError("Reset failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="reset-modal">
        <div className="reset-header">
          <h2>Reset Password</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</p>}

        <div className="reset-form">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="reset-actions">
          <button type="button" className="reset-back-btn" onClick={onBack}>
            Back
          </button>

          <button
            type="button"
            className="reset-confirm-btn"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading? "Resetting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}