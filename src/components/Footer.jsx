import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const footerStyle = {
    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
    color: '#ffffff',
    padding: '50px 20px 30px',
    marginTop: '60px',
    width: '100%',
    boxSizing: 'border-box'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr',
    gap: '40px',
    marginBottom: '30px'
  };

  const h3Style = {
    fontSize: '24px',
    fontWeight: 800,
    margin: '0 0 15px 0',
    color: '#e91662',
    letterSpacing: '-0.5px'
  };

  const h4Style = {
    fontSize: '16px',
    fontWeight: 700,
    margin: '0 0 15px 0',
    color: '#ffffff',
    position: 'relative',
    paddingBottom: '10px'
  };

  const h4After = {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '30px',
    height: '3px',
    background: '#e91662',
    borderRadius: '10px'
  };

  const pStyle = {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#b0b0b0',
    margin: '8px 0',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const linkStyle = {
    ...pStyle,
    textDecoration: 'none',
    display: 'block'
  };

  const bottomStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    paddingTop: '25px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center'
  };

  const handleHover = (e) => {
    e.target.style.color = '#e91662';
    e.target.style.paddingLeft = '5px';
  };

  const handleLeave = (e) => {
    e.target.style.color = '#b0b0b0';
    e.target.style.paddingLeft = '0';
  };

  return (
    <footer style={footerStyle}>
      <div style={contentStyle}>
        <div>
          <h3 style={h3Style}>Zinda Connect</h3>
          <p style={{ ...pStyle, cursor: 'default' }}>
            India's most trusted matrimonial platform
            connecting hearts. Find your perfect life partner
            with verified profiles and premium features.
          </p>
        </div>

        <div>
          <h4 style={h4Style}>
            About
            <span style={h4After}></span>
          </h4>
          <p style={pStyle} onClick={() => navigate('/about-us')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            About Us
          </p>
          <p style={pStyle} onClick={() => navigate('/how-it-works')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            How It Works
          </p>
          <p style={pStyle} onClick={() => navigate('/success-stories')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            Success Stories
          </p>
          <p style={pStyle} onClick={() => navigate('/blog')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            Blog
          </p>
        </div>

        <div>
          <h4 style={h4Style}>
            Support
            <span style={h4After}></span>
          </h4>
          <p style={pStyle} onClick={() => navigate('/help-support')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            Help Center
          </p>
          <p style={pStyle} onClick={() => navigate('/privacy-policy')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            Privacy Policy
          </p>
          <p style={pStyle} onClick={() => navigate('/terms-conditions')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            Terms & Conditions
          </p>
          <p style={pStyle} onClick={() => navigate('/faqs')} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            FAQs
          </p>
        </div>

        <div>
          <h4 style={h4Style}>
            Contact
            <span style={h4After}></span>
          </h4>
          {/* ✅ Email - mailto */}
          <a 
            href="mailto:zindasupport@gmail.com" 
            style={linkStyle}
            onMouseEnter={handleHover} 
            onMouseLeave={handleLeave}
          >
            📧 zindasupport@gmail.com
          </a>
          
          {/* ✅ Phone - tel */}
          <a 
            href="tel:+917592998150" 
            style={linkStyle}
            onMouseEnter={handleHover} 
            onMouseLeave={handleLeave}
          >
            📞 +91 7592998150
          </a>

          {/* ✅ WhatsApp - direct message */}
          <a 
            href="https://wa.me/917592998150?text=Hi%20Zinda%20Connect,%20I%20need%20help" 
            target="_blank" 
            rel="noopener noreferrer"
            style={linkStyle}
            onMouseEnter={handleHover} 
            onMouseLeave={handleLeave}
          >
            💬 WhatsApp Us
          </a>

          <p style={{...pStyle, cursor: 'default'}}>📍 Kerala, India</p>
        </div>
      </div>

      <div style={bottomStyle}>
        <p style={{ fontSize: '13px', color: '#808080', margin: 0 }}>
          © 2026 Zinda Connect. All rights reserved. | Made with ❤️ in India
        </p>
      </div>
    </footer>
  );
}