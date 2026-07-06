
import React, { useState } from "react";
import "../styles/createmodal.css";
import parent from "../assets/image copy 7.png";
import personIcon from "../assets/image copy.png";
import { updateProfileTypeAPI } from "../apis/Api";

export default function CreateProfileForModal({ onClose, onNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelectProfile = async (type) => {
    setLoading(true);
    setError('');
    try {
      await updateProfileTypeAPI({ profile_type: type });
      onNext(type);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="custom-modal profile-modal">
        <div className="modal-header">
          <h2>Create Profile For</h2>
          <button
            type="button"
            className="profile-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

        <div
          className="profile-option"
          onClick={() =>!loading && handleSelectProfile('self')}
          style={{ cursor: loading? 'not-allowed' : 'pointer', opacity: loading? 0.5 : 1 }}
        >
          <div className="profile-icon">
            <img src={personIcon} alt="self" />
          </div>
          <div className="profile-content">
            <h3>Self</h3>
            <p>Create profile for myself</p>
          </div>
          <span>›</span>
        </div>

        <div
          className="profile-option"
          onClick={() =>!loading && handleSelectProfile('parent')}
          style={{ cursor: loading? 'not-allowed' : 'pointer', opacity: loading? 0.5 : 1 }}
        >
          <div className="profile-icon">
            <img src={parent} alt="parent" />
          </div>
          <div className="profile-content">
            <h3>Parent</h3>
            <p>Create profile for my son / daughter</p>
          </div>
          <span>›</span>
        </div>
      </div>
    </div>
  );
}