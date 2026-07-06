


import React, { useState } from "react";
import {
  FaQuestion,
  FaRegCommentDots,
  FaExclamationTriangle,
  FaShieldAlt,
  FaFileAlt,
  FaUserShield,
  FaChevronRight,
} from "react-icons/fa";

import FAQPage from "./FAQPage";
import ContactSupport from "./ContactSupport";
import ReportProblem from "./ReportProblem";
import SafetyTips from "./SafetyTips";
import TermsConditions from "./TermsConditions";
import PrivacyPolicy from "./PrivacyPolicy";

const HelpSupport = () => {
  const [page, setPage] = useState("main");

  const supportItems = [
    { id: "faq", icon: <FaQuestion />, title: "FAQs", description: "Find answers to common questions" },
    { id: "contact", icon: <FaRegCommentDots />, title: "Contact Support", description: "Chat or email us for assistance" },
    { id: "report", icon: <FaExclamationTriangle />, title: "Report a Problem", description: "Report bugs or technical issues" },
    // { id: "safety", icon: <FaShieldAlt />, title: "Safety Tips", description: "Tips for a safe and secure experience" },
    { id: "terms", icon: <FaFileAlt />, title: "Terms & Conditions", description: "Read our terms and conditions" },
    { id: "privacy", icon: <FaUserShield />, title: "Privacy Policy", description: "Read our privacy policy" },
  ];

  if (page === "faq") return <FAQPage onBack={() => setPage("main")} />;
  if (page === "contact") return <ContactSupport onBack={() => setPage("main")} />;
  if (page === "report") return <ReportProblem onBack={() => setPage("main")} />;
  if (page === "safety") return <SafetyTips onBack={() => setPage("main")} />;
  if (page === "terms") return <TermsConditions onBack={() => setPage("main")} />;
  if (page === "privacy") return <PrivacyPolicy onBack={() => setPage("main")} />;

  return (
    <>
    <div className="settings-content" style={{ flex: 1 }}>

      <div className="settings-header">
        <div>
          <h1>Help & Support</h1>
          <p>We're here to help you.</p>
        </div>
      </div>

      <div className="settings-card help-card">
        {supportItems.map((item) => (
          <button key={item.id} className="help-item" onClick={() => setPage(item.id)}>
            <div className="help-left">
              <div className="help-item-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
            <FaChevronRight className="help-arrow" />
          </button>
        ))}
      </div>
      </div>

    </>
  );
};

export default HelpSupport;