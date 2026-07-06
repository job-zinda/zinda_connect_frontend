import React from "react";
import { FaArrowLeft, FaLock, FaUserSecret, FaShieldAlt, FaFlag, FaUserShield, FaChevronRight, FaQuestionCircle } from "react-icons/fa";

const SafetyTips = ({ onBack }) => {
  const tips = [
    { icon: <FaLock />, title: "Protect Your Account", desc: "Use a strong password and keep it private." },
    { icon: <FaUserSecret />, title: "Spot Scams", desc: "Learn how to identify and avoid scams." },
    { icon: <FaShieldAlt />, title: "Stay Safe Online", desc: "Tips for safe interactions and privacy." },
    { icon: <FaFlag />, title: "Report Inappropriate Behavior", desc: "Help us keep our community safe." },
    { icon: <FaUserShield />, title: "Privacy Best Practices", desc: "Manage your privacy and data settings." },
  ];

  return (
    <div className="help-sub-page">
      <button className="help-back" onClick={onBack}>
        <FaArrowLeft /> Help & Support
      </button>

      <h1>Safety Tips</h1>
      <p>Tips for a safe and secure experience.</p>

      <div className="settings-card help-card">
        {tips.map((tip) => (
          <button className="help-item" key={tip.title}>
            <div className="help-left">
              <div className="help-item-icon">{tip.icon}</div>
              <div>
                <h4>{tip.title}</h4>
                <p>{tip.desc}</p>
              </div>
            </div>
            <FaChevronRight />
          </button>
        ))}
      </div>

      <div className="need-help-box">
        <div>
          <FaQuestionCircle />
          <span>
            <b>Need immediate help?</b>
            <p>Contact our support team.</p>
          </span>
        </div>
        <button>Contact Support</button>
      </div>
    </div>
  );
};

export default SafetyTips;