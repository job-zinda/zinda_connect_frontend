import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/modal.css";
import personIcon from "../assets/image copy.png";
import lockIcon from "../assets/image copy 2.png";
import eyeCloseIcon from "../assets/image copy 4.png";
import emailIcon from "../assets/image copy 6.png";
import phoneIcon from "../assets/image copy 5.png"; 
import referral from "../assets/image copy 9.png";

import API, { registerAPI, updateProfileTypeAPI } from "../apis/Api";
import CreateProfileForModal from "./CreateProfileForModal";

export default function CreateAccountModal({ onClose }) {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", 
    password: "",
    confirm_password: "",
    referral_id: ""
  });

  const handleChange = (e) => {
    setFormData({
     ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await registerAPI({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirm_password,
        referral_id: formData.referral_id?.trim() || null
      });

      console.log("REGISTER SUCCESS:", res);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user_id", res.data.user_id);

      if (res.data.access) {
        API.defaults.headers.Authorization = `Bearer ${res.data.access}`;
      }

      setShowProfileModal(true);

    } catch (err) {
      console.log("REGISTER ERROR:", err);
      setError(
        err.response?.data?.email?.[0] ||
        err.response?.data?.phone?.[0] || 
        err.response?.data?.password?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileNext = async (type) => {
    setShowProfileModal(false);
    if (onClose) onClose();

    try {
      if (typeof updateProfileTypeAPI === "function") {
        await updateProfileTypeAPI({ profile_type: type });
      }
    } catch (error) {
      console.error("Failed to update profile type in backend", error);
    }

    if (type === 'self') {
      navigate('/create-profile/self');
    } else {
      navigate('/create-profile/parent');
    }
  };

  return (
    <>
      {!showProfileModal && (
        <div className="modal-overlay">
          <div className="custom-modal create-modal">
            <div className="modal-header">
              <h2>Create Account</h2>
              <button
                type="button"
                onClick={onClose}
                className="modal-close-btn"
                disabled={loading}
              >
                ×
              </button>
            </div>

            {error && (
              <div style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
                {error}
              </div>
            )}

            <form className="modal-form" onSubmit={handleRegister}>
              {/* NAME */}
              <div className="modal-input">
                <span className="modal-icon">
                  <img src={personIcon} alt="" />
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="modal-input">
                <span className="modal-icon">
                  <img src={emailIcon} alt="" />
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

             
              <div className="modal-input">
                <span className="modal-icon">
                  <img src={phoneIcon} alt="" />
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({
                   ...formData,
                    phone: e.target.value.replace(/\D/g, '').slice(0, 15)
                  })}
                  disabled={loading}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="modal-input">
                <span className="modal-icon">
                  <img src={lockIcon} alt="" />
                </span>
                <input
                  type={showPass? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="modal-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  <img src={eyeCloseIcon} alt="" />
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="modal-input">
                <span className="modal-icon">
                  <img src={lockIcon} alt="" />
                </span>
                <input
                  type={showConfirm? "text" : "password"}
                  name="confirm_password"
                  placeholder="Confirm Password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="modal-eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <img src={eyeCloseIcon} alt="" />
                </button>
              </div>

              {/* REFERRAL */}
              <div className="modal-input">
                <span>
                  <img src={referral} alt="" />
                </span>
                <input
                  type="text"
                  name="referral_id"
                  placeholder="Referral ID (Optional)"
                  value={formData.referral_id}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                className="modal-primary-btn"
                disabled={loading}
              >
                {loading? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && (
        <CreateProfileForModal
          onClose={() => {
            setShowProfileModal(false);
            if (onClose) onClose();
          }}
          onNext={handleProfileNext}
        />
      )}
    </>
  );
}