import React, { useState } from "react";
import axios from "axios";
import "../styles/resetPassword.css";

export default function ResetPasswordModal({ onClose, onBack, email }) { // ✅ email prop add ചെയ്തു
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ API CALL ADD ചെയ്തു
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
      // ✅ BACKEND API CALL
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/forgot-password/reset/",
        {
          email: email.toLowerCase(), // ✅ email അയക്കണം
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      );

      if (res.status === 200) {
        alert("Password reset successful! Please login with new password.");
        onClose(); // എല്ലാ modal ഉം close ചെയ്യും
      }
    } catch (err) {
      console.log("RESET ERROR:", err.response?.data);
      if (err.response?.data?.error) {
        setError(err.response.data.error); // "OTP not verified" പോലെ
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