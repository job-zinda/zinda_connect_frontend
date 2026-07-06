import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const PrivacyPolicy = ({ onBack }) => {
  return (
    <div className="help-sub-page">
      <button className="help-back" onClick={onBack}>
        <FaArrowLeft /> Help & Support
      </button>

      <h1>Privacy Policy</h1>
      <p>Read our privacy policy.</p>

      <div className="settings-card document-card">
        <p>Last updated: 01 May, 2024</p>

        <h4>1. Introduction</h4>
        <p>We value your privacy and are committed to protecting your personal data.</p>

        <h4>2. Information We Collect</h4>
        <p>We collect information you provide directly, such as your name, email, and profile information.</p>

        <h4>3. How We Use Your Information</h4>
        <p>We use your information to provide, maintain, and improve our services.</p>

        <h4>4. Data Sharing</h4>
        <p>We do not sell your personal information. We may share it with trusted service providers.</p>

        <h4>5. Your Choices</h4>
        <p>You can update your preferences and manage your data in account settings.</p>

        <h4>6. Contact Us</h4>
        <p>If you have any questions about our Privacy Policy, contact our support team.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;