import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/footer.css"; // ✅ CSS file import cheyy

export default function Footer() {
  const navigate = useNavigate();

  const handleHover = (e) => {
    e.target.style.color = '#e91662';
    e.target.style.paddingLeft = '5px';
  };

  const handleLeave = (e) => {
    e.target.style.color = '#b0b0b0';
    e.target.style.paddingLeft = '0';
  };

  const linkStyle = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#b0b0b0',
    margin: '8px 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'block',
    wordBreak: 'break-word' // ✅ email cut aavathirikkam
  };

  return (
    <footer className="footer"> {/* ✅ class use cheyy */}
      <div className="footer-content"> {/* ✅ class use cheyy */}
        
        <div className="footer-section">
          <h3>Zinda Connect</h3>
          <p style={{cursor: 'default'}}>
            India's most trusted matrimonial platform
            connecting hearts. Find your perfect life partner
            with verified profiles and premium features.
          </p>
        </div>

        <div className="footer-section">
          <h4>About</h4>
          <p onClick={() => navigate('/about-us')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            About Us
          </p>
          <p onClick={() => navigate('/how-it-works')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            How It Works
          </p>
          <p onClick={() => navigate('/success-stories')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            Success Stories
          </p>
          <p onClick={() => navigate('/blog')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            Blog
          </p>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <p onClick={() => navigate('/help-support')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            Help Center
          </p>
          <p onClick={() => navigate('/privacy-policy')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            Privacy Policy
          </p>
          <p onClick={() => navigate('/terms-conditions')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            Terms & Conditions
          </p>
          <p onClick={() => navigate('/faqs')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            FAQs
          </p>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <a href="mailto:zindasupport@gmail.com" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            📧 zindasupport@gmail.com
          </a>
          <a href="tel:+917592998150" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            📞 +91 7592998150
          </a>
          <a href="https://wa.me/917592998150?text=Hi%20Zinda%20Connect,%20I%20need%20help" target="_blank" rel="noopener noreferrer" style={linkStyle} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            💬 WhatsApp Us
          </a>
          <p style={{cursor: 'default'}}>📍Mannarkkad, Palakkad, Kerala, India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Zinda Connect. All rights reserved. | Made with ❤️ in India</p>
      </div>
    </footer>
  );
}