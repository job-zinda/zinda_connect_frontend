import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const TermsConditions = ({ onBack }) => {
  return (
    <div className="help-sub-page">
      <button className="help-back" onClick={onBack}>
        <FaArrowLeft /> Help & Support
      </button>

      <h1>Terms & Conditions</h1>
      <p>Read our terms and conditions.</p>

      <div className="settings-card document-card">
        <p>Last updated: 01 May, 2024</p>

        <h4>1. Introduction</h4>
        <p>Welcome to our platform. By accessing or using our services, you agree to be bound by these Terms & Conditions.</p>

        <h4>2. Use of Services</h4>
        <p>You agree to use our services only for lawful purposes and in accordance with these Terms.</p>

        <h4>3. User Accounts</h4>
        <p>You are responsible for maintaining the confidentiality of your account and password.</p>

        <h4>4. Content</h4>
        <p>You retain ownership of content you post, but you grant us a license to use it.</p>

        <h4>5. Termination</h4>
        <p>We reserve the right to suspend or terminate your account at our discretion.</p>

        <h4>6. Changes to Terms</h4>
        <p>We may update these Terms from time to time. Continued use means you accept the changes.</p>
      </div>
    </div>
  );
};

export default TermsConditions;