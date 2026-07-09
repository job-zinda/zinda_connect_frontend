import React, { useState } from "react";
import axios from "axios"; 
import "../styles/modal.css";
import EnterOtpModal from "./EnterOtpModal";
import emailIcon from "../assets/image copy 6.png";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    setError("");
    
    // 1. Validation
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);
    try {
      // 2. API Call to Django Backend
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/forgot-password/send-otp/",
        { email: email }
      );
      
      // 3. Success 
      if (response.status === 200) {
        setShowOtpModal(true);
      }
    } catch (err) {
      // 4. Error handling
      if (err.response?.data?.error) {
        setError(err.response.data.error); 
      } else {
        setError("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (showOtpModal) {
    return (
      <EnterOtpModal
        onClose={onClose}
        onBack={() => setShowOtpModal(false)}
        email={email} 
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="custom-modal forgot-modal">
        <div className="modal-header">
          <h2>Forgot Password</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <div className="modal-input forgot-phone">
          <span>
            <img src={emailIcon} alt="" />
          </span>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {error && <p className="error-text" style={{color: 'red', textAlign: 'center'}}>{error}</p>}

        <div className="forgot-actions">
          <button type="button" className="back-btn" onClick={onClose}>
            Back
          </button>

          <button
            type="button"
            className="send-btn"
            onClick={handleSendOTP}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}