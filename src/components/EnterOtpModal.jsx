import React, { useRef, useState } from "react";
import axios from "axios";
import "../styles/otpModal.css";
import ResetPasswordModal from "./ResetPasswordModal";

export default function EnterOtpModal({
  onClose,
  onBack,
  email 
}) {

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    ""
  ]);

  const [showReset, setShowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" &&!otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // OTP VERIFY API CALL
  const handleVerifyOTP = async () => {
    setError("");
    const otpCode = otp.join("");

    if (otpCode.length!== 6) {
      setError("Enter 6 digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/forgot-password/verify-otp/",
        {
          email: email.toLowerCase(), 
          otp: otpCode,
        }
      );

      if (res.status === 200) {
        setShowReset(true); 
      }
    } catch (err) {
      console.log("VERIFY OTP ERROR:", err.response?.data);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (showReset) {
    return (
      <ResetPasswordModal
        onClose={onClose}
        onBack={() => setShowReset(false)}
        email={email} 
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="otp-modal">
        <div className="otp-header">
          <h2>Enter OTP</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        {error && <p style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</p>}

        <div className="otp-input-row">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <div className="otp-actions">
          <button type="button" className="otp-back-btn" onClick={onBack}>
            Back
          </button>

          <button
            type="button"
            className="otp-confirm-btn"
            onClick={handleVerifyOTP} 
            disabled={loading}
          >
            {loading? "Verifying..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
