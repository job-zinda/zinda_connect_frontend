import React, { useState } from "react";
import { FaArrowLeft, FaSearch, FaChevronDown } from "react-icons/fa";

import '../styles/faq-page.css'

const FAQPage = ({ onBack, onNavigate }) => {
  const [open, setOpen] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Go to the registration page, fill in your details including name, email, phone number, and password. Verify your email OTP and your account will be created."
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page, enter your registered email, verify OTP, and set a new password."
    },
    {
      question: "How do I update my profile?",
      answer: "Go to Profile > Edit Profile. You can update your photos, personal details, education, career, and preferences from there."
    },
    {
      question: "How do I change my preferences?",
      answer: "Navigate to Settings > Preferences. You can set your partner preferences including age, location, education, and more."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use industry-standard encryption to protect your data. Your information is never shared with third parties without your consent."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "Go to Settings > Subscription. Click on 'Cancel Subscription' and follow the instructions. Your premium features will remain active until the current billing cycle ends."
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
        <div className="settings-content" style={{ flex: 1 }}>

    <div className="help-sub-page">
      <button className="help-back" onClick={onBack}>
        <FaArrowLeft /> Help & Support
      </button>

      <h1>FAQs</h1>
      <p>Find answers to common questions.</p>

      <div className="help-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="faq-list">
        {filteredFaqs.length === 0? (
          <div className="faq-empty">
            <p>No FAQs found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div className={`faq-item ${open === index? 'active' : ''}`} key={index}>
              <button onClick={() => setOpen(open === index? null : index)}>
                <span>{faq.question}</span>
                <FaChevronDown className={`faq-icon ${open === index? 'rotated' : ''}`} />
              </button>

              {open === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="faq-footer">
        <b>Can't find what you're looking for?</b>
        <button onClick={() => onNavigate('contact')}>Contact Support</button>
      </div>
    </div>
    </div>

  );
};

export default FAQPage;