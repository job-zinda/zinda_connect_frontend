import React from "react";

export default function AboutUs() {
  return (
    <div style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#e91662', marginBottom: '20px' }}>
        About Zinda Connect
      </h1>
      <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#495057', marginBottom: '20px' }}>
        Zinda Connect is India's most trusted matrimonial platform, dedicated to connecting hearts 
        and building lifelong relationships. We combine technology with tradition to help you find 
        your perfect life partner.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '40px' }}>
        <div style={{ padding: '25px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#e91662', marginBottom: '10px' }}>10L+ Profiles</h3>
          <p style={{ color: '#868e96', fontSize: '14px' }}>Verified and genuine profiles from across India</p>
        </div>
        <div style={{ padding: '25px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#e91662', marginBottom: '10px' }}>50K+ Success</h3>
          <p style={{ color: '#868e96', fontSize: '14px' }}>Happy couples who found their soulmate with us</p>
        </div>
        <div style={{ padding: '25px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#e91662', marginBottom: '10px' }}>100% Secure</h3>
          <p style={{ color: '#868e96', fontSize: '14px' }}>Advanced privacy and verification for your safety</p>
        </div>
      </div>
    </div>
  );
}